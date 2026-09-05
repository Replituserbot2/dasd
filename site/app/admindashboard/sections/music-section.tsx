'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Music,
  Radio,
  Volume2,
} from 'lucide-react'
import type { BackgroundMusicConfig } from '@/lib/store'
import { extractYouTubeVideoId } from '@/components/music-player'
import { Field, SectionCard, SmallInput, TextInput } from '../ui'

export default function MusicSection({
  music,
  onUpdate,
}: {
  music: BackgroundMusicConfig
  onUpdate: (patch: Partial<BackgroundMusicConfig>) => void
}) {
  const detectedVideoId = extractYouTubeVideoId(music.youtubeUrl)
  const isUrlValid = Boolean(detectedVideoId)

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={Music}
        title="Background Music Player"
        description="Stream background music or soundtracks on your site using any YouTube video or livestream."
      >
        <div className="flex flex-col gap-5">
          {/* Enable / Disable Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Enable background music
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shows the floating music dock in the bottom corner of the site
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdate({ enabled: !music.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                music.enabled ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={music.enabled}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  music.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* YouTube URL */}
          <Field label="YouTube Video URL or Video ID">
            <TextInput
              value={music.youtubeUrl}
              onChange={(e) => onUpdate({ youtubeUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or video ID"
            />
          </Field>

          {/* URL Validation Feedback */}
          {music.youtubeUrl && (
            <div>
              {isUrlValid ? (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 font-mono text-xs text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Valid YouTube ID: <strong className="text-foreground">{detectedVideoId}</strong>
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${detectedVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Open <ExternalLink size={11} />
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 font-mono text-xs text-amber-400">
                  <AlertTriangle size={14} />
                  Could not find a YouTube video ID. Paste a standard YouTube link or 11-character video ID.
                </div>
              )}
            </div>
          )}

          {/* Track Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Track title (shown in player)">
              <SmallInput
                value={music.trackTitle}
                onChange={(e) => onUpdate({ trackTitle: e.target.value })}
                placeholder="e.g. Synthwave Gaming Beats"
              />
            </Field>

            <Field label="Artist / Subtitle (optional)">
              <SmallInput
                value={music.trackArtist || ''}
                onChange={(e) => onUpdate({ trackArtist: e.target.value })}
                placeholder="e.g. Stratoukos Radio"
              />
            </Field>
          </div>

          {/* Default Volume Slider */}
          <Field label={`Default volume (${music.defaultVolume}%)`}>
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="100"
                value={music.defaultVolume}
                onChange={(e) => onUpdate({ defaultVolume: Number(e.target.value) })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-card border border-border/50 accent-primary"
              />
              <span className="font-mono text-xs font-bold w-10 text-right">
                {music.defaultVolume}%
              </span>
            </div>
          </Field>

          {/* Checkboxes: Autoplay & Loop */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-border/40">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={music.autoplay}
                onChange={(e) => onUpdate({ autoplay: e.target.checked })}
                className="mt-0.5 size-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <div>
                <p className="font-mono text-xs font-bold text-foreground">
                  Autoplay on first click
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Starts playing automatically when visitor interacts with the page
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={music.loop}
                onChange={(e) => onUpdate({ loop: e.target.checked })}
                className="mt-0.5 size-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <div>
                <p className="font-mono text-xs font-bold text-foreground">
                  Loop continuously
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Replays the music automatically when the video reaches the end
                </p>
              </div>
            </label>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
