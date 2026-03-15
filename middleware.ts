import { createServerClient, serialize, parseCookieHeader } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Protect routes
  const protectedRoutes = ['/dashboard', '/profile', '/orders', '/services', '/browse'];
  const authRoutes = ['/auth/login', '/auth/signup'];
  
  // Create a Supabase client with the request cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response = NextResponse.next();
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser();

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Redirect to login if accessing protected route without authentication
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthRoute && user) {
    // Redirect to home if already authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
