import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody, RequestBodyTooLargeError } from '@/lib/request-body';
import {
  createSiteSession,
  isSitePasswordConfigured,
  MIN_SITE_PASSWORD_LENGTH,
  passwordMatches,
  SITE_AUTH_COOKIE,
  SITE_SESSION_SECONDS,
} from '@/lib/site-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_CLIENTS = 1024;
const failures = new Map<string, { count: number; resetAt: number }>();

function noStoreJson(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

function clientKey(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function currentFailureState(key: string, now: number) {
  const existing = failures.get(key);
  if (!existing || existing.resetAt <= now) {
    if (failures.size >= MAX_TRACKED_CLIENTS) {
      for (const [trackedKey, state] of failures) {
        if (state.resetAt <= now) failures.delete(trackedKey);
      }
      if (failures.size >= MAX_TRACKED_CLIENTS) {
        const oldestKey = failures.keys().next().value;
        if (oldestKey !== undefined) failures.delete(oldestKey);
      }
    }
    const fresh = { count: 0, resetAt: now + ATTEMPT_WINDOW_MS };
    failures.set(key, fresh);
    return fresh;
  }
  return existing;
}

export async function GET() {
  return noStoreJson({
    configured: isSitePasswordConfigured(process.env.APP_PASSWORD),
    minimumLength: MIN_SITE_PASSWORD_LENGTH,
  });
}

export async function POST(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!isSitePasswordConfigured(password)) {
    return noStoreJson(
      { error: `A senha ainda não está configurada. Defina APP_PASSWORD com pelo menos ${MIN_SITE_PASSWORD_LENGTH} caracteres na hospedagem.` },
      503,
    );
  }

  const now = Date.now();
  const key = clientKey(request);
  const state = currentFailureState(key, now);
  if (state.count >= MAX_ATTEMPTS) {
    const response = noStoreJson(
      { error: 'Muitas tentativas. Aguarde antes de tentar novamente.' },
      429,
    );
    response.headers.set('Retry-After', String(Math.ceil((state.resetAt - now) / 1000)));
    return response;
  }

  let data: unknown;
  try {
    data = JSON.parse(await readRequestBody(request, 2048));
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return noStoreJson({ error: 'Requisição muito grande.' }, 413);
    }
    return noStoreJson({ error: 'Requisição inválida.' }, 400);
  }

  const candidate =
    data && typeof data === 'object' && 'password' in data
      ? (data as { password?: unknown }).password
      : undefined;
  if (typeof candidate !== 'string' || candidate.length > 256) {
    return noStoreJson({ error: 'Senha inválida.' }, 400);
  }
  if (!passwordMatches(candidate, password)) {
    state.count += 1;
    return noStoreJson({ error: 'Senha incorreta.' }, 401);
  }

  failures.delete(key);
  const response = noStoreJson({ ok: true });
  response.cookies.set(SITE_AUTH_COOKIE, createSiteSession(password, now), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SITE_SESSION_SECONDS,
  });
  return response;
}
