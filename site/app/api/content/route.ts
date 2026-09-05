import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { getContent, setContent, type SiteContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const content = await getContent()
  return NextResponse.json(content)
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: SiteContent
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (
    typeof body?.siteName !== 'string' ||
    typeof body?.heroTitle !== 'string' ||
    typeof body?.heroSubtitle !== 'string' ||
    typeof body?.downloadName !== 'string' ||
    typeof body?.featuredVersionId !== 'string' ||
    !Array.isArray(body?.versions) ||
    !Array.isArray(body?.faqs) ||
    !Array.isArray(body?.team)
  ) {
    return NextResponse.json({ error: 'Malformed content payload.' }, { status: 400 })
  }

  await setContent(body)
  return NextResponse.json({ ok: true })
}
