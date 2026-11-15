import { NextResponse } from 'next/server';
import { SITE_AUTH_COOKIE } from '@/lib/site-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
  response.cookies.set(SITE_AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
