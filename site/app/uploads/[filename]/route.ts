import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads')

const CONTENT_TYPES: Record<string, string> = {
  '.zip': 'application/zip',
  '.jar': 'application/java-archive',
  '.rar': 'application/vnd.rar',
  '.7z': 'application/x-7z-compressed',
  '.exe': 'application/vnd.microsoft.portable-executable',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
): Promise<NextResponse> {
  const { filename } = await context.params

  // Reject anything trying to escape the uploads folder.
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 })
  }

  const filePath = path.join(UPLOAD_DIR, filename)

  try {
    const data = await fs.readFile(filePath)
    const ext = path.extname(filename).toLowerCase()
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'
    const isInline = contentType.startsWith('image/') || contentType.startsWith('audio/')
    const disposition = isInline ? 'inline' : `attachment; filename="${filename}"`

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': disposition,
        'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=0',
      },
    })
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 })
  }
}
