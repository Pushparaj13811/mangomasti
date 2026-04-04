import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    // If no session token, redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: We can't easily verify the session here without a database call
    // The session verification will happen in the server components/actions
    // This middleware just does a basic check for the cookie existence
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname === "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
