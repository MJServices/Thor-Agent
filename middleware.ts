import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ["/chat", "/admin"];

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to signin if no token
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      // Redirect to signin if token is invalid
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Additional check for admin routes
    if (pathname.startsWith("/admin")) {
      // For now, we'll allow access to admin routes if authenticated
      // The actual admin check will be done in the API routes and pages
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/chat/:path*", "/admin/:path*"],
};
