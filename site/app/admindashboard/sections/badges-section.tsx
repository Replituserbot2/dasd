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
      description="Small pills shown under the hero call-to-action buttons."
      onAdd={onAdd}
    >
      <div className="flex flex-col gap-2">
        {badges.map((badge) => (
          <div key={badge.id} className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 p-2 transition-colors hover:border-border">
            <SmallInput
              value={badge.text}
              onChange={(e) => onUpdate(badge.id, e.target.value)}
              placeholder="Badge text"
              className="flex-1"
            />
            <IconGhostButton onClick={() => onRemove(badge.id)} label="Remove badge" variant="danger">
              <Trash2 size={14} />
            </IconGhostButton>
          </div>
        ))}
        {badges.length === 0 && <EmptyState text="No badges yet — add one." />}
      </div>
    </SectionCard>
  )
}
