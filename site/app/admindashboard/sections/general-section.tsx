'use client'

import { Settings, Palette } from 'lucide-react'
import type { SiteContent } from '@/lib/store'
import { accentForeground, accentToRgba } from '@/lib/color'
import { Field, SectionCard, TextArea, TextInput } from '../ui'

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
    </div>
  )
}
