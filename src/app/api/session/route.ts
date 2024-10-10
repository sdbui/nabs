// pages/api/check-session.js
import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export async function GET() {

  const session = await auth();
  if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, {status: 401});
  }
  return NextResponse.json({message: 'ok'}, {status: 200})
}