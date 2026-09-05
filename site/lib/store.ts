import { promises as fs } from 'fs'
import path from 'path'

export type Version = { id: string; version: string; date: string; size: string; file: string; fileUrl?: string }
export type Faq = { id: string; question: string; answer: string }

// discordId is the source of truth when set — the live Discord username,
// display name and avatar are looked up by ID at render time. name/role and
// avatarUrl are the manual fallback used when no Discord ID is set, or when
// the lookup fails (e.g. no bot token configured on the server).
export type TeamMember = {
  id: string
  name: string
  role: string
  avatarUrl?: string
  discordId?: string
  discordUrl?: string
}

export const FEATURE_ICONS = [
  'gauge',
  'code',
  'lock',
  'zap',
  'shield',
  'star',
  'rocket',
  'trophy',
  'sparkles',
  'users',
  'gamepad',
  'heart',
] as const
export type FeatureIcon = (typeof FEATURE_ICONS)[number]

export type Feature = { id: string; icon: FeatureIcon; title: string; text: string }
export type HeroBadge = { id: string; text: string }

export type ShowcaseItem = {
  id: string
  title: string
  description: string
  tag?: string
  imageUrl: string
}

export type BackgroundMusicConfig = {
  enabled: boolean
  youtubeUrl: string
  trackTitle: string
  trackArtist?: string
  defaultVolume: number // 0 - 100
  autoplay: boolean
  loop: boolean
}

// 'video' = mp4/webm uploads, 'image' = gif/webp/png animated files
export type SiteBackground = {
  enabled: boolean
  type: 'video' | 'image'
  url: string
  opacity: number        // 0-100, background layer opacity
  overlayOpacity: number // 0-100, dark overlay above background, under content
  blur: number           // 0-20px gaussian blur on the background
}

export type SiteContent = {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  downloadName: string
  accentColor: string
  heroBadges: HeroBadge[]
  features: Feature[]
  showcaseTitle: string
  showcaseSubtitle: string
  showcase: ShowcaseItem[]
  background: SiteBackground
  music: BackgroundMusicConfig
  versions: Version[]
  featuredVersionId: string
  faqs: Faq[]
  team: TeamMember[]
  footerTagline: string
}

export const defaultContent: SiteContent = {
  siteName: 'Stratoukos Client',
  heroTitle: 'STRATOUKOS CLIENT',
  heroSubtitle: 'Dominate with the sharpest HUD overlay ever created.',
  downloadName: 'Stratoukos Client v2.4.0',
  accentColor: '#ef2d43',
  heroBadges: [
    { id: 'b1', text: 'Optimized HUD' },
    { id: 'b2', text: 'PvP ready' },
    { id: 'b3', text: 'Zero distractions' },
  ],
  features: [
    { id: 'ft1', icon: 'gauge', title: 'Performance first', text: 'Lightweight design that never compromises your FPS. Stay competitive.' },
    { id: 'ft2', icon: 'code', title: 'Pixel perfect', text: 'Every detail is crafted for clarity. See everything that matters instantly.' },
    { id: 'ft3', icon: 'lock', title: 'Privacy focused', text: 'Works offline. No tracking. Your setup stays private and secure.' },
  ],
  showcaseTitle: 'Client Interface & HUD',
  showcaseSubtitle: 'Experience the sleek, distraction-free interface engineered for maximum clarity and competitive edge.',
  showcase: [],
  background: {
    enabled: false,
    type: 'video',
    url: '',
    opacity: 30,
    overlayOpacity: 55,
    blur: 0,
  },
  music: {
    enabled: false,
    youtubeUrl: '',
    trackTitle: 'Background Music',
    trackArtist: '',
    defaultVolume: 30,
    autoplay: false,
    loop: true,
  },
  versions: [
    { id: 'v1', version: 'v2.4.0', date: 'Aug 18, 2026', size: '18.4 MB', file: 'Stratoukos-Client-v2.4.0.zip' },
    { id: 'v2', version: 'v2.3.1', date: 'Jul 29, 2026', size: '17.9 MB', file: 'Stratoukos-Client-v2.3.1.zip' },
    { id: 'v3', version: 'v2.2.0', date: 'Jun 14, 2026', size: '16.8 MB', file: 'Stratoukos-Client-v2.2.0.zip' },
  ],
  featuredVersionId: 'v1',
  faqs: [
    { id: 'f1', question: 'What is Stratoukos Client?', answer: 'Stratoukos Client is a premium HUD overlay designed for competitive gaming, offering clean visuals and zero distractions.' },
    { id: 'f2', question: 'Is it compatible with my launcher?', answer: 'Stratoukos Client supports all major launchers including Minecraft, Lunar Client, and Feather Client.' },
    { id: 'f3', question: 'How do I install it?', answer: 'Download the latest version, extract the zip file, and follow the included installation guide. Setup takes less than 2 minutes.' },
    { id: 'f4', question: 'Does it affect performance?', answer: 'No. Stratoukos Client is optimized to have minimal impact on your frame rate, typically adding less than 1% overhead.' },
    { id: 'f5', question: 'Is my data safe?', answer: 'Yes. Stratoukos Client runs locally with no tracking or data collection. Your settings stay on your machine.' },
  ],
  team: [
    { id: 't1', name: 'Design & Development', role: 'Core team' },
    { id: 't2', name: 'Community', role: 'Beta testers and feedback contributors' },
    { id: 't3', name: 'Special Thanks', role: 'Everyone making Stratoukos Client possible' },
  ],
  footerTagline: 'Built for competitive excellence.',
}

