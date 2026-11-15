import { NextRequest, NextResponse } from 'next/server';
import { isSitePasswordConfigured, isSiteSessionValid, SITE_AUTH_COOKIE } from './lib/site-auth';
import { homepageMarkdown, siteUrl } from './lib/site-discovery';

function secureResponse(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPublicAuthRoute =
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/logout';
  const hasValidSession = isSiteSessionValid(
    req.cookies.get(SITE_AUTH_COOKIE)?.value,
    process.env.APP_PASSWORD,
  );

  if (!isPublicAuthRoute && pathname !== '/robots.txt' && !hasValidSession) {
    if (pathname.startsWith('/api/')) {
      return secureResponse(
        NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 }),
      );
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = isSitePasswordConfigured(process.env.APP_PASSWORD) ? '' : '?setup=1';
    return secureResponse(NextResponse.redirect(loginUrl));
  }

  if (pathname === '/login' && hasValidSession) {
    return secureResponse(NextResponse.redirect(new URL('/', req.url)));
  }

  if (
    req.method === 'GET' &&
    pathname === '/' &&
    req.headers.get('accept')?.includes('text/markdown')
  ) {
    const response = secureResponse(
      new NextResponse(homepageMarkdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Link: `<${siteUrl}/llms.txt>; rel="alternate"; type="text/plain"`,
        },
      }),
    );
    return response;
  }

  if (req.method === 'POST') {
    const origin = req.headers.get('origin');
    if (origin) {
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        return secureResponse(new NextResponse('Origem inválida.', { status: 403 }));
      }

      if (originHost !== req.headers.get('host')) {
        return secureResponse(new NextResponse('Origem inválida.', { status: 403 }));
      }
    }
  }

  const res = secureResponse(NextResponse.next());
  if (pathname === '/' && hasValidSession) {
    res.headers.set(
      'Link',
      `<${siteUrl}/llms.txt>; rel="alternate"; type="text/plain"`,
    );
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg).*)'],
};
