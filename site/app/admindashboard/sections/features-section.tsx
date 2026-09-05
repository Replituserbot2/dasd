'use client'

import { LayoutGrid, Trash2 } from 'lucide-react'
import type { Feature, FeatureIcon } from '@/lib/store'
import { FEATURE_ICON_OPTIONS, FEATURE_ICON_MAP } from '@/lib/feature-icons'
import { EmptyState, IconGhostButton, Row, SectionCard, SmallInput, SmallTextArea } from '../ui'

export default function FeaturesSection({
  features,
  onAdd,
  onUpdate,
  onRemove,
}: {
  features: Feature[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Feature>) => void
  onRemove: (id: string) => void
}) {
  return (
    <SectionCard
      icon={LayoutGrid}
      title="Feature highlights"
      description="The three-column 'Why choose' grid on the homepage."
      onAdd={onAdd}
    >
      <div className="flex flex-col gap-3">
        {features.map((feature) => (
          <Row key={feature.id}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {FEATURE_ICON_OPTIONS.map(({ key, label }) => {
                  const Icon = FEATURE_ICON_MAP[key as FeatureIcon]
                  const active = feature.icon === key
                  return (
                    <button
                      key={key}
                      onClick={() => onUpdate(feature.id, { icon: key })}
                      aria-label={label}
                      title={label}
                      className={`flex size-8 items-center justify-center rounded-md border transition-colors ${
                        active
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      <Icon size={14} />
                    </button>
                  )
                })}
              </div>
              <IconGhostButton onClick={() => onRemove(feature.id)} label="Remove feature" variant="danger">
                <Trash2 size={14} />
              </IconGhostButton>
            </div>
            <SmallInput
              value={feature.title}
              onChange={(e) => onUpdate(feature.id, { title: e.target.value })}
              placeholder="Title"
            />
            <SmallTextArea
              value={feature.text}
              onChange={(e) => onUpdate(feature.id, { text: e.target.value })}
              placeholder="Description"
              rows={2}
            />
          </Row>
        ))}
        {features.length === 0 && <EmptyState text="No features yet — add one." />}
      </div>
    </SectionCard>
  )
}
