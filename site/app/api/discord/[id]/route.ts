import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { getDiscordUser, isValidDiscordId } from '@/lib/discord'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params

  if (!isValidDiscordId(id)) {
    return NextResponse.json({ error: 'That doesn\u2019t look like a valid Discord user ID.' }, { status: 400 })
  }

  if (!process.env.DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'DISCORD_BOT_TOKEN is not set on the server. Add it in your .env file to enable live Discord lookups.' },
      { status: 501 },
    )
  }

  const user = await getDiscordUser(id)
  if (!user) {
    return NextResponse.json({ error: 'No Discord user found with that ID.' }, { status: 404 })
  }

  return NextResponse.json(user)
}
