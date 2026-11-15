import { createHmac, timingSafeEqual } from 'node:crypto';

export const SITE_AUTH_COOKIE = 'ccna_access';
export const SITE_SESSION_SECONDS = 7 * 24 * 60 * 60;
export const MIN_SITE_PASSWORD_LENGTH = 16;

export function isSitePasswordConfigured(password: string | undefined): password is string {
  return Boolean(password && Array.from(password).length >= MIN_SITE_PASSWORD_LENGTH);
}

function sessionSignature(password: string, expiresAt: string): string {
  return createHmac('sha256', password)
    .update(`ccna-lab-session:v1:${expiresAt}`)
    .digest('base64url');
}

export function createSiteSession(password: string, now = Date.now()): string {
  const expiresAt = String(Math.floor(now / 1000) + SITE_SESSION_SECONDS);
  return `${expiresAt}.${sessionSignature(password, expiresAt)}`;
}

export function isSiteSessionValid(
  token: string | undefined,
  password: string | undefined,
  now = Date.now(),
): boolean {
  if (!token || !isSitePasswordConfigured(password)) return false;

  const [expiresAt, signature, extra] = token.split('.');
  if (
    extra !== undefined ||
    !/^\d{10}$/.test(expiresAt) ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) {
    return false;
  }

  const expiry = Number(expiresAt);
  const nowSeconds = Math.floor(now / 1000);
  if (
    !Number.isSafeInteger(expiry) ||
    expiry <= nowSeconds ||
    expiry > nowSeconds + SITE_SESSION_SECONDS
  ) {
    return false;
  }

  const expected = Buffer.from(sessionSignature(password, expiresAt));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function passwordMatches(candidate: string, expected: string): boolean {
  const candidateHash = createHmac('sha256', 'ccna-password-comparison')
    .update(candidate)
    .digest();
  const expectedHash = createHmac('sha256', 'ccna-password-comparison')
    .update(expected)
    .digest();
  return timingSafeEqual(candidateHash, expectedHash);
}
