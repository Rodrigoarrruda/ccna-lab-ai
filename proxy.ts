import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  if (req.method === 'POST') {
    const origin = req.headers.get('origin');
    if (origin) {
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        return new NextResponse('Origem inválida.', { status: 403 });
      }

      if (originHost !== req.headers.get('host')) {
        return new NextResponse('Origem inválida.', { status: 403 });
      }
    }
  }

  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('Cache-Control', 'private, no-store');
  }
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'same-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg).*)'],
};
