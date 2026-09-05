'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Image as ImageIcon,
  Sparkles,
  X,
} from 'lucide-react'
import type { ShowcaseItem } from '@/lib/store'

export default function ShowcaseGallery({
  items,
  title = 'Client Interface & HUD',
  subtitle = 'Experience the sleek, distraction-free interface engineered for maximum clarity and competitive edge.',
}: {
  items: ShowcaseItem[]
  title?: string
  subtitle?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeItem = items[activeIndex] ?? items[0]

  const goNext = useCallback(() => {
    if (items.length <= 1) return
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goPrev = useCallback(() => {
    if (items.length <= 1) return
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, lightboxOpen])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <section id="showcase" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">
              <Sparkles size={13} />
              <span>Showcase &amp; Interface</span>
            </div>
            <h2 className="max-w-3xl text-balance font-mono text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls */}
          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                aria-label="Previous screenshot"
                className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-mono text-xs text-muted-foreground px-2">
                <strong className="text-foreground">{activeIndex + 1}</strong> / {items.length}
              </span>
              <button
                onClick={goNext}
                aria-label="Next screenshot"
                className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Featured Showcase Stage */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl backdrop-blur-sm transition-all hover:border-border">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-border/40 bg-background/60 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-xs text-muted-foreground tracking-wider uppercase">
                {activeItem.tag || 'Client View'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLightboxOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Expand image"
              >
                <Expand size={12} />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Main Image Frame */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="group relative flex aspect-video w-full cursor-zoom-in items-center justify-center overflow-hidden bg-black/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeItem.id}
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Hover overlay hint */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground shadow-lg backdrop-blur-md">
                <Expand size={14} className="text-primary" /> Click to expand
              </span>
            </div>
          </div>

          {/* Info Caption Bar */}
          <div className="border-t border-border/40 bg-card/60 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-mono text-lg font-bold text-foreground sm:text-xl">
                    {activeItem.title}
                  </h3>
                  {activeItem.tag && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                      {activeItem.tag}
                    </span>
                  )}
                </div>
                {activeItem.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
                    {activeItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        {items.length > 1 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-primary shadow-[0_0_16px_var(--neon)] ring-1 ring-primary'
                      : 'border-border/60 bg-card/40 opacity-70 hover:border-border hover:opacity-100'
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 bg-card/90">
                    <p className="truncate font-mono text-[11px] font-bold text-foreground">
                      {item.title}
                    </p>
                    {item.tag && (
                      <p className="truncate font-mono text-[9px] uppercase tracking-wider text-primary">
                        {item.tag}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 hover:border-white hover:text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 hover:border-white hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 hover:border-white hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="max-h-[85vh] max-w-[92vw] object-contain"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6">
              <h4 className="font-mono text-base sm:text-lg font-bold text-white">
                {activeItem.title}
              </h4>
              {activeItem.description && (
                <p className="mt-1 text-xs sm:text-sm text-neutral-300 max-w-2xl">
                  {activeItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
