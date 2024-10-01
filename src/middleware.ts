import { auth } from "@/auth"
import { NextRequest, NextResponse } from 'next/server'
 
const protectedRoutes = ['/profile/create', '/profile/edit', '/profile']
const publicRoutes = ['/'];
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  // const isPublicRoute = publicRoutes.includes(path)

  const session = await auth();
  if (!session && isProtectedRoute) {
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
