// pages/api/check-session.js
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

// const protectedRoutes = ['/profile/create', '/profile/edit', '/profile']
// const publicRoutes = ['/'];

export async function GET(request: NextRequest) {
  // const isProtectedRoute = protectedRoutes.includes(path)

  const session = await auth();
  console.log('session...')
  if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, {status: 401});
  }
  return NextResponse.json({message: 'ok'}, {status: 200})
}