import { NextResponse } from 'next/server'
import { COOKIE_NAME, checkCredentials, makeToken } from '@/lib/auth'

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not set on the server. Add it in your .env file.' },
      { status: 500 },
    )
  }

  let username = ''
  let password = ''
  try {
    const body = await req.json()
    username = typeof body?.username === 'string' ? body.username : ''
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, makeToken(username, password), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
