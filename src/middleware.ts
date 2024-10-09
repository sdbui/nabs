// import { auth } from "@/auth"
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
 
const protectedRoutes = ['/profile/create', '/profile/edit', '/profile']
const publicRoutes = ['/'];
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  // const isPublicRoute = publicRoutes.includes(path)

  // auth() is breaking builds due to dynamic code evalutaion
  // so move the session check to out of this middleware to api route
  const checkSession = await fetch(`${req.nextUrl.origin}/api/session`, {
    headers: {
      Cookie: cookies().toString()
    }
  });
  let status = await checkSession.status;

  if (status !== 200 && isProtectedRoute) {
    const url = req.nextUrl.clone()
    url.pathname = '/api/auth/signin'
    return NextResponse.redirect(url);
  }
 
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
