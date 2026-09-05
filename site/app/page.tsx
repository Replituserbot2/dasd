import { getContent } from '@/lib/store'
import HomeClient from './home-client'

// This page reads saved admin content on every request — without this,
// Next.js prerenders it once at build time and admin edits never show up.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getContent()
  return <HomeClient content={content} />
}
