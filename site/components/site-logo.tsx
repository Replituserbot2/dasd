'use client'

import type { LogoType } from '@/lib/store'

interface SiteLogoProps {
  type?: LogoType
  logoUrl?: string
  logoTint?: boolean
  logoGlow?: boolean
  siteName?: string
  className?: string
}

export default function SiteLogo({
  type = 'dynamic-s',
  logoUrl = '/logo.jpg',
  logoTint = true,
  logoGlow = true,
  siteName = 'Stratoukos Client',
  className = 'size-9',
}: SiteLogoProps) {
  const glowClass = logoGlow ? 'animate-logo-glow' : ''

  // 1. Dynamic Geometric "S" (theme-adaptive vector)
  if (type === 'dynamic-s') {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl p-1 transition-all duration-300 ${glowClass} ${className}`}
        style={{
          filter: 'drop-shadow(0 0 5px var(--neon))',
        }}
        title={siteName}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full overflow-visible transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="dynamicSGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.88" />
            </linearGradient>
          </defs>
          {/* Top piece of geometric S */}
          <path
            d="M 24 20 L 76 20 L 76 36 L 48 36 L 76 64 L 76 76 L 64 76 L 24 36 L 24 20 Z"
            fill="url(#dynamicSGrad)"
          />
          {/* Bottom piece of geometric S (exact 180° rotational symmetry) */}
          <path
            d="M 76 80 L 24 80 L 24 64 L 52 64 L 24 36 L 24 24 L 36 24 L 76 64 Z"
            fill="url(#dynamicSGrad)"
          />
        </svg>
      </span>
    )
  }

  // 2. Dynamic Demon Glyph (Phantom style theme-adaptive vector with transparent eye/mouth cutouts)
  if (type === 'dynamic-demon') {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl p-1 transition-all duration-300 ${glowClass} ${className}`}
        style={{
          filter: 'drop-shadow(0 0 6px var(--neon))',
        }}
        title={siteName}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full overflow-visible transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <mask id="demonCutoutMask">
              {/* White background preserves the body */}
              <rect width="100" height="100" fill="#ffffff" />
              {/* Black shapes cut out eyes and smile so background/video shines through */}
              <polygon points="34,48 48,55 36,60" fill="#000000" />
              <polygon points="66,48 52,55 64,60" fill="#000000" />
              <path d="M 34,68 Q 50,84 66,68 Q 50,74 34,68 Z" fill="#000000" />
            </mask>
            <linearGradient id="demonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M 50,24 C 60,24 68,27 74,32 C 80,24 86,17 90,16 C 88,27 82,36 77,43 C 85,53 87,67 80,78 C 72,90 52,92 36,87 C 24,81 17,69 17,55 C 17,45 21,37 25,31 C 19,25 15,18 13,16 C 17,17 23,24 29,32 C 35,27 42,24 50,24 Z"
            fill="url(#demonGrad)"
            mask="url(#demonCutoutMask)"
          />
        </svg>
      </span>
    )
  }

  // 3. Custom Image Logo (with optional theme accent tinting & neon rim glow)
  if (logoTint && logoUrl) {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${glowClass} ${className}`}
        style={{
          filter: 'drop-shadow(0 0 5px var(--neon))',
        }}
        title={siteName}
      >
        <span
          className="size-full"
          style={{
            WebkitMaskImage: `url(${logoUrl})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: `url(${logoUrl})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            backgroundColor: 'var(--primary)',
          }}
        />
      </span>
    )
  }

  // Default image render
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl || '/logo.jpg'}
      alt={siteName}
      className={`rounded-xl object-cover transition-all duration-300 hover:scale-105 ${glowClass} ${className}`}
      style={{
        boxShadow: '0 2px 10px var(--neon-soft)',
      }}
    />
  )
}
