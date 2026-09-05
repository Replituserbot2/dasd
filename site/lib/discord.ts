// Server-only helper for resolving a Discord user's live username, display
// name and avatar from their user ID. Uses the official Discord API with a
// bot token (DISCORD_BOT_TOKEN) — never exposed to the client. If no token
// is configured, or the lookup fails for any reason, callers should fall
// back to the manually-entered name/avatar instead.

export type DiscordUser = {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  profileUrl: string
}

type CacheEntry = { data: DiscordUser | null; expires: number }

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const cache = new Map<string, CacheEntry>()

export function isValidDiscordId(id: string): boolean {
  return /^\d{15,25}$/.test(id)
}

function defaultAvatarUrl(id: string): string {
  // Discord's formula for the default avatar of accounts on the new
  // (discriminator-less) username system. Avoids BigInt literal syntax
  // (e.g. `22n`) since it requires a newer TS compile target than this
  // project uses — BigInt() calls work at any target.
  const index = Number((BigInt(id) >> BigInt(22)) % BigInt(6))
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export async function getDiscordUser(id: string): Promise<DiscordUser | null> {
  if (!isValidDiscordId(id)) return null

  const cached = cache.get(id)
  if (cached && cached.expires > Date.now()) return cached.data

  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) return null

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      cache.set(id, { data: null, expires: Date.now() + CACHE_TTL_MS })
      return null
    }

    const json = await res.json()
    const ext = typeof json.avatar === 'string' && json.avatar.startsWith('a_') ? 'gif' : 'png'
    const avatarUrl = json.avatar
      ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.${ext}?size=256`
      : defaultAvatarUrl(String(json.id))

    const data: DiscordUser = {
      id: String(json.id),
      username: json.username,
      displayName: json.global_name || json.username,
      avatarUrl,
      profileUrl: `https://discord.com/users/${json.id}`,
    }

    cache.set(id, { data, expires: Date.now() + CACHE_TTL_MS })
    return data
  } catch {
    // Network hiccup — don't cache failures caused by transient errors for
    // as long as a real "not found", but still avoid hammering on retries.
    cache.set(id, { data: null, expires: Date.now() + 30 * 1000 })
    return null
  }
}

export async function getDiscordUsers(ids: string[]): Promise<Record<string, DiscordUser | null>> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)))
  const entries = await Promise.all(uniqueIds.map(async (id) => [id, await getDiscordUser(id)] as const))
  return Object.fromEntries(entries)
}
