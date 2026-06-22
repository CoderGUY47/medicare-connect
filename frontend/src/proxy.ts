import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Guard dashboard routes with JWT role verification
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('mc_jwt_token')?.value;
    const email = request.cookies.get('mc_user_email')?.value;


    
    // If not authenticated, redirect immediately to login
    if (!token || !email) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Parse simulated token payload to extract role prefix from userId
    // Token structure: "mock-jwt-header.payload-{userId}.signature"
    const userIdMatch = token.match(/payload-([a-zA-Z0-9\-]+)/);
    const userId = userIdMatch ? userIdMatch[1] : '';
    
    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Role matching redirects
    if (pathname.startsWith('/dashboard/patient') && !userId.startsWith('pat') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard/doctor') && !userId.startsWith('doc') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard/admin') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard/nurse') && !userId.startsWith('nurse') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard/lab') && !userId.startsWith('lab') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard/pharmacist') && !userId.startsWith('pharm') && !userId.startsWith('admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Fallback / standard auth session check for profile/other matched paths using Better Auth
  if (pathname.startsWith('/profile')) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
