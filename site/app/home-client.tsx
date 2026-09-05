'use client'

import { useState } from 'react'
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
  Code2,
  FileArchive,
  Gauge,
  HelpCircle,
  LockKeyhole,
  Sparkles,
  Users,
} from 'lucide-react'
import type { SiteContent } from '@/lib/store'

const faqs = [
  { q: 'What is Stratoukos Client?', a: 'Stratoukos Client is a premium HUD overlay designed for competitive gaming, offering clean visuals and zero distractions.' },
  { q: 'Is it compatible with my launcher?', a: 'Stratoukos Client supports all major launchers including Minecraft, Lunar Client, and Feather Client.' },
  { q: 'How do I install it?', a: 'Download the latest version, extract the zip file, and follow the included installation guide. Setup takes less than 2 minutes.' },
  { q: 'Does it affect performance?', a: 'No. Stratoukos Client is optimized to have minimal impact on your frame rate, typically adding less than 1% overhead.' },
  { q: 'Is my data safe?', a: 'Yes. Stratoukos Client runs locally with no tracking or data collection. Your settings stay on your machine.' },
]

const credits = [
  { name: 'Design & Development', contributors: 'Core team' },
  { name: 'Community', contributors: 'Beta testers and feedback contributors' },
  { name: 'Special Thanks', contributors: 'Everyone making Stratoukos Client possible' },
]

export default function HomeClient({ content }: { content: SiteContent }) {
  const { siteName, heroTitle, heroSubtitle, downloadName, versions, featuredVersionId } = content
  const featured = versions.find((v) => v.id === featuredVersionId) ?? versions[0]
  const [showVersions, setShowVersions] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_var(--neon)]">
              <Sparkles size={16} />
            </span>
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">{siteName}</span>
          </a>

          <nav className="hidden items-center gap-8 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground md:flex">
            <a href="#top" className="transition-colors hover:text-primary">Home</a>
            <a href="#features" className="transition-colors hover:text-primary">Features</a>
            <a href="#download" className="transition-colors hover:text-primary">Downloads</a>
            <a href="#archive" className="transition-colors hover:text-primary">Archive</a>
            <a href="#faq" className="transition-colors hover:text-primary">FAQ</a>
            <a href="#credits" className="transition-colors hover:text-primary">Credits</a>
          </nav>

          <a
            href="#download"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-transform hover:scale-105"
          >
            <ArrowDownToLine size={13} />
            Download
          </a>
        </div>
      </header>

      <section id="top" className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(239,45,67,.22),transparent_50%),radial-gradient(ellipse_at_15%_80%,rgba(114,12,27,.28),transparent_40%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Latest: {featured?.version ?? ''}
          </div>

          <h1 className="font-mono text-5xl font-black leading-tight tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {heroSubtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#download"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_24px_var(--neon)] transition-all hover:shadow-[0_0_36px_var(--neon)] hover:-translate-y-0.5"
            >
              <ArrowDownToLine size={15} />
              Download now
            </a>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary/50 hover:bg-card/80"
            >
              Explore features
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-border/50 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Optimized HUD</span>
            <span className="rounded-full border border-border/50 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">PvP ready</span>
            <span className="rounded-full border border-border/50 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Zero distractions</span>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Why Choose</p>
            <h2 className="max-w-3xl text-balance font-mono text-4xl font-bold tracking-tight sm:text-5xl">
              Built for champions.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/40 bg-border md:grid-cols-3">
            {[
              { icon: Gauge, title: 'Performance first', text: 'Lightweight design that never compromises your FPS. Stay competitive.' },
              { icon: Code2, title: 'Pixel perfect', text: 'Every detail is crafted for clarity. See everything that matters instantly.' },
              { icon: LockKeyhole, title: 'Privacy focused', text: 'Works offline. No tracking. Your setup stays private and secure.' },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-card/70 p-8 transition-colors hover:bg-card/90">
                <Icon className="mb-4 text-primary" size={24} />
                <h3 className="mb-2 font-mono text-sm font-bold uppercase tracking-wider">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="border-t border-border/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-card/60 p-8 shadow-[0_0_40px_rgba(239,45,67,.1)] sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-1">Latest</p>
                <h2 className="font-mono text-2xl font-bold tracking-tight">{downloadName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{featured?.size ?? ''} · Windows · Ready to use</p>
              </div>
              <a
                href={featured?.fileUrl || '#'}
                download
                aria-disabled={!featured?.fileUrl}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_20px_var(--neon)] transition-all hover:shadow-[0_0_32px_var(--neon)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
              >
                <ArrowDownToLine size={15} />
                Get file
              </a>
            </div>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {showVersions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showVersions ? 'Hide older versions' : 'View older versions'}
            </button>

            {showVersions && (
              <div className="mt-6 space-y-3 border-t border-border/40 pt-6">
                {versions.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex items-center gap-3">
                      <FileArchive size={16} className="text-primary shrink-0" />
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
                      className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
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

      <section id="archive" className="border-t border-border/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Repository</p>
            <h2 className="font-mono text-4xl font-bold tracking-tight">Version Archive</h2>
            <p className="mt-3 text-muted-foreground">Access all previous releases and historical versions.</p>
          </div>

          <div className="space-y-3">
            {versions.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-4 hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-3">
                  <FileArchive size={16} className="text-primary" />
                  <div>
                    <p className="font-mono text-sm font-bold">{item.version}</p>
                    <p className="text-xs text-muted-foreground">{item.date} · {item.size}</p>
                  </div>
                </div>
                <a
                  href={item.fileUrl || '#'}
                  download
                  aria-disabled={!item.fileUrl}
                  className="px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/10 transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Help</p>
            <h2 className="font-mono text-4xl font-bold tracking-tight">Frequently Asked</h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-5 hover:bg-card/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-primary shrink-0" />
                    <p className="font-mono text-sm font-semibold">{faq.q}</p>
                  </div>
                  {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {expandedFaq === idx && (
                  <div className="mt-2 rounded-lg border border-border/30 bg-background/50 p-4">
                    <p className="text-sm leading-6 text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="credits" className="border-t border-border/40 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Acknowledgments</p>
            <h2 className="font-mono text-4xl font-bold tracking-tight">Credits</h2>
            <p className="mt-3 text-muted-foreground">Made possible by the amazing team and community.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {credits.map((credit, idx) => (
              <div key={idx} className="rounded-lg border border-border/40 bg-card/40 p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Users size={18} className="text-primary shrink-0 mt-0.5" />
                  <h3 className="font-mono text-sm font-bold">{credit.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{credit.contributors}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 px-5 py-8 lg:px-8 bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {siteName}</span>
          <span>Built for competitive excellence.</span>
        </div>
      </footer>
    </main>
  )
}
