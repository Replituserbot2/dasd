import { cookies } from 'next/headers'
import crypto from 'crypto'

export const COOKIE_NAME = 'admin_session'

function getUsername(): string {
  return process.env.ADMIN_USERNAME || 'Stratoukos'
}

function getPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD
}

// Derive a session token from the configured username+password so it
// changes automatically if either is ever rotated, without storing the
// password itself in the cookie.
export function makeToken(username: string, password: string): string {
  return crypto.createHash('sha256').update(`${username}:${password}`).digest('hex')
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = getUsername()
  const expectedPass = getPassword()
  if (!expectedPass) return false
  return username === expectedUser && password === expectedPass
}

export async function isAuthed(): Promise<boolean> {
  const password = getPassword()
  if (!password) return false
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return token === makeToken(getUsername(), password)
}
