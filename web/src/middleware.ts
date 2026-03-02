import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const url = token ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(url, request.url));
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPrivateRoute = pathname.startsWith("/dashboard");

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};