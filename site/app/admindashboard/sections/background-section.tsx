'use client'

import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Film, Image as ImageIcon, Upload } from 'lucide-react'
import type { SiteBackground } from '@/lib/store'
import { Field, SectionCard, SmallInput, TextInput } from '../ui'

const VIDEO_EXTS = ['.mp4', '.webm', '.ogv', '.mov']
const IMAGE_EXTS = ['.gif', '.webp', '.png', '.jpg', '.jpeg', '.apng']

function isVideoUrl(url: string) {
  const ext = url.split('.').pop()?.toLowerCase() ?? ''
  return VIDEO_EXTS.some((e) => e === '.' + ext)
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

    // Auto-detect type from extension
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
          } catch {
            reject(new Error('Upload failed'))
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        const fd = new FormData()
        fd.append('file', file)
        xhr.send(fd)
      })

      onUpdate({ url, type: detectedType, enabled: true })
      setUploadSuccess(`Uploaded successfully as ${detectedType === 'video' ? 'video' : 'image'} background`)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const acceptStr = [...VIDEO_EXTS, ...IMAGE_EXTS].map((e) => `video/${e.slice(1)},image/${e.slice(1)}`).join(',') +
    ',video/mp4,video/webm,image/gif,image/webp,image/png,image/jpeg'

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={Film}
        title="Animated Site Background"
        description="Upload a looping video or animated image that fills the entire site background. The file scales to fit any screen size without distortion."
      >
        <div className="flex flex-col gap-6">

          {/* Enable Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Enable background
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Shows the animated background across the entire site
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdate({ enabled: !bg.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${bg.enabled ? 'bg-primary' : 'bg-muted'}`}
              role="switch"
              aria-checked={bg.enabled}
            >
              <span className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg transition duration-200 ${bg.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Upload Zone */}
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/60 bg-background/30 p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Upload background file
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Video</strong> (MP4, WebM, MOV) — best quality, loops seamlessly, any length<br />
              <strong className="text-foreground">Image</strong> (GIF, WebP, APNG, PNG, JPG) — animated GIFs and static images
            </p>

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
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-[0_0_14px_var(--neon-soft)] disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? `Uploading... ${Math.round(uploadPct)}%` : 'Choose file to upload'}
            </button>

            {uploading && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
            )}

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

          {/* Manual URL input */}
          <Field label="Or paste a direct URL (must be from /uploads/...)">
            <TextInput
              value={bg.url}
              onChange={(e) => {
                const url = e.target.value
                const detectedType = isVideoUrl(url) ? 'video' : 'image'
                onUpdate({ url, type: detectedType })
              }}
              placeholder="/uploads/your-background.mp4"
            />
          </Field>

          {/* Type selector */}
          <Field label="Background type">
            <div className="flex gap-2">
              {(['video', 'image'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate({ type: t })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    bg.type === t
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_var(--neon-soft)]'
                      : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {t === 'video' ? <Film size={13} /> : <ImageIcon size={13} />}
                  {t === 'video' ? 'Video (MP4/WebM)' : 'Image / GIF'}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {bg.type === 'video'
                ? 'Renders a muted, looping, autoplay video. Use MP4 for best browser compatibility.'
                : 'Renders an image tag — great for animated GIFs or WebP animations.'}
            </p>
          </Field>
        </div>
      </SectionCard>

      {/* Preview + Controls */}
      {bg.url && (
        <SectionCard
          icon={Film}
          title="Appearance Controls"
          description="Adjust how the background looks. Changes are previewed live on the site after saving."
        >
          <div className="flex flex-col gap-5">

            {/* Live preview */}
            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-black" style={{ aspectRatio: '16/5' }}>
              {bg.type === 'video' ? (
                <video
                  key={bg.url}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 size-full object-cover"
                  style={{ opacity: bg.opacity / 100, filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined }}
                >
                  <source src={bg.url} />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bg.url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  style={{ opacity: bg.opacity / 100, filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: `rgba(0,0,0,${bg.overlayOpacity / 100})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur-sm">
                  Preview
                </span>
              </div>
            </div>

            {/* Opacity slider */}
            <Field label={`Background opacity — ${bg.opacity}%`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground w-6">0%</span>
                <input
                  type="range" min="0" max="100" value={bg.opacity}
                  onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-card border border-border/50 accent-primary"
                />
                <span className="font-mono text-xs text-muted-foreground w-10">100%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">How bright/visible the background is. Lower = more subtle.</p>
            </Field>

            {/* Overlay opacity slider */}
            <Field label={`Dark overlay — ${bg.overlayOpacity}%`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground w-6">0%</span>
                <input
                  type="range" min="0" max="95" value={bg.overlayOpacity}
                  onChange={(e) => onUpdate({ overlayOpacity: Number(e.target.value) })}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-card border border-border/50 accent-primary"
                />
                <span className="font-mono text-xs text-muted-foreground w-10">95%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Dark layer above the background. Increase if text is hard to read.</p>
            </Field>

            {/* Blur slider */}
            <Field label={`Blur — ${bg.blur}px`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground w-6">0</span>
                <input
                  type="range" min="0" max="20" value={bg.blur}
                  onChange={(e) => onUpdate({ blur: Number(e.target.value) })}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-card border border-border/50 accent-primary"
                />
                <span className="font-mono text-xs text-muted-foreground w-10">20px</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Gaussian blur on the background — 0 = sharp, great for cinematic effect at 2-4px.</p>
            </Field>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
