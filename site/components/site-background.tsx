'use client'

import { useEffect, useRef } from 'react'
import type { SiteBackground } from '@/lib/store'

/**
 * SiteBackgroundLayer
 *
 * Renders a full-viewport fixed background with seamless atmospheric vignette.
 * Features:
 *   - Automatic radial vignette blend so any image, video, or pattern fits in
 *     seamlessly with the dark UI without looking pasted on.
 *   - Built-in atmospheric dark Minecraft block texture fallback when no custom
 *     media is active (matches authentic Minecraft launchers).
 *   - MP4 / WebM video & Animated GIF / WebP / APNG / image support.
 */
export default function SiteBackgroundLayer({ bg }: { bg?: SiteBackground }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (bg?.type === 'video' && videoRef.current) {
      videoRef.current.load()
    }
  }, [bg?.url, bg?.type])

  const hasCustomMedia = !!(bg?.enabled && bg.url)

  const mediaStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    opacity: (bg?.opacity ?? 30) / 100,
    filter: (bg?.blur ?? 0) > 0 ? `blur(${bg!.blur}px)` : undefined,
    zIndex: -30,
    transform: (bg?.blur ?? 0) > 0 ? `scale(${1 + bg!.blur * 0.01})` : undefined,
    pointerEvents: 'none',
  }

  const overlayOpacity = (bg?.overlayOpacity ?? 55) / 100

  return (
    <>
      {/* ── Base Dark Minecraft Texture (Always ensures seamless depth) ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-35"
        style={{
          backgroundColor: '#0a080c',
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(30, 24, 36, 0.6) 0%, rgba(10, 8, 12, 0.95) 75%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
        aria-hidden="true"
      />

      {/* ── Custom Media (Video or Image) ── */}
      {hasCustomMedia && (
        <>
          {bg!.type === 'video' ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              style={mediaStyle}
              aria-hidden="true"
            >
              <source src={bg!.url} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bg!.url} alt="" aria-hidden="true" style={mediaStyle} />
          )}
        </>
      )}

      {/* ── Seamless Vignette & Dark Integration Layer ── */}
      {/* Ensures the background melts into the dark theme exactly like the reference screenshot */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 30%, transparent 15%, rgba(10, 8, 12, ${Math.min(0.92, overlayOpacity * 1.15)}) 70%, rgba(10, 8, 12, 0.98) 100%),
            linear-gradient(to bottom, rgba(10, 8, 12, 0.35) 0%, transparent 20%, transparent 75%, rgba(10, 8, 12, 0.96) 100%)
          `,
          zIndex: -20,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </>
  )
}
