import { promises as fs } from 'fs'
import path from 'path'

export type Version = { id: string; version: string; date: string; size: string; file: string; fileUrl?: string }

export type SiteContent = {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  downloadName: string
  versions: Version[]
  featuredVersionId: string
}

export const defaultContent: SiteContent = {
  siteName: 'Stratoukos Client',
  heroTitle: 'STRATOUKOS CLIENT',
  heroSubtitle: 'Dominate with the sharpest HUD overlay ever created.',
  downloadName: 'Stratoukos Client v2.4.0',
  versions: [
    { id: 'v1', version: 'v2.4.0', date: 'Aug 18, 2026', size: '18.4 MB', file: 'Stratoukos-Client-v2.4.0.zip' },
    { id: 'v2', version: 'v2.3.1', date: 'Jul 29, 2026', size: '17.9 MB', file: 'Stratoukos-Client-v2.3.1.zip' },
    { id: 'v3', version: 'v2.2.0', date: 'Jun 14, 2026', size: '16.8 MB', file: 'Stratoukos-Client-v2.2.0.zip' },
  ],
  featuredVersionId: 'v1',
}

// Fills in ids/featuredVersionId for content saved before those fields
// existed, and makes sure featuredVersionId always points at a real entry.
function migrate(content: SiteContent): SiteContent {
  const versions = (content.versions ?? []).map((v, i) => ({
    ...v,
    id: v.id || `legacy-${i}-${v.version || i}`,
  }))
  const featuredVersionId =
    content.featuredVersionId && versions.some((v) => v.id === content.featuredVersionId)
      ? content.featuredVersionId
      : versions[0]?.id || ''
  return { ...content, versions, featuredVersionId }
}

const KEY = 'site-content'
const FILE = path.join(process.cwd(), 'data', 'content.json')

function hasKv() {
  return !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN
}

async function readLocalFile(): Promise<SiteContent | null> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function writeLocalFile(content: SiteContent) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(content, null, 2), 'utf-8')
}

export async function getContent(): Promise<SiteContent> {
  if (hasKv()) {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const data = await redis.get<SiteContent>(KEY)
    return migrate(data ?? defaultContent)
  }
  const data = await readLocalFile()
  return migrate(data ?? defaultContent)
}

export async function setContent(content: SiteContent): Promise<void> {
  if (hasKv()) {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    await redis.set(KEY, content)
    return
  }
  await writeLocalFile(content)
}
