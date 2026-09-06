'use client'

import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Film, Image as ImageIcon, Upload } from 'lucide-react'
import type { SiteBackground } from '@/lib/store'
import { Field, ProgressBar, SectionCard, Slider, TextInput, Toggle } from '../ui'

const VIDEO_EXTS = ['.mp4', '.webm', '.ogv', '.mov']
const IMAGE_EXTS = ['.gif', '.webp', '.png', '.jpg', '.jpeg', '.apng']

function isVideoUrl(url: string) {
  const ext = '.' + (url.split('.').pop()?.toLowerCase() ?? '')
  return VIDEO_EXTS.includes(ext)
}

export default function BackgroundSection({
  bg,
  onUpdate,
}: {
  bg: SiteBackground
  onUpdate: (patch: Partial<SiteBackground>) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setUploading(true)
    setUploadPct(0)
    setUploadError('')
    setUploadSuccess('')

    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    const detectedType: 'video' | 'image' = VIDEO_EXTS.includes(ext) ? 'video' : 'image'

    try {
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload')
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadPct((e.loaded / e.total) * 100)
        }
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText)
            if (xhr.status >= 200 && xhr.status < 300) resolve(data.url)
            else reject(new Error(data.error || 'Upload failed'))
          } catch { reject(new Error('Upload failed')) }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        const fd = new FormData()
        fd.append('file', file)
        xhr.send(fd)
      })
      onUpdate({ url, type: detectedType, enabled: true })
      setUploadSuccess(`Uploaded as ${detectedType} background`)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const acceptStr = 'video/mp4,video/webm,video/quicktime,image/gif,image/webp,image/png,image/jpeg,image/apng'

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={Film}
        title="Animated site background"
        description="A full-viewport looping video or animated image behind all page content. Scales perfectly at any screen size."
      >
        <div className="flex flex-col gap-5">
          <Toggle
            enabled={bg.enabled}
            onChange={(v) => onUpdate({ enabled: v })}
            label="Enable background"
            description="Shows the animated background across the entire site"
          />

          {/* Upload zone */}
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/60 bg-background/30 p-5">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-xs font-bold text-foreground">Upload background file</p>
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Video</strong> (MP4, WebM, MOV) — best quality, loops seamlessly<br />
                  <strong className="text-foreground">Image</strong> (GIF, WebP, APNG) — animated images
                </p>
              </div>
              <div className="ml-auto flex gap-2 text-muted-foreground">
                <Film size={20} />
                <ImageIcon size={20} />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptStr}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-[0_0_14px_rgba(239,45,67,0.15)] disabled:opacity-50 active:scale-95"
            >
              <Upload size={14} />
              {uploading ? `Uploading… ${Math.round(uploadPct)}%` : 'Choose file to upload'}
            </button>

            {uploading && <ProgressBar pct={uploadPct} />}

            {uploadSuccess && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <CheckCircle2 size={13} /> {uploadSuccess}
              </p>
            )}
            {uploadError && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-red-400">
                <AlertCircle size={13} /> {uploadError}
              </p>
            )}
          </div>

          {/* Manual URL */}
          <Field label="Or paste a direct URL" hint="Must be from /uploads/... — e.g. /uploads/background.mp4">
            <TextInput
              value={bg.url}
              onChange={(e) => {
                const url = e.target.value
                onUpdate({ url, type: isVideoUrl(url) ? 'video' : 'image' })
              }}
              placeholder="/uploads/your-background.mp4"
            />
          </Field>

          {/* Type selector */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Background type</span>
            <div className="flex gap-2">
              {(['video', 'image'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate({ type: t })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    bg.type === t
                      ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_rgba(239,45,67,0.15)]'
                      : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {t === 'video' ? <Film size={13} /> : <ImageIcon size={13} />}
                  {t === 'video' ? 'Video (MP4/WebM)' : 'Image / GIF'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Appearance controls + live preview */}
      {bg.url && (
        <SectionCard icon={Film} title="Appearance controls" description="Adjust how the background looks — changes preview live below.">
          <div className="flex flex-col gap-6">
            {/* Mini preview */}
            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-black" style={{ aspectRatio: '16/5' }}>
              {bg.type === 'video' ? (
                <video
                  key={bg.url}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 size-full object-cover"
                  style={{
                    opacity: bg.opacity / 100,
                    filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined,
                  }}
                >
                  <source src={bg.url} />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bg.url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  style={{
                    opacity: bg.opacity / 100,
                    filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined,
                  }}
                />
              )}
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${bg.overlayOpacity / 100})` }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs text-white/60 backdrop-blur-sm">
                  Live preview
                </span>
                <span className="font-mono text-[10px] text-white/40">
                  Opacity {bg.opacity}% · Overlay {bg.overlayOpacity}% · Blur {bg.blur}px
                </span>
              </div>
            </div>

            <Slider
              label="Background opacity"
              value={bg.opacity}
              min={0}
              max={100}
              unit="%"
              hint="How visible the background is. Lower = more subtle and dark."
              onChange={(v) => onUpdate({ opacity: v })}
            />

            <Slider
              label="Dark overlay"
              value={bg.overlayOpacity}
              min={0}
              max={95}
              unit="%"
              hint="A dark layer above the background. Increase if text is hard to read."
              onChange={(v) => onUpdate({ overlayOpacity: v })}
            />

            <Slider
              label="Blur"
              value={bg.blur}
              min={0}
              max={20}
              unit="px"
              hint="Gaussian blur — 0 = sharp, 2-4px = cinematic frosted look."
              onChange={(v) => onUpdate({ blur: v })}
            />
          </div>
        </SectionCard>
      )}
    </div>
  )
}
