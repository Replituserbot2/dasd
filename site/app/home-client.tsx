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
import SiteLogo from '@/components/site-logo'
import ScrollReveal from '@/components/scroll-reveal'
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
    titleFont = 'minecraft',
    customFonts = [],
    logoType,
    logoUrl,
    logoTint,
    logoGlow,
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
    footerDescription,
    footerColumns,
    footerCopyright,
  } = content

  const activeCustomFont = (customFonts ?? []).find(
    (f) => f.id === titleFont || f.name.toLowerCase() === titleFont.toLowerCase()
  )

  const titleFontFamily = activeCustomFont
    ? activeCustomFont.fontFamily
    : titleFont === 'minecraft'
    ? "'Silkscreen', 'VT323', monospace"
    : titleFont === 'orbitron'
    ? "'Orbitron', sans-serif"
    : titleFont === 'modern'
    ? "var(--font-sans), 'Inter', sans-serif"
    : titleFont === 'mono'
    ? "'Space Grotesk', monospace"
    : activeCustomFont?.fontFamily || "'Silkscreen', monospace"

  const titleFontClass = 'font-title'

  const featured = versions.find((v) => v.id === featuredVersionId) ?? versions[0]
  const [showVersions, setShowVersions] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const themeStyle = {
    '--primary': accentColor,
    '--ring': accentColor,
    '--primary-foreground': accentForeground(accentColor),
    '--neon': accentToRgba(accentColor, 0.10),
    '--neon-soft': accentToRgba(accentColor, 0.03),
    '--neon-hard': accentToRgba(accentColor, 0.18),
    '--title-font': titleFontFamily,
  } as CSSProperties

  return (
    <main style={themeStyle} className="relative min-h-screen overflow-hidden text-foreground">
      {/* ── Dynamic Custom Web Fonts ────────────────────────────── */}
      {(customFonts ?? []).filter((f) => f.cssUrl).map((f) => (
        <link key={f.id} rel="stylesheet" href={f.cssUrl} />
      ))}

      {/* ── Animated Background Layer ────────────────────────────── */}
      <SiteBackgroundLayer bg={background} />

      {/* ── Navigation ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
        {/* subtle top glow bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <SiteLogo
              type={logoType}
              logoUrl={logoUrl}
              logoTint={logoTint}
              logoGlow={logoGlow}
              siteName={siteName}
              className="size-9"
            />
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
            className="btn-highlight flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
          >
            <ArrowDownToLine size={13} />
            Download
          </a>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section id="top" className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-20 text-center">
        {/* subtle flowing ambient background gradients */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse at 50% -10%,  ${accentToRgba(accentColor, 0.08)}, transparent 65%),
              radial-gradient(ellipse at 15% 75%,   ${accentToRgba(accentColor, 0.05)}, transparent 45%),
              radial-gradient(ellipse at 85% 65%,   ${accentToRgba(accentColor, 0.04)}, transparent 40%)
            `,
          }}
        />
        {/* soft ambient orb behind hero text */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[130px] animate-[pulse_6s_ease-in-out_infinite]" />
        {/* grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          {/* version badge with subtle floating flow & smooth pop-in */}
          {featured && (
            <div className="animate-pop-in animate-float inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-primary shadow-[0_2px_12px_var(--neon-soft)] backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/12 cursor-default">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Latest: {featured.version}
              <Zap size={11} className="opacity-70" />
            </div>
          )}

          {/* hero heading with selected title font and smooth pop-in */}
          <h1
            className={`${titleFontClass} animate-pop-in delay-150 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl max-w-4xl text-balance`}
            style={{ textShadow: `0 2px 24px ${accentToRgba(accentColor, 0.2)}` }}
          >
            {heroTitle}
          </h1>

          <p className="animate-pop-in delay-250 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {heroSubtitle}
          </p>

          {/* CTA Buttons with .btn-highlight */}
          <div className="animate-pop-in delay-350 flex flex-col gap-3.5 sm:flex-row">
            <a
              href="#download"
              className="btn-highlight group relative flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.55)] active:scale-95"
            >
              <ArrowDownToLine size={15} />
              Download now
            </a>
            {showcase.length > 0 ? (
              <a
                href="#showcase"
                className="btn-highlight flex items-center justify-center gap-2 rounded-full border border-white/10 bg-card/30 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-md hover:border-primary/30 hover:bg-card/50 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              >
                View showcase
              </a>
            ) : (
              <a
                href="#features"
                className="btn-highlight flex items-center justify-center gap-2 rounded-full border border-white/10 bg-card/30 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-md hover:border-primary/30 hover:bg-card/50 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
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
            <ScrollReveal className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Why Choose
              </div>
              <h2 className={`${titleFontClass} max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl`}>
                Built for champions.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay="delay-150" className="grid gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/60 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = FEATURE_ICON_MAP[feature.icon] ?? Sparkles
                return (
                  <article
                    key={feature.id}
                    className="group relative overflow-hidden bg-card/60 p-8 transition-all duration-300 hover:bg-card/90"
                  >
                    {/* subtle hover glow behind card */}
                    <div className="pointer-events-none absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${accentToRgba(accentColor, 0.05)}, transparent 70%)` }}
                    />
                    {/* top accent bar */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/40" />

                    <span className="relative mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_2px_10px_var(--neon-soft)]">
                      <Icon size={20} />
                    </span>
                    <h3 className="relative mb-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="relative text-sm leading-6 text-muted-foreground">{feature.text}</p>
                  </article>
                )
              })}
            </ScrollReveal>
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
          titleFontClass={titleFontClass}
        />
      )}

      {/* ── Download ─────────────────────────────────────────────── */}
      <section id="download" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${accentToRgba(accentColor, 0.04)}, transparent 65%)` }}
        />
        <div className="mx-auto max-w-4xl">
          <ScrollReveal className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_12px_36px_var(--neon-soft)] sm:p-10">
            {/* card top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            {/* corner accents */}
            <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-primary/40 rounded-tl-2xl" />
            <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-primary/40 rounded-tr-2xl" />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-1">Latest Release</p>
                <h2 className={`${titleFontClass} text-2xl font-bold tracking-tight`}>{downloadName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{featured?.size ?? ''} · Windows · Ready to use</p>
              </div>
              <a
                href={featured?.fileUrl || '#'}
                download
                aria-disabled={!featured?.fileUrl}
                className="btn-highlight group relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.55)] active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-50"
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section id="faq" className="border-t border-border/40 px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Help
              </div>
              <h2 className={`${titleFontClass} text-3xl font-bold tracking-tight sm:text-4xl`}>Frequently Asked</h2>
            </ScrollReveal>

            <ScrollReveal delay="delay-150" className="space-y-2">
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
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Credits ──────────────────────────────────────────────── */}
      {team.length > 0 && (
        <section id="credits" className="relative border-t border-border/40 px-5 py-24 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="mb-12">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Acknowledgments
              </div>
              <h2 className={`${titleFontClass} text-3xl font-bold tracking-tight sm:text-4xl`}>Credits</h2>
              <p className="mt-3 text-muted-foreground">Made possible by the amazing team and community.</p>
            </ScrollReveal>

            <ScrollReveal delay="delay-150" className="grid gap-5 md:grid-cols-3">
              {team.map((member) => {
                const discordUser = member.discordId ? discordUsers[member.discordId] : null
                const displayName = discordUser?.displayName || member.name
                const avatarUrl = discordUser?.avatarUrl || member.avatarUrl
                const profileUrl = discordUser?.profileUrl || member.discordUrl

                return (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
                  >
                    {/* hover top accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/40" />

                    <div className="mb-3 flex items-start gap-3">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="size-11 shrink-0 rounded-full border-2 border-border/50 object-cover transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_2px_10px_var(--neon-soft)]"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-background/60 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_2px_10px_var(--neon-soft)]">
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
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer id="footer" className="relative border-t border-border/30 bg-card/10 backdrop-blur-sm">
        {/* top accent glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/[0.015] to-transparent pointer-events-none" />

        {/* Main footer grid */}
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_repeat(3,auto)] lg:gap-16">

            {/* Left — logo + description */}
            <div className="flex flex-col gap-5 max-w-xs">
              <a href="#top" className="group flex items-center gap-3">
                <SiteLogo
                  type={logoType}
                  logoUrl={logoUrl}
                  logoTint={logoTint}
                  logoGlow={logoGlow}
                  siteName={siteName}
                  className="size-10"
                />
                <span className="font-mono text-lg font-black uppercase tracking-widest text-foreground transition-colors group-hover:text-primary">
                  {siteName}
                </span>
              </a>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {footerDescription}
              </p>
              {/* accent bar */}
              <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
            </div>

            {/* Link columns */}
            {(footerColumns ?? []).map((col) => (
              <div key={col.id} className="flex flex-col gap-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url || '#'}
                        className="text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-0.5 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <span>{footerCopyright}</span>
            <span className="text-muted-foreground/40">All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ── Background Music Player ──────────────────────────────── */}
      {music.enabled && <MusicPlayer config={music} />}
    </main>
  )
}
