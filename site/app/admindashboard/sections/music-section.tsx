'use client'

import { Music, ExternalLink } from 'lucide-react'
import type { BackgroundMusicConfig } from '@/lib/store'
import { Field, SectionCard, Slider, TextInput, Toggle } from '../ui'

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /[?&]v=([^&#]{11})/,
    /youtu\.be\/([^?&#]{11})/,
    /\/embed\/([^?&#]{11})/,
    /\/shorts\/([^?&#]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function MusicSection({
  music,
  onUpdate,
}: {
  music: BackgroundMusicConfig
  onUpdate: (patch: Partial<BackgroundMusicConfig>) => void
}) {
  const videoId = extractYouTubeVideoId(music.youtubeUrl)

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={Music}
        title="Background music"
        description="A floating YouTube music player shown in the bottom-right corner of the site. Plays silently until the user interacts."
      >
        <div className="flex flex-col gap-5">
          <Toggle
            enabled={music.enabled}
            onChange={(v) => onUpdate({ enabled: v })}
            label="Enable music player"
            description="Shows the floating music dock on the live site"
          />

          <Field
            label="YouTube URL"
            hint="Paste any YouTube link — watch URL, youtu.be short link, or bare video ID."
          >
            <TextInput
              value={music.youtubeUrl}
              onChange={(e) => onUpdate({ youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
            {videoId ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                <span className="font-mono text-[11px] text-emerald-400">✓ Valid video ID: <strong>{videoId}</strong></span>
                <a
                  href={`https://youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                >
                  Open <ExternalLink size={10} />
                </a>
              </div>
            ) : music.youtubeUrl ? (
              <p className="font-mono text-[11px] text-red-400">⚠ Could not detect a valid YouTube video ID</p>
            ) : null}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Track title" hint="Displayed in the floating player.">
              <TextInput
                value={music.trackTitle}
                onChange={(e) => onUpdate({ trackTitle: e.target.value })}
                placeholder="Background Music"
              />
            </Field>
            <Field label="Artist (optional)" hint="Shown below the track title.">
              <TextInput
                value={music.trackArtist ?? ''}
                onChange={(e) => onUpdate({ trackArtist: e.target.value })}
                placeholder="Artist name"
              />
            </Field>
          </div>

          <Slider
            label="Default volume"
            value={music.defaultVolume}
            min={0}
            max={100}
            unit="%"
            hint="Volume level when the player is first opened."
            onChange={(v) => onUpdate({ defaultVolume: v })}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              enabled={music.autoplay}
              onChange={(v) => onUpdate({ autoplay: v })}
              label="Autoplay"
              description="Starts on first page interaction (browsers block sound before interaction)"
            />
            <Toggle
              enabled={music.loop}
              onChange={(v) => onUpdate({ loop: v })}
              label="Loop"
              description="Automatically restarts when the video ends"
            />
          </div>
        </div>
      </SectionCard>

      {/* Thumbnail preview */}
      {videoId && (
        <SectionCard icon={Music} title="Video preview">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/40">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`}
              className="h-full w-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Music preview"
            />
          </div>
        </SectionCard>
      )}
    </div>
  )
}
