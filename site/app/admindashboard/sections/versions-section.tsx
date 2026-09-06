'use client'

import { FileArchive, Star, Trash2, Upload, CheckCircle2 } from 'lucide-react'
import type { Version } from '@/lib/store'
import { EmptyState, IconGhostButton, ProgressBar, SectionCard, SmallInput } from '../ui'

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
    <SectionCard
      icon={FileArchive}
      title="Versions"
      description="Every release available in the download and archive sections. The starred version appears as the main download."
      onAdd={onAdd}
      addLabel="Add version"
    >
      <div className="flex flex-col gap-3">
        {versions.map((v) => {
          const isFeatured = v.id === featuredVersionId
          const isUploading = uploadingIdx === v.id
          return (
            <div
              key={v.id}
              className={`relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                isFeatured
                  ? 'border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(239,45,67,0.08)]'
                  : 'border-border/40 bg-background/50 hover:border-border/70'
              }`}
            >
              {/* featured top line */}
              {isFeatured && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              )}

              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isFeatured && (
                    <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                      <Star size={9} fill="currentColor" /> Main
                    </span>
                  )}
                  <span className="font-mono text-xs font-bold text-foreground">{v.version || 'New version'}</span>
                </div>
                <IconGhostButton onClick={() => onRemove(v.id)} label="Remove version" variant="danger">
                  <Trash2 size={12} /> Remove
                </IconGhostButton>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SmallInput
                  value={v.version}
                  onChange={(e) => onUpdate(v.id, { version: e.target.value })}
                  placeholder="v1.0.0"
                />
                <SmallInput
                  value={v.date}
                  onChange={(e) => onUpdate(v.id, { date: e.target.value })}
                  placeholder="Jan 1, 2026"
                />
                <SmallInput
                  value={v.size}
                  onChange={(e) => onUpdate(v.id, { size: e.target.value })}
                  placeholder="18 MB"
                />
                <SmallInput
                  value={v.file}
                  onChange={(e) => onUpdate(v.id, { file: e.target.value })}
                  placeholder="filename.zip"
                />
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={(el) => registerFileInput(v.id, el)}
                  type="file"
                  className="hidden"
                  onChange={(e) => onFileSelected(v.id, e.target.files)}
                />
                <IconGhostButton onClick={() => onUploadClick(v.id)} disabled={isUploading}>
                  <Upload size={12} />
                  {isUploading ? `Uploading…` : 'Upload file'}
                </IconGhostButton>

                <IconGhostButton
                  onClick={() => onSetFeatured(v.id)}
                  disabled={isFeatured}
                  variant={isFeatured ? 'active' : 'default'}
                >
                  <Star size={12} fill={isFeatured ? 'currentColor' : 'none'} />
                  {isFeatured ? 'Main download' : 'Set as main'}
                </IconGhostButton>

                {v.fileUrl && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                    <CheckCircle2 size={11} /> File uploaded
                  </span>
                )}
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="flex flex-col gap-1">
                  <ProgressBar pct={uploadPct} />
                  <span className="font-mono text-[10px] text-muted-foreground">{Math.round(uploadPct)}% uploaded</span>
                </div>
              )}
            </div>
          )
        })}
        {versions.length === 0 && <EmptyState text="No versions yet — add one above." />}
      </div>
    </SectionCard>
  )
}
