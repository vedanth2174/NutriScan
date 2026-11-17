import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

async function csrfToken() {
  const response = await fetch('/api/auth/csrf', { cache: 'no-store' })
  if (!response.ok) throw new Error('Could not start authentication.')

  const body = (await response.json()) as { csrfToken?: unknown }

  if (typeof body.csrfToken !== 'string' || !body.csrfToken) {
    throw new Error('Authentication is unavailable.')
  }

  return body.csrfToken
}

export async function startGoogleSignIn() {
  if (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === 'android'
  ) {
    await Browser.open({
      url: `${window.location.origin}/api/app-auth/google/start`,
    })
    return
  }

  const csrf = await csrfToken()

  const response = await fetch('/api/auth/signin/google', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-auth-return-redirect': '1',
    },
    body: new URLSearchParams({ csrfToken: csrf, callbackUrl: '/' }),
  })

  const body = (await response.json().catch(() => null)) as
    | { url?: unknown }
    | null

  if (!response.ok || typeof body?.url !== 'string' || body.url.includes('error=')) {
    throw new Error('Google sign-in could not start.')
  }

  window.location.assign(body.url)
}

export async function redeemGoogleHandoff(code: string) {
  const response = await fetch('/api/app-auth/google/redeem', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code }),
    cache: 'no-store',
  })

  const body = (await response.json().catch(() => null)) as {
    ok?: boolean
    message?: string
  } | null

  if (!response.ok || !body?.ok) {
    throw new Error(body?.message || 'Google sign-in could not be completed.')
  }
}

export async function endAuthSession() {
  const csrf = await csrfToken()

  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-auth-return-redirect': '1',
    },
    body: new URLSearchParams({ csrfToken: csrf, callbackUrl: '/' }),
  })

  if (!response.ok) throw new Error('Sign-out failed.')
}