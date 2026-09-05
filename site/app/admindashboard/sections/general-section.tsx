'use client'

import { Settings } from 'lucide-react'
import type { SiteContent } from '@/lib/store'
import { accentForeground, accentToRgba } from '@/lib/color'
import { Field, SectionCard, TextArea, TextInput } from '../ui'

export default function GeneralSection({
  content,
  update,
}: {
  content: SiteContent
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard icon={Settings} title="Site identity" description="The name, headline and messaging shown across the site.">
        <div className="flex flex-col gap-5">
          <Field label="Site name">
            <TextInput value={content.siteName} onChange={(e) => update('siteName', e.target.value)} />
          </Field>

          <Field label="Hero title">
            <TextArea value={content.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} rows={2} />
          </Field>

          <Field label="Hero subtitle">
            <TextArea value={content.heroSubtitle} onChange={(e) => update('heroSubtitle', e.target.value)} rows={2} />
          </Field>

          <Field label="Download name">
            <TextInput value={content.downloadName} onChange={(e) => update('downloadName', e.target.value)} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard icon={Settings} title="Accent color" description="Sets the primary brand color used for buttons, glows and highlights.">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={content.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            className="size-11 shrink-0 cursor-pointer rounded-lg border border-input bg-background p-1"
            aria-label="Accent color picker"
          />
          <TextInput
            value={content.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            placeholder="#ef2d43"
            className="max-w-[160px] font-mono uppercase"
          />
          <span
            className="ml-auto rounded-full px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: content.accentColor,
              color: accentForeground(content.accentColor),
              boxShadow: `0 0 16px ${accentToRgba(content.accentColor, 0.5)}`,
            }}
          >
            Preview
          </span>
        </div>
      </SectionCard>
    </div>
  )
}
