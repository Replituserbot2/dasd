import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'

// Files are saved straight onto this server's disk, into /public/uploads.
// Next.js serves everything under /public as a static file automatically,
// so a saved file at public/uploads/foo.zip becomes downloadable at
// https://yourdomain.com/uploads/foo.zip with no extra code needed.
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE_BYTES = 500 * 1024 * 1024 // 500 MB

// Keep the filename but strip anything that isn't safe on disk / in a URL,
// and add a short random suffix so two uploads with the same name never
// collide or overwrite each other.
function safeFilename(original: string): string {
  const ext = path.extname(original)
  const base = path
    .basename(original, ext)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 80)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base}-${suffix}${ext}`
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength && contentLength > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File is too large. Max upload size is 500 MB.' },
      { status: 413 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Could not read upload.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File is too large. Max upload size is 500 MB.' },
      { status: 413 },
    )
  }

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    const filename = safeFilename(file.name || 'upload.bin')
    const bytes = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save file to disk.' },
      { status: 500 },
    )
  }
}