// Fills in ids/defaults for content saved before newer fields existed, and
// makes sure featuredVersionId always points at a real entry.
function migrate(content: SiteContent): SiteContent {
  const versions = (content.versions ?? []).map((v, i) => ({
    ...v,
    id: v.id || `legacy-${i}-${v.version || i}`,
  }))
  const featuredVersionId =
    content.featuredVersionId && versions.some((v) => v.id === content.featuredVersionId)
      ? content.featuredVersionId
      : versions[0]?.id || ''
  const faqs = (content.faqs ?? defaultContent.faqs).map((f, i) => ({ ...f, id: f.id || `faq-${i}` }))
  const team = (content.team ?? defaultContent.team).map((t, i) => ({ ...t, id: t.id || `team-${i}` }))
  const heroBadges = (content.heroBadges ?? defaultContent.heroBadges).map((b, i) => ({
    ...b,
    id: b.id || `badge-${i}`,
  }))
  const features = (content.features ?? defaultContent.features).map((f, i) => ({
    ...f,
    id: f.id || `feature-${i}`,
    icon: FEATURE_ICONS.includes(f.icon) ? f.icon : 'star',
  }))
  const showcase = (content.showcase ?? defaultContent.showcase).map((s, i) => ({
    ...s,
    id: s.id || `showcase-${i}`,
    title: s.title ?? '',
    description: s.description ?? '',
    tag: s.tag ?? 'Showcase',
    imageUrl: s.imageUrl ?? '',
  }))
  const music: BackgroundMusicConfig = {
    enabled: content.music?.enabled ?? defaultContent.music.enabled,
    youtubeUrl: content.music?.youtubeUrl ?? defaultContent.music.youtubeUrl,
    trackTitle: content.music?.trackTitle ?? defaultContent.music.trackTitle,
    trackArtist: content.music?.trackArtist ?? defaultContent.music.trackArtist,
    defaultVolume:
      typeof content.music?.defaultVolume === 'number'
        ? content.music.defaultVolume
        : defaultContent.music.defaultVolume,
    autoplay: content.music?.autoplay ?? defaultContent.music.autoplay,
    loop: content.music?.loop ?? defaultContent.music.loop,
  }
  const background: SiteBackground = {
    enabled: content.background?.enabled ?? defaultContent.background.enabled,
    type: content.background?.type === 'image' ? 'image' : 'video',
    url: content.background?.url ?? defaultContent.background.url,
    opacity:
      typeof content.background?.opacity === 'number'
        ? content.background.opacity
        : defaultContent.background.opacity,
    overlayOpacity:
      typeof content.background?.overlayOpacity === 'number'
        ? content.background.overlayOpacity
        : defaultContent.background.overlayOpacity,
    blur:
      typeof content.background?.blur === 'number'
        ? content.background.blur
        : defaultContent.background.blur,
  }
  return {
    ...content,
    versions,
    featuredVersionId,
    faqs,
    team,
    heroBadges,
    features,
    showcaseTitle: content.showcaseTitle ?? defaultContent.showcaseTitle,
    showcaseSubtitle: content.showcaseSubtitle ?? defaultContent.showcaseSubtitle,
    showcase,
    background,
    music,
    accentColor: content.accentColor || defaultContent.accentColor,
    footerTagline: content.footerTagline ?? defaultContent.footerTagline,
  }
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
