'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  ExternalLink,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { BackgroundMusicConfig } from '@/lib/store'

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void
            onStateChange?: (event: { data: number }) => void
            onError?: (event: unknown) => void
          }
          playerVars?: Record<string, unknown>
        },
      ) => YTPlayerInstance
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTPlayerInstance {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (vol: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  destroy?: () => void
}

export function extractYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null
  const trimmed = urlOrId.trim()
  // Raw 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  // Standard or short URLs
  const regExp =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|.+[?&]v=))([a-zA-Z0-9_-]{11})/
  const match = trimmed.match(regExp)
  return match ? match[1] : null
}

export default function MusicPlayer({ config }: { config: BackgroundMusicConfig }) {
  const { enabled, youtubeUrl, trackTitle, trackArtist, defaultVolume, autoplay, loop } = config
  const videoId = extractYouTubeVideoId(youtubeUrl)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(() =>
    typeof defaultVolume === 'number' ? Math.max(0, Math.min(100, defaultVolume)) : 30,
  )
  const [isReady, setIsReady] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const playerRef = useRef<YTPlayerInstance | null>(null)
  const containerId = useRef(`yt-player-${Math.random().toString(36).slice(2, 9)}`)
  const hasAutoStarted = useRef(false)

  // Initialize YouTube Iframe API
  useEffect(() => {
    if (!enabled || !videoId) return

    let isMounted = true

    const onScriptReady = () => {
      if (!window.YT || !window.YT.Player) return
      try {
        const player = new window.YT.Player(containerId.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return
              playerRef.current = event.target
              event.target.setVolume(volume)
              setIsReady(true)

              if (autoplay && !hasAutoStarted.current) {
                // Try playing; if browser blocks it, listen for user interaction
                try {
                  event.target.playVideo()
                } catch {
                  // Browser policy blocked; interaction handler below will catch it
                }
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return
              const state = event.data
              if (window.YT?.PlayerState) {
                if (state === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true)
                } else if (state === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false)
                } else if (state === window.YT.PlayerState.ENDED) {
                  if (loop && playerRef.current) {
                    playerRef.current.seekTo(0)
                    playerRef.current.playVideo()
                  } else {
                    setIsPlaying(false)
                  }
                }
              }
            },
          },
        })
      } catch (err) {
        console.warn('YouTube Player init error:', err)
      }
    }

    if (!window.YT || !window.YT.Player) {
      const existingScript = document.getElementById('yt-iframe-api')
      if (!existingScript) {
        const tag = document.createElement('script')
        tag.id = 'yt-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback()
        onScriptReady()
      }
    } else {
      onScriptReady()
    }

    return () => {
      isMounted = false
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy()
        } catch {
          // ignore
        }
      }
      playerRef.current = null
      setIsReady(false)
      setIsPlaying(false)
    }
  }, [enabled, videoId, loop])

  // Autoplay on first interaction if blocked initially
  useEffect(() => {
    if (!autoplay || !enabled || !isReady || hasAutoStarted.current) return

    const handleFirstInteraction = () => {
      if (!hasAutoStarted.current && playerRef.current) {
        hasAutoStarted.current = true
        playerRef.current.playVideo()
      }
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [autoplay, enabled, isReady])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }, [isMuted])

  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol)
    if (playerRef.current) {
      playerRef.current.setVolume(newVol)
      if (newVol > 0 && isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      }
    }
  }, [isMuted])

  if (!enabled || !videoId) return null

  return (
    <>
      {/* Hidden YouTube Iframe Mount */}
      <div className="fixed -top-96 left-0 h-1 w-1 opacity-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div id={containerId.current} />
      </div>

      {/* Floating Music Dock */}
      <aside
        aria-label="Background audio player"
        className="fixed bottom-5 right-5 z-40 transition-all duration-300 select-none font-mono"
      >
        <div
          className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ${
            isMinimized ? 'w-auto' : 'w-80 sm:w-88'
          }`}
          style={{
            borderColor: isPlaying ? 'var(--neon)' : undefined,
            boxShadow: isPlaying ? '0 0 25px var(--neon)' : undefined,
          }}
        >
          {/* Minimized Pill */}
          {isMinimized ? (
            <div className="flex items-center gap-2 p-2.5">
              <button
                onClick={togglePlay}
                disabled={!isReady}
                className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_12px_var(--neon)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-2 px-2 text-left"
                aria-label="Expand player"
              >
                <Disc3
                  size={16}
                  className={`text-primary shrink-0 ${isPlaying ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '4s' }}
                />
                <span className="truncate max-w-[120px] text-xs font-bold text-foreground">
                  {trackTitle || 'Background Music'}
                </span>
                <ChevronUp size={14} className="text-muted-foreground" />
              </button>
            </div>
          ) : (
            /* Full Player Card */
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Music size={14} />
                    {isPlaying && (
                      <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary animate-ping" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">
                      {trackTitle || 'Stratoukos Radio'}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {trackArtist || 'YouTube Stream'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                    title="Open on YouTube"
                    aria-label="Open on YouTube"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Minimize player"
                    aria-label="Minimize player"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Visualizer & Controls */}
              <div className="mt-3.5 flex items-center justify-between gap-3">
                {/* Visualizer Bars */}
                <div className="flex items-end gap-1 h-5 px-1">
                  {[40, 75, 100, 50, 85].map((baseHeight, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-primary transition-all duration-200"
                      style={{
                        height: isPlaying ? `${Math.max(20, (baseHeight * (volume / 100)))}%` : '20%',
                        opacity: isPlaying ? 0.9 : 0.3,
                        animation: isPlaying ? `pulse 1.${i + 2}s infinite alternate ease-in-out` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Center Play/Pause */}
                <button
                  onClick={togglePlay}
                  disabled={!isReady}
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_24px_var(--neon)] disabled:opacity-50"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                </button>

                {/* Volume & Mute */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-16 h-1 rounded-lg appearance-none cursor-pointer bg-border accent-primary"
                    aria-label="Volume slider"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
