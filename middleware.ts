import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/teams") ||
    request.nextUrl.pathname.startsWith("/matches") ||
    request.nextUrl.pathname.startsWith("/tournaments") ||
    request.nextUrl.pathname.startsWith("/statistics");

  // Se está numa rota protegida sem token → login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Se está autenticado e tenta ir para login/signup → dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
