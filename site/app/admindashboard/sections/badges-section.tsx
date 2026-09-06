'use client'

import { Tag, Trash2 } from 'lucide-react'
import type { HeroBadge } from '@/lib/store'
import { EmptyState, IconGhostButton, SectionCard, SmallInput } from '../ui'

export default function BadgesSection({
  badges,
  onAdd,
  onUpdate,
  onRemove,
}: {
  badges: HeroBadge[]
  onAdd: () => void
  onUpdate: (id: string, text: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <SectionCard
      icon={Tag}
      title="Hero badges"
      description="Small pill labels shown below the hero CTA buttons. Use them for quick feature callouts or social proof."
      onAdd={onAdd}
      addLabel="Add badge"
    >
      <div className="flex flex-col gap-2.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="group flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/50 p-3 transition-all duration-200 hover:border-border/70"
          >
            <SmallInput
              value={badge.text}
              onChange={(e) => onUpdate(badge.id, e.target.value)}
              placeholder="Badge label"
              className="flex-1"
            />
            <IconGhostButton onClick={() => onRemove(badge.id)} label="Remove badge" variant="danger">
              <Trash2 size={12} />
            </IconGhostButton>
          </div>
        ))}
        {badges.length === 0 && (
          <EmptyState text="No badges yet. Add one to display below the hero buttons." />
        )}
        {badges.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2 rounded-xl border border-border/30 bg-background/30 p-4">
            <span className="mb-1 w-full font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Live preview
            </span>
            {badges.map((b) => (
              <span
                key={b.id}
                className="rounded-full border border-border/50 bg-card/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {b.text || '...'}
              </span>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
