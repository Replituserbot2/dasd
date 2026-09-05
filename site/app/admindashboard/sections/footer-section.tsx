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
    <SectionCard icon={PanelBottom} title="Footer" description="The strip shown at the very bottom of the site.">
      <div className="flex flex-col gap-5">
        <Field label="Tagline">
          <TextInput value={footerTagline} onChange={(e) => onUpdate(e.target.value)} />
        </Field>
        <div className="rounded-lg border border-dashed border-border/60 p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} {siteName || 'Your site'} · {footerTagline || '...'}
        </div>
      </div>
    </SectionCard>
  )
}
