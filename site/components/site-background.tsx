'use client'

import { useEffect, useRef } from 'react'
import type { SiteBackground } from '@/lib/store'

/**
 * SiteBackgroundLayer
 *
 * Renders a full-viewport fixed background that sits behind all page content.
 * Supports:
 *   - MP4 / WebM / OGV video (autoPlay, muted, loop, playsInline)
 *   - Animated GIF / WebP / APNG / static images
 *
 * Always uses object-fit: cover — fills the viewport perfectly at any
 * aspect ratio without cropping quality or leaving letterbox gaps.
 *
 * Layer order (bottom → top):
 *   z-[-30]  background media (video or img)
 *   z-[-20]  semi-transparent dark overlay (keeps text readable)
 *   z-[0+]   page content (everything else)
 */
export default function SiteBackgroundLayer({ bg }: { bg: SiteBackground }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // When the URL changes, reload the video element so it plays the new file
  useEffect(() => {
    if (bg.type === 'video' && videoRef.current) {
      videoRef.current.load()
    }
  }, [bg.url, bg.type])

  if (!bg.enabled || !bg.url) return null

  const mediaStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    opacity: bg.opacity / 100,
    filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined,
    zIndex: -30,
    // Prevent sub-pixel gaps at edges
    transform: bg.blur > 0 ? `scale(${1 + (bg.blur * 0.01)})` : undefined,
    pointerEvents: 'none',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: `rgba(0,0,0,${bg.overlayOpacity / 100})`,
    zIndex: -20,
    pointerEvents: 'none',
  }

  return (
    <>
      {bg.type === 'video' ? (
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
          {/* Let the browser pick the format it supports */}
          <source src={bg.url} />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bg.url}
          alt=""
          aria-hidden="true"
          style={mediaStyle}
        />
      )}

      {/* Dark overlay for legibility */}
      <div style={overlayStyle} aria-hidden="true" />
    </>
  )
}
