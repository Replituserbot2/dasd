'use client'

import { PanelBottom } from 'lucide-react'
import { Field, SectionCard, TextInput } from '../ui'

export default function FooterSection({
  siteName,
  footerTagline,
  onUpdate,
}: {
  siteName: string
  footerTagline: string
  onUpdate: (value: string) => void
}) {
  return (
    <SectionCard
      icon={PanelBottom}
      title="Footer"
      description="Text shown in the bottom bar of the site."
    >
      <div className="flex flex-col gap-5">
        <Field label="Footer tagline" hint="Short phrase shown on the right side of the footer bar.">
          <TextInput
            value={footerTagline}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Built for competitive excellence."
          />
        </Field>

        {/* Live preview */}
        <div className="overflow-hidden rounded-xl border border-border/40 bg-background/30">
          <p className="border-b border-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Live preview
          </p>
          <div className="flex items-center justify-between px-5 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <span>© {new Date().getFullYear()} {siteName || 'Site Name'}</span>
            <span>{footerTagline || 'Your tagline here'}</span>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
