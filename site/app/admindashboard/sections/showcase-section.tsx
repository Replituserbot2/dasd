'use client'

import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import type { ShowcaseItem } from '@/lib/store'
import { EmptyState, Field, IconGhostButton, Row, SectionCard, SmallInput, SmallTextArea, TextInput } from '../ui'

export default function ShowcaseSection({
  title,
  subtitle,
  items,
  uploadingIdx,
  uploadPct,
  onUpdateTitle,
  onUpdateSubtitle,
  onAdd,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUploadClick,
  registerFileInput,
  onFileSelected,
}: {
  title: string
  subtitle: string
  items: ShowcaseItem[]
  uploadingIdx: string | null
  uploadPct: number
  onUpdateTitle: (title: string) => void
  onUpdateSubtitle: (subtitle: string) => void
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<ShowcaseItem>) => void
  onRemove: (id: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onUploadClick: (id: string) => void
  registerFileInput: (id: string, el: HTMLInputElement | null) => void
  onFileSelected: (id: string, files: FileList | null) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Section Info Card */}
      <SectionCard
        icon={ImageIcon}
        title="Showcase Section Settings"
        description="Configure the headline and intro text shown above the screenshot gallery."
      >
        <div className="flex flex-col gap-4">
          <Field label="Section Title">
            <TextInput
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Client Interface & HUD"
            />
          </Field>

          <Field label="Section Subtitle">
            <TextInput
              value={subtitle}
              onChange={(e) => onUpdateSubtitle(e.target.value)}
              placeholder="Experience the sleek, distraction-free interface engineered for maximum clarity."
            />
          </Field>
        </div>
      </SectionCard>

      {/* Showcase Items List */}
      <SectionCard
        icon={ImageIcon}
        title="Client Screenshots & UI Pictures"
        description="Upload pictures of your client UI, HUDs, and menus. Reorder or edit captions below."
        onAdd={onAdd}
        addLabel="Add picture"
      >
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => {
            const uploadKey = `showcase-${item.id}`
            const isUploading = uploadingIdx === uploadKey

            return (
              <Row key={item.id}>
                {/* Header row: Thumbnail, upload, move, remove */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-black/60">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title || 'Showcase'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {item.title || `Picture #${idx + 1}`}
                      </span>
                      {item.tag && (
                        <p className="font-mono text-[10px] uppercase text-primary">
                          {item.tag}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Hidden file input */}
                    <input
                      ref={(el) => registerFileInput(item.id, el)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFileSelected(item.id, e.target.files)}
                    />

                    <IconGhostButton
                      onClick={() => onUploadClick(item.id)}
                      disabled={isUploading}
                    >
                      <Upload size={12} />
                      {isUploading ? `Uploading ${Math.round(uploadPct)}%` : 'Upload picture'}
                    </IconGhostButton>

                    <IconGhostButton
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0}
                      label="Move up"
                    >
                      <ArrowUp size={12} />
                    </IconGhostButton>

                    <IconGhostButton
                      onClick={() => onMoveDown(idx)}
                      disabled={idx === items.length - 1}
                      label="Move down"
                    >
                      <ArrowDown size={12} />
                    </IconGhostButton>

                    <IconGhostButton
                      onClick={() => onRemove(item.id)}
                      label="Remove picture"
                      variant="danger"
                    >
                      <Trash2 size={13} />
                    </IconGhostButton>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                  <Field label="Picture title">
                    <SmallInput
                      value={item.title}
                      onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                      placeholder="e.g. Combat HUD & Armor Overlay"
                    />
                  </Field>

                  <Field label="Category / Tag badge">
                    <SmallInput
                      value={item.tag || ''}
                      onChange={(e) => onUpdate(item.id, { tag: e.target.value })}
                      placeholder="e.g. HUD Overlay, In-Game GUI, Telemetry"
                    />
                  </Field>
                </div>

                <Field label="Image URL (or upload above)">
                  <SmallInput
                    value={item.imageUrl}
                    onChange={(e) => onUpdate(item.id, { imageUrl: e.target.value })}
                    placeholder="/uploads/... or https://..."
                  />
                </Field>

                <Field label="Description caption">
                  <SmallTextArea
                    value={item.description}
                    onChange={(e) => onUpdate(item.id, { description: e.target.value })}
                    placeholder="Short description of what this client feature or screenshot shows..."
                    rows={2}
                  />
                </Field>
              </Row>
            )
          })}

          {items.length === 0 && (
            <EmptyState text="No showcase pictures yet. Click 'Add picture' to upload screenshots of your client UI." />
          )}
        </div>
      </SectionCard>
    </div>
  )
}
