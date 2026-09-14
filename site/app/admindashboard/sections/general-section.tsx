'use client'

import { useState } from 'react'
import { Settings, Palette, Type, Plus, Trash2, X, Check } from 'lucide-react'
import type { SiteContent, TitleFont, CustomFont } from '@/lib/store'
import { accentForeground, accentToRgba } from '@/lib/color'
import { Field, SectionCard, TextArea, TextInput } from '../ui'

const FONT_OPTIONS: { value: TitleFont; label: string; preview: string; cssClass: string }[] = [
  { value: 'minecraft', label: 'Minecraft', preview: 'Aa', cssClass: 'font-minecraft' },
  { value: 'orbitron', label: 'Orbitron', preview: 'Aa', cssClass: 'font-orbitron' },
  { value: 'modern', label: 'Modern', preview: 'Aa', cssClass: 'font-modern' },
  { value: 'mono', label: 'Mono', preview: 'Aa', cssClass: 'font-mono' },
]

const QUICK_FONTS = [
  { name: 'Cinzel', family: "'Cinzel', serif", url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap' },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
  { name: 'Rubik Glitch', family: "'Rubik Glitch', cursive", url: 'https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap' },
  { name: 'Chakra Petch', family: "'Chakra Petch', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap' },
  { name: 'Russo One', family: "'Russo One', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap' },
]

const PRESETS = [
  '#ef2d43', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ffffff', '#94a3b8',
]

export default function GeneralSection({
  content,
  update,
}: {
  content: SiteContent
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void
}) {
  const [showAddFont, setShowAddFont] = useState(false)
  const [fontName, setFontName] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [fontUrl, setFontUrl] = useState('')

  const handleFontNameChange = (name: string) => {
    setFontName(name)
    if (name.trim()) {
      const clean = name.trim()
      setFontFamily(`'${clean}', sans-serif`)
      setFontUrl(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean.replace(/\s+/g, '+'))}:wght@700;900&display=swap`)
    } else {
      setFontFamily('')
      setFontUrl('')
    }
  }

  const addCustomFont = (name: string, family: string, url?: string) => {
    if (!name.trim()) return
    const id = `font-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const newFont: CustomFont = {
      id,
      name: name.trim(),
      fontFamily: family.trim() || `'${name.trim()}', sans-serif`,
      cssUrl: url?.trim() || undefined,
    }
    const updatedFonts = [...(content.customFonts ?? []), newFont]
    update('customFonts', updatedFonts)
    update('titleFont', id)
    setFontName('')
    setFontFamily('')
    setFontUrl('')
    setShowAddFont(false)
  }

  const removeCustomFont = (id: string) => {
    const updatedFonts = (content.customFonts ?? []).filter((f) => f.id !== id)
    update('customFonts', updatedFonts)
    if (content.titleFont === id) {
      update('titleFont', 'minecraft')
    }
  }

  const activeCustom = (content.customFonts ?? []).find(
    (f) => f.id === content.titleFont || f.name.toLowerCase() === content.titleFont?.toLowerCase()
  )

  const currentPreviewFamily = activeCustom
    ? activeCustom.fontFamily
    : content.titleFont === 'minecraft'
    ? "'Silkscreen', 'VT323', monospace"
    : content.titleFont === 'orbitron'
    ? "'Orbitron', sans-serif"
    : content.titleFont === 'modern'
    ? "var(--font-sans), 'Inter', sans-serif"
    : content.titleFont === 'mono'
    ? "'Space Grotesk', monospace"
    : activeCustom?.fontFamily || "'Silkscreen', monospace"

  return (
    <div className="flex flex-col gap-6">
      <SectionCard icon={Settings} title="Site identity" description="The name, headline, and messaging shown across the entire site.">
        <div className="flex flex-col gap-5">
          <Field label="Site name" hint="Shown in the header logo and browser tab.">
            <TextInput value={content.siteName} onChange={(e) => update('siteName', e.target.value)} placeholder="My Client" />
          </Field>

          <Field label="Hero title" hint="Large heading in the center of the hero section. Use ALL CAPS for impact.">
            <TextArea value={content.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} rows={2} placeholder="CLIENT NAME" />
          </Field>

          <Field label="Hero subtitle" hint="Descriptive line below the title. Keep it short and punchy.">
            <TextArea value={content.heroSubtitle} onChange={(e) => update('heroSubtitle', e.target.value)} rows={2} placeholder="The best HUD overlay." />
          </Field>

          <Field label="Download section name" hint="Shown as the title in the downloads card.">
            <TextInput value={content.downloadName} onChange={(e) => update('downloadName', e.target.value)} placeholder="Client v1.0.0" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard icon={Palette} title="Brand accent color" description="The primary color used for buttons, glows, borders and highlights throughout the entire site." accent>
        {/* Big live preview swatch */}
        <div
          className="mb-5 flex h-16 w-full items-center justify-center rounded-xl border border-white/10 font-mono text-sm font-bold uppercase tracking-widest transition-all duration-500"
          style={{
            backgroundColor: content.accentColor,
            color: accentForeground(content.accentColor),
            boxShadow: `0 0 40px ${accentToRgba(content.accentColor, 0.6)}, 0 0 80px ${accentToRgba(content.accentColor, 0.2)}`,
          }}
        >
          {content.accentColor}
        </div>

        {/* Picker + hex input */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="color"
            value={content.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-input bg-background p-1"
            aria-label="Accent color picker"
          />
          <TextInput
            value={content.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            placeholder="#ef2d43"
            className="max-w-[160px] font-mono uppercase"
          />
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">Quick presets →</span>
        </div>

        {/* Preset swatches */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((hex) => (
            <button
              key={hex}
              onClick={() => update('accentColor', hex)}
              title={hex}
              className="size-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: hex,
                borderColor: content.accentColor === hex ? '#fff' : 'transparent',
                boxShadow: content.accentColor === hex ? `0 0 12px ${accentToRgba(hex, 0.8)}` : 'none',
              }}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        icon={Type}
        title="Title & heading font"
        description="Choose or add custom fonts for major titles and headings across the website."
      >
        <div className="flex flex-col gap-5">
          {/* Built-in Core Fonts */}
          <div>
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Core Fonts
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FONT_OPTIONS.map((f) => {
                const active = (content.titleFont ?? 'minecraft') === f.value
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => update('titleFont', f.value)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_var(--neon)]'
                        : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/70'
                    }`}
                  >
                    <span className={`text-2xl font-bold ${f.cssClass} ${active ? 'text-primary' : 'text-foreground'}`}>
                      {f.preview}
                    </span>
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                        {f.label}
                      </span>
                      {active && (
                        <span className="mt-1 inline-block size-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* User Custom Fonts */}
          {((content.customFonts ?? []).length > 0) && (
            <div>
              <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Your Added Fonts
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(content.customFonts ?? []).map((f) => {
                  const active = content.titleFont === f.id || content.titleFont?.toLowerCase() === f.name.toLowerCase()
                  return (
                    <div
                      key={f.id}
                      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                        active
                          ? 'border-primary bg-primary/10 shadow-[0_0_15px_var(--neon)]'
                          : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/70'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => update('titleFont', f.id)}
                        className="flex flex-col items-center text-center gap-1.5 w-full"
                      >
                        <span
                          className={`text-xl font-bold ${active ? 'text-primary' : 'text-foreground'}`}
                          style={{ fontFamily: f.fontFamily }}
                        >
                          Aa
                        </span>
                        <span className="truncate font-mono text-xs font-semibold uppercase tracking-wider max-w-[140px]">
                          {f.name}
                        </span>
                        {active && (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-primary">
                            <Check size={10} /> Active
                          </span>
                        )}
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => removeCustomFont(f.id)}
                        title={`Remove ${f.name}`}
                        className="absolute right-2 top-2 rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add Font Toggle / Form */}
          <div className="rounded-xl border border-border/40 bg-card/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Add Custom Web Font
                </p>
                <p className="text-xs text-muted-foreground">
                  Add any font from Google Fonts or a webfont stylesheet URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFont(!showAddFont)}
                className="btn-highlight flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                {showAddFont ? <X size={12} /> : <Plus size={12} />}
                {showAddFont ? 'Cancel' : 'Add font'}
              </button>
            </div>

            {/* Quick add popular fonts */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 mr-1">
                Quick add:
              </span>
              {QUICK_FONTS.map((qf) => {
                const alreadyAdded = (content.customFonts ?? []).some((f) => f.name.toLowerCase() === qf.name.toLowerCase())
                return (
                  <button
                    key={qf.name}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => addCustomFont(qf.name, qf.family, qf.url)}
                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
                      alreadyAdded
                        ? 'border-border/30 text-muted-foreground/40 cursor-not-allowed'
                        : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary active:scale-95'
                    }`}
                  >
                    + {qf.name}
                  </button>
                )
              })}
            </div>

            {/* Manual Add Font Form */}
            {showAddFont && (
              <div className="mt-4 flex flex-col gap-3 border-t border-border/30 pt-4">
                <Field label="Font Name" hint="e.g. 'Press Start 2P', 'Cinzel', 'Pixelify Sans'">
                  <TextInput
                    value={fontName}
                    onChange={(e) => handleFontNameChange(e.target.value)}
                    placeholder="e.g. Press Start 2P"
                  />
                </Field>

                <Field label="CSS Font Family" hint="Auto-generated, or customize for fallback fonts">
                  <TextInput
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    placeholder="'Press Start 2P', monospace"
                  />
                </Field>

                <Field label="Google Font / Stylesheet URL" hint="URL to load font @import or <link> stylesheet">
                  <TextInput
                    value={fontUrl}
                    onChange={(e) => setFontUrl(e.target.value)}
                    placeholder="https://fonts.googleapis.com/css2?family=..."
                  />
                </Field>

                <button
                  type="button"
                  disabled={!fontName.trim()}
                  onClick={() => addCustomFont(fontName, fontFamily, fontUrl)}
                  className="btn-highlight mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  <Plus size={14} />
                  Save & Apply Font
                </button>
              </div>
            )}
          </div>

          {/* Live preview line */}
          <div className="rounded-xl border border-border/40 bg-background/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Live Title Preview:
              </p>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Font: {activeCustom?.name || content.titleFont || 'Minecraft'}
              </span>
            </div>
            <p
              className="text-xl font-black tracking-tight sm:text-2xl"
              style={{ fontFamily: currentPreviewFamily }}
            >
              {content.heroTitle || 'STRATOUKOS CLIENT'}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
