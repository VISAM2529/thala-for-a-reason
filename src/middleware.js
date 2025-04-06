import { NextResponse } from 'next/server';

export function middleware(request) {
  const { nextUrl, cookies } = request;
  const token = cookies.get('next-auth.session-token') || cookies.get('__Secure-next-auth.session-token');
  const isLoggedIn = !!token;

  const protectedPaths = ['/submit', '/profile'];
  const isProtectedPath = protectedPaths.some(path =>
    nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((nextUrl.pathname === '/login' || nextUrl.pathname === '/register') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
