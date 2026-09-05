'use client'

import { useState, type CSSProperties } from 'react'
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileArchive,
  HelpCircle,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import type { SiteContent } from '@/lib/store'
import type { DiscordUser } from '@/lib/discord'
import { FEATURE_ICON_MAP } from '@/lib/feature-icons'
import { accentForeground, accentToRgba } from '@/lib/color'
import ShowcaseGallery from '@/components/showcase-gallery'
import SiteBackgroundLayer from '@/components/site-background'
import dynamic from 'next/dynamic'

const MusicPlayer = dynamic(() => import('@/components/music-player'), { ssr: false })

export default function HomeClient({
  content,
  discordUsers,
}: {
  content: SiteContent
  discordUsers: Record<string, DiscordUser | null>
}) {
  const {
    siteName,
    heroTitle,
    heroSubtitle,
    downloadName,
    accentColor,
    heroBadges,
    features,
    showcaseTitle,
    showcaseSubtitle,
    showcase,
    background,
    music,
    versions,
    featuredVersionId,
    faqs,
    team,
    footerTagline,
  } = content

  const featured = versions.find((v) => v.id === featuredVersionId) ?? versions[0]
  const [showVersions, setShowVersions] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const themeStyle = {
    '--primary': accentColor,
    '--ring': accentColor,
    '--primary-foreground': accentForeground(accentColor),
    '--neon': accentToRgba(accentColor, 0.42),
    '--neon-soft': accentToRgba(accentColor, 0.15),
    '--neon-hard': accentToRgba(accentColor, 0.7),
  } as CSSProperties

  return (
    <main style={themeStyle} className="relative min-h-screen overflow-hidden text-foreground">
      {/* ── Animated Background Layer ────────────────────────────── */}
      <SiteBackgroundLayer bg={background} />

      {/* ── Navigation ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
        {/* subtle top glow bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_var(--neon)] transition-all duration-300 group-hover:shadow-[0_0_32px_var(--neon-hard)] group-hover:scale-110">
              <Sparkles size={16} />
            </span>
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary">
              {siteName}
            </span>
          </a>

          <nav className="hidden items-center gap-7 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground md:flex">
            {[
              { href: '#top', label: 'Home' },
              { href: '#features', label: 'Features' },
              ...(showcase.length > 0 ? [{ href: '#showcase', label: 'Showcase' }] : []),
              { href: '#download', label: 'Downloads' },
              { href: '#faq', label: 'FAQ' },
              { href: '#credits', label: 'Credits' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative py-1 transition-colors hover:text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#download"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_var(--neon-hard)] active:scale-95"
          >
            <ArrowDownToLine size={13} />
            Download
          </a>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section id="top" className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-20 text-center">
        {/* radial bg glows */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse at 50% 0%,   ${accentToRgba(accentColor, 0.18)}, transparent 55%),
              radial-gradient(ellipse at 10% 80%,  ${accentToRgba(accentColor, 0.22)}, transparent 40%),
              radial-gradient(ellipse at 90% 70%,  ${accentToRgba(accentColor, 0.14)}, transparent 35%)
            `,
          }}
        />
        {/* animated pulsing orb behind hero text */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
        {/* grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          {/* version badge */}
          {featured && (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-primary shadow-[0_0_12px_var(--neon-soft)] backdrop-blur-sm transition-all hover:shadow-[0_0_20px_var(--neon)] hover:border-primary/60 cursor-default">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Latest: {featured.version}
              <Zap size={11} className="opacity-70" />
            </div>
          )}

          {/* hero heading with subtle glow text */}
          <h1 className="font-mono text-5xl font-black leading-tight tracking-tighter sm:text-6xl lg:text-7xl"
            style={{ textShadow: `0 0 80px ${accentToRgba(accentColor, 0.35)}` }}
          >
            {heroTitle}
          </h1>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#download"
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_24px_var(--neon)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_48px_var(--neon-hard)] active:scale-95"
            >
              {/* shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <ArrowDownToLine size={15} />
              Download now
            </a>
            {showcase.length > 0 ? (
              <a
                href="#showcase"
                className="flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_20px_var(--neon-soft)] hover:-translate-y-0.5"
              >
                View showcase
              </a>
            ) : (
              <a
                href="#features"
                className="flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_20px_var(--neon-soft)] hover:-translate-y-0.5"
              >
                Explore features
              </a>
            )}
          </div>

          {/* hero badges */}
          {heroBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="rounded-full border border-border/50 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_10px_var(--neon-soft)] cursor-default"
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      {features.length > 0 && (
        <section id="features" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
          {/* section bg glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Why Choose
              </div>
              <h2 className="max-w-3xl text-balance font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                Built for champions.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/60 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = FEATURE_ICON_MAP[feature.icon] ?? Sparkles
                return (
                  <article
                    key={feature.id}
                    className="group relative overflow-hidden bg-card/60 p-8 transition-all duration-300 hover:bg-card/90"
                  >
                    {/* hover glow burst behind card */}
                    <div className="pointer-events-none absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${accentToRgba(accentColor, 0.12)}, transparent 70%)` }}
                    />
                    {/* top accent bar */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/60" />

                    <span className="relative mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_12px_var(--neon-soft)] transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_24px_var(--neon)]">
                      <Icon size={20} />
                    </span>
                    <h3 className="relative mb-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="relative text-sm leading-6 text-muted-foreground">{feature.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Showcase Gallery ─────────────────────────────────────── */}
      {showcase.length > 0 && (
        <ShowcaseGallery
          items={showcase}
          title={showcaseTitle}
          subtitle={showcaseSubtitle}
          accentColor={accentColor}
        />
      )}

      {/* ── Download ─────────────────────────────────────────────── */}
      <section id="download" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${accentToRgba(accentColor, 0.07)}, transparent 65%)` }}
        />
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-8 shadow-[0_0_60px_var(--neon-soft)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_80px_var(--neon)] sm:p-10">
            {/* card top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            {/* corner accents */}
            <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-primary/40 rounded-tl-2xl" />
            <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-primary/40 rounded-tr-2xl" />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-1">Latest Release</p>
                <h2 className="font-mono text-2xl font-bold tracking-tight">{downloadName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{featured?.size ?? ''} · Windows · Ready to use</p>
              </div>
              <a
                href={featured?.fileUrl || '#'}
                download
                aria-disabled={!featured?.fileUrl}
                className="group relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_20px_var(--neon)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--neon-hard)] active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <ArrowDownToLine size={15} />
                Get file
              </a>
            </div>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:text-primary hover:gap-3"
            >
              {showVersions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showVersions ? 'Hide older versions' : 'View older versions'}
            </button>

            {showVersions && (
              <div className="mt-6 space-y-2 border-t border-border/40 pt-6">
                {versions.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-background/70 hover:shadow-[0_0_16px_var(--neon-soft)]"
                  >
                    <div className="flex items-center gap-3">
                      <FileArchive size={16} className="text-primary shrink-0 transition-transform group-hover:scale-110" />
                      <div>
                        <p className="font-mono text-xs font-bold">
                          {item.version} <span className="ml-2 font-sans font-normal text-muted-foreground">{item.date}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.file} · {item.size}</p>
                      </div>
                    </div>
                    <a
                      href={item.fileUrl || '#'}
                      download
                      aria-disabled={!item.fileUrl}
                      className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:text-foreground hover:gap-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    >
                      <ArrowDownToLine size={13} />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section id="faq" className="border-t border-border/40 px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Help
              </div>
              <h2 className="font-mono text-4xl font-bold tracking-tight">Frequently Asked</h2>
            </div>

            <div className="space-y-2">
              {faqs.map((faq) => {
                const isOpen = expandedFaq === faq.id
                return (
                  <div key={faq.id} className={`rounded-xl border transition-all duration-300 ${isOpen ? 'border-primary/40 shadow-[0_0_20px_var(--neon-soft)]' : 'border-border/40'}`}>
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="group flex w-full items-center justify-between rounded-xl bg-card/40 p-5 text-left transition-all duration-200 hover:bg-card/70"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle
                          size={16}
                          className={`shrink-0 transition-all duration-300 ${isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
                        />
                        <p className={`font-mono text-sm font-semibold transition-colors ${isOpen ? 'text-primary' : 'group-hover:text-foreground'}`}>
                          {faq.question}
                        </p>
                      </div>
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary'}`}>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="border-t border-border/30 pt-4">
                          <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Credits ──────────────────────────────────────────────── */}
      {team.length > 0 && (
        <section id="credits" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Acknowledgments
              </div>
              <h2 className="font-mono text-4xl font-bold tracking-tight">Credits</h2>
              <p className="mt-3 text-muted-foreground">Made possible by the amazing team and community.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {team.map((member) => {
                const discordUser = member.discordId ? discordUsers[member.discordId] : null
                const displayName = discordUser?.displayName || member.name
                const avatarUrl = discordUser?.avatarUrl || member.avatarUrl
                const profileUrl = discordUser?.profileUrl || member.discordUrl

                return (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-card/70 hover:shadow-[0_0_28px_var(--neon-soft)] hover:-translate-y-0.5"
                  >
                    {/* hover top accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/60" />

                    <div className="mb-3 flex items-start gap-3">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="size-11 shrink-0 rounded-full border-2 border-border/50 object-cover transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_14px_var(--neon)]"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-background/60 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_14px_var(--neon)]">
                          <Users size={16} className="text-primary" />
                        </span>
                      )}
                      <div className="flex min-w-0 flex-col">
                        <h3 className="truncate font-mono text-sm font-bold transition-colors group-hover:text-primary">
                          {displayName}
                        </h3>
                        {discordUser && (
                          <span className="truncate text-xs text-muted-foreground">@{discordUser.username}</span>
                        )}
                        {profileUrl && (
                          <a
                            href={profileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 flex items-center gap-1 truncate text-xs text-primary hover:underline"
                          >
                            Discord profile <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative border-t border-border/40 bg-card/20 px-5 py-8 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="mx-auto flex max-w-7xl flex-col gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="transition-colors hover:text-primary">© {new Date().getFullYear()} {siteName}</span>
          <span>{footerTagline}</span>
        </div>
      </footer>

      {/* ── Background Music Player ──────────────────────────────── */}
      {music.enabled && <MusicPlayer config={music} />}
    </main>
  )
}
