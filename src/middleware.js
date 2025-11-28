import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const tokenCookie = req.cookies.get('token');
    const token = tokenCookie?.value;

    const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/register');
    const isProtectedPage = pathname.startsWith('/admin/dashboard') || pathname === '/';

    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not set in environment variables.");
        // In development, you might want to allow access, but in production, this is a critical failure.
        // For now, we'll just log the error and let the request proceed, but this should be handled.
        return NextResponse.next();
    }
    
    // If trying to access auth page while logged in, redirect to dashboard
    if (isAuthPage && token) {
        try {
            await jwtVerify(token, JWT_SECRET);
            // Valid token, redirect from login/register to dashboard
            const url = req.nextUrl.clone();
            url.pathname = '/admin/dashboard';
            return NextResponse.redirect(url);
        } catch (error) {
            // Invalid token, allow access to auth page
        }
    }

    // If trying to access a protected page without a token, redirect to login
    if (isProtectedPage && !token) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
    }
    
    // If trying to access a protected page with a token, verify it
    if(isProtectedPage && token) {
        try {
            await jwtVerify(token, JWT_SECRET);
            // Token is valid, allow access
            return NextResponse.next();
        } catch (error) {
            // Token is invalid, redirect to login and clear the bad cookie
            const url = req.nextUrl.clone();
            url.pathname = '/admin/login';
            const response = NextResponse.redirect(url);
            response.cookies.set('token', '', { maxAge: -1 }); // Clear cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|invitation|.*\\..*).*)',
        '/', // Ensure the root is always matched
    ],
};
