'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Sparkles,
  X,
} from 'lucide-react'
import type { ShowcaseItem } from '@/lib/store'
import { accentToRgba } from '@/lib/color'

export default function ShowcaseGallery({
  items,
  title = 'Client Interface & HUD',
  subtitle = 'Experience the sleek, distraction-free interface engineered for maximum clarity and competitive edge.',
  accentColor = '#ef2d43',
}: {
  items: ShowcaseItem[]
  title?: string
  subtitle?: string
  accentColor?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const activeItem = items[activeIndex] ?? items[0]

  const goTo = useCallback((idx: number) => {
    if (idx === activeIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex(idx)
      setIsTransitioning(false)
    }, 150)
  }, [activeIndex])

  const goNext = useCallback(() => {
    if (items.length <= 1) return
    goTo((activeIndex + 1) % items.length)
  }, [items.length, activeIndex, goTo])

  const goPrev = useCallback(() => {
    if (items.length <= 1) return
    goTo((activeIndex - 1 + items.length) % items.length)
  }, [items.length, activeIndex, goTo])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, lightboxOpen])

  if (!items || items.length === 0) return null

  const neonSoft = accentToRgba(accentColor, 0.18)
  const neonMed  = accentToRgba(accentColor, 0.40)
  const neonHard = accentToRgba(accentColor, 0.65)

  return (
    <section id="showcase" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
      {/* Section bg glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${accentToRgba(accentColor, 0.06)}, transparent 65%)` }}
      />

      <div className="mx-auto max-w-7xl">
        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              <Sparkles size={13} />
              <span>Showcase &amp; Interface</span>
              <span className="size-1 rounded-full bg-primary animate-pulse" />
            </div>
            <h2 className="max-w-3xl text-balance font-mono text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          </div>

          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                aria-label="Previous screenshot"
                className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-mono text-xs text-muted-foreground px-1">
                <strong className="text-foreground">{activeIndex + 1}</strong> / {items.length}
              </span>
              <button
                onClick={goNext}
                aria-label="Next screenshot"
                className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ── Main Stage ── */}
        <div
          className="relative overflow-hidden rounded-2xl border bg-card/30 shadow-2xl backdrop-blur-sm transition-all duration-500"
          style={{
            borderColor: `${accentToRgba(accentColor, 0.35)}`,
            boxShadow: `0 0 60px ${neonSoft}, 0 0 120px ${accentToRgba(accentColor, 0.05)}`,
          }}
        >
          {/* top glow line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accentToRgba(accentColor, 0.8)}, transparent)` }}
          />
          {/* corner accents */}
          <div className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-primary/50 rounded-tl-2xl" />
          <div className="absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-primary/50 rounded-tr-2xl" />

          {/* Window Bar */}
          <div className="flex items-center justify-between border-b border-border/40 bg-background/50 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
              <span className="size-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span className="size-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              <span className="ml-3 font-mono text-xs tracking-wider uppercase text-muted-foreground">
                {activeItem.tag || 'Client View'}
              </span>
            </div>
            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_var(--neon-soft)]"
            >
              <Expand size={12} />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </div>

          {/* Image Frame */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="group relative flex aspect-video w-full cursor-zoom-in items-center justify-center overflow-hidden bg-black/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeItem.id}
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className={`h-full w-full object-contain transition-all duration-300 group-hover:scale-[1.02] ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: `radial-gradient(ellipse at center, ${accentToRgba(accentColor, 0.08)}, transparent 70%)` }}
            >
              <span className="flex items-center gap-2 rounded-full border border-primary/40 bg-background/80 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground shadow-lg backdrop-blur-md"
                style={{ boxShadow: `0 0 20px ${neonSoft}` }}
              >
                <Expand size={14} className="text-primary" /> Click to expand
              </span>
            </div>

            {/* Prev/Next arrows overlaid on stage */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-black/60 text-white/60 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-black/60 text-white/60 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Caption Bar */}
          <div className="border-t border-border/40 bg-card/50 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-mono text-lg font-bold text-foreground sm:text-xl">
                    {activeItem.title}
                  </h3>
                  {activeItem.tag && (
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary"
                      style={{ borderColor: `${accentToRgba(accentColor, 0.4)}`, backgroundColor: `${accentToRgba(accentColor, 0.1)}`, boxShadow: `0 0 8px ${neonSoft}` }}
                    >
                      {activeItem.tag}
                    </span>
                  )}
                </div>
                {activeItem.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">{activeItem.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Thumbnail Strip ── */}
        {items.length > 1 && (
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {items.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(idx)}
                  className="group relative overflow-hidden rounded-xl border text-left transition-all duration-300 active:scale-95"
                  style={isActive
                    ? { borderColor: accentColor, boxShadow: `0 0 18px ${neonMed}` }
                    : { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                >
                  <div className="aspect-video w-full overflow-hidden bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* thumbnail overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to top, ${accentToRgba(accentColor, 0.25)}, transparent 60%)` }}
                  />
                  <div className="bg-card/90 p-2">
                    <p className={`truncate font-mono text-[11px] font-bold transition-colors ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                      {item.title}
                    </p>
                    {item.tag && (
                      <p className="truncate font-mono text-[9px] uppercase tracking-wider text-primary opacity-70">
                        {item.tag}
                      </p>
                    )}
                  </div>
                  {/* active indicator dot */}
                  {isActive && (
                    <span
                      className="absolute top-2 right-2 size-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${neonHard}` }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
          style={{ animation: 'fade-in 200ms ease both' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/70 transition-all duration-200 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_14px_var(--neon)]"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/70 transition-all duration-200 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/70 transition-all duration-200 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_14px_var(--neon)] active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative max-h-[88vh] max-w-[90vw] overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              borderColor: `${accentToRgba(accentColor, 0.4)}`,
              boxShadow: `0 0 80px ${neonMed}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* top glow line inside lightbox */}
            <div
              className="absolute inset-x-0 top-0 h-px z-10"
              style={{ background: `linear-gradient(90deg, transparent, ${accentToRgba(accentColor, 0.9)}, transparent)` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="max-h-[88vh] max-w-[90vw] object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 sm:p-7">
              <h4 className="font-mono text-base font-bold text-white sm:text-lg">{activeItem.title}</h4>
              {activeItem.description && (
                <p className="mt-1 text-xs text-neutral-300 sm:text-sm max-w-2xl">{activeItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
