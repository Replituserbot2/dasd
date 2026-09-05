'use client'

import { FileArchive, Star, Trash2, Upload } from 'lucide-react'
import type { Version } from '@/lib/store'
import { EmptyState, IconGhostButton, SectionCard, SmallInput } from '../ui'

export default function VersionsSection({
  versions,
  featuredVersionId,
  uploadingIdx,
  uploadPct,
  onAdd,
  onUpdate,
  onRemove,
  onSetFeatured,
  onUploadClick,
  registerFileInput,
  onFileSelected,
}: {
  versions: Version[]
  featuredVersionId: string
  uploadingIdx: string | null
  uploadPct: number
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Version>) => void
  onRemove: (id: string) => void
  onSetFeatured: (id: string) => void
  onUploadClick: (id: string) => void
  registerFileInput: (id: string, el: HTMLInputElement | null) => void
  onFileSelected: (id: string, files: FileList | null) => void
}) {
  return (
    <SectionCard icon={FileArchive} title="Versions" description="Every release available in the download and archive sections." onAdd={onAdd}>
      <div className="flex flex-col gap-3">
        {versions.map((v) => {
          const isFeatured = v.id === featuredVersionId
          return (
            <div
              key={v.id}
              className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${
                isFeatured ? 'border-primary/60 bg-primary/5' : 'border-border/50 bg-background/40 hover:border-border'
              }`}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:items-center">
                <SmallInput
                  value={v.version}
                  onChange={(e) => onUpdate(v.id, { version: e.target.value })}
                  placeholder="Version"
                />
                <SmallInput
                  value={v.date}
                  onChange={(e) => onUpdate(v.id, { date: e.target.value })}
                  placeholder="Date"
                />
                <SmallInput
                  value={v.size}
                  onChange={(e) => onUpdate(v.id, { size: e.target.value })}
                  placeholder="Size"
                />
                <SmallInput
                  value={v.file}
                  onChange={(e) => onUpdate(v.id, { file: e.target.value })}
                  placeholder="File name"
                />
                <IconGhostButton onClick={() => onRemove(v.id)} label="Remove version" variant="danger">
                  <Trash2 size={14} />
                </IconGhostButton>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={(el) => registerFileInput(v.id, el)}
                  type="file"
                  className="hidden"
                  onChange={(e) => onFileSelected(v.id, e.target.files)}
                />
                <IconGhostButton onClick={() => onUploadClick(v.id)} disabled={uploadingIdx === v.id}>
                  <Upload size={12} />
                  {uploadingIdx === v.id ? `Uploading... ${Math.round(uploadPct)}%` : 'Upload file'}
                </IconGhostButton>

                <IconGhostButton onClick={() => onSetFeatured(v.id)} disabled={isFeatured} variant={isFeatured ? 'active' : 'default'}>
                  <Star size={12} fill={isFeatured ? 'currentColor' : 'none'} />
                  {isFeatured ? 'Main download' : 'Set as main download'}
                </IconGhostButton>

                {v.fileUrl && (
                  <a
                    href={v.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-mono text-[11px] text-primary hover:underline"
                  >
                    {v.fileUrl}
                  </a>
                )}
              </div>
            </div>
          )
        })}
        {versions.length === 0 && <EmptyState text="No versions yet — add one." />}
      </div>
    </SectionCard>
  )
}
