import type { Metadata } from 'next'
import { getContent } from '@/lib/store'
import { getDiscordUsers } from '@/lib/discord'
import HomeClient from './home-client'

// This page reads saved admin content on every request — without this,
// Next.js prerenders it once at build time and admin edits never show up.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  return {
    title: `${content.siteName} — ${content.heroTitle}`,
    description: content.heroSubtitle,
  }
}

export default async function Page() {
  const content = await getContent()
  const discordIds = content.team.map((m) => m.discordId).filter((id): id is string => !!id)
  const discordUsers = await getDiscordUsers(discordIds)
  return <HomeClient content={content} discordUsers={discordUsers} />
}
