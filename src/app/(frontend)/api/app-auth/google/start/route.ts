import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const callbackUrl = new URL(
    '/api/app-auth/google/complete',
    request.url,
  ).toString()

  const signInUrl = new URL('/api/auth/signin/google', request.url)
  signInUrl.searchParams.set('callbackUrl', callbackUrl)

  return NextResponse.redirect(signInUrl)
}