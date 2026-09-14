'use client'

import { useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Flame,
  Image as ImageIcon,
  Link,
  PanelBottom,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react'
import type { FooterColumn, FooterLink, LogoType, SiteContent } from '@/lib/store'
import SiteLogo from '@/components/site-logo'
import { EmptyState, Field, IconGhostButton, ProgressBar, SectionCard, SmallInput, TextArea, TextInput, Toggle } from '../ui'

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export default function FooterSection({
  content,
  update,
}: {
  content: SiteContent
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void
}) {
  const {
    siteName,
    accentColor,
    logoType = 'dynamic-s',
    logoUrl,
    logoTint = true,
    logoGlow = true,
    footerDescription,
    footerColumns,
    footerCopyright,
  } = content

  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [uploadMsg, setUploadMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setUploading(true)
    setUploadPct(0)
    setUploadMsg(null)
    try {
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload')
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadPct((e.loaded / e.total) * 100)
        }
        xhr.onload = () => {
          try {
            const d = JSON.parse(xhr.responseText)
            if (xhr.status >= 200 && xhr.status < 300) resolve(d.url)
            else reject(new Error(d.error || 'Upload failed'))
          } catch {
            reject(new Error('Upload failed'))
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        const fd = new FormData()
        fd.append('file', file)
        xhr.send(fd)
      })
      update('logoUrl', url)
      update('logoType', 'custom')
      setUploadMsg({ type: 'ok', text: 'Logo uploaded successfully!' })
    } catch (err) {
      setUploadMsg({ type: 'err', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  // ── Column helpers ──────────────────────────────────────────────────
  const addColumn = () => {
    const col: FooterColumn = { id: makeId('fc'), heading: 'New Column', links: [] }
    update('footerColumns', [...footerColumns, col])
  }

  const updateColumn = (id: string, patch: Partial<FooterColumn>) =>
    update('footerColumns', footerColumns.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const removeColumn = (id: string) =>
    update('footerColumns', footerColumns.filter((c) => c.id !== id))

  const addLink = (colId: string) => {
    const lnk: FooterLink = { id: makeId('fl'), label: 'Link', url: '#' }
    updateColumn(colId, {
      links: [...(footerColumns.find((c) => c.id === colId)?.links ?? []), lnk],
    })
  }

  const updateLink = (colId: string, linkId: string, patch: Partial<FooterLink>) =>
    updateColumn(colId, {
      links: (footerColumns.find((c) => c.id === colId)?.links ?? []).map((l) =>
        l.id === linkId ? { ...l, ...patch } : l,
      ),
    })

  const removeLink = (colId: string, linkId: string) =>
    updateColumn(colId, {
      links: (footerColumns.find((c) => c.id === colId)?.links ?? []).filter((l) => l.id !== linkId),
    })

  return (
    <div className="flex flex-col gap-6">
      {/* ── Logo & Theme Sync ────────────────────────────────────────── */}
      <SectionCard
        icon={Zap}
        title="Logo & dynamic theme sync"
        description="Choose a dynamic vector logo that automatically adapts to the site's accent color & video background, or upload a custom image."
        accent
      >
        <div className="flex flex-col gap-5">
          {/* Logo Style Selector */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Logo style
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                {
                  id: 'dynamic-s' as LogoType,
                  title: "Dynamic 'S'",
                  desc: 'Geometric vector, shifts color with theme',
                  icon: Zap,
                },
                {
                  id: 'dynamic-demon' as LogoType,
                  title: 'Dynamic Demon',
                  desc: 'Phantom-style cutout, shifts with theme',
                  icon: Flame,
                },
                {
                  id: 'custom' as LogoType,
                  title: 'Custom Upload',
                  desc: 'Your custom PNG/JPG image',
                  icon: ImageIcon,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('logoType', item.id)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    logoType === item.id
                      ? 'border-primary/60 bg-primary/10 shadow-[0_0_16px_rgba(239,45,67,0.15)]'
                      : 'border-border/50 bg-background/40 hover:border-border/80 hover:bg-background/70'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                      <item.icon size={13} className={logoType === item.id ? 'text-primary' : 'text-muted-foreground'} />
                      {item.title}
                    </span>
                    {logoType === item.id && (
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] leading-4 text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Logo Preview Box */}
          <div className="flex items-center gap-5 rounded-xl border border-border/50 bg-background/50 p-5 backdrop-blur-sm">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/60 p-3 shadow-inner">
              <SiteLogo
                type={logoType}
                logoUrl={logoUrl}
                logoTint={logoTint}
                logoGlow={logoGlow}
                siteName={siteName}
                className="size-14"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-bold text-foreground">Active logo preview</p>
                <span
                  className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase font-bold"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    borderColor: `${accentColor}40`,
                    color: accentColor,
                  }}
                >
                  Theme: {accentColor}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {logoType === 'custom'
                  ? 'Custom image uploaded. Toggle "Theme Accent Tint" below to auto-tint with the active site theme.'
                  : 'Vector logo active — will automatically change colors when you pick a new accent color or when over the video background.'}
              </p>
            </div>
          </div>

          {/* Dynamic Controls / Toggles */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              enabled={logoGlow}
              onChange={(v) => update('logoGlow', v)}
              label="Theme & video ambient glow"
              description="Logo pulses with a breathing neon glow matching the site accent"
            />
            {logoType === 'custom' && (
              <Toggle
                enabled={logoTint}
                onChange={(v) => update('logoTint', v)}
                label="Theme accent tint"
                description="Automatically recolors white/transparent logos with the website's theme color"
              />
            )}
          </div>

          {/* Custom Upload Controls (visible when custom mode or always accessible) */}
          {logoType === 'custom' && (
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border/60 bg-background/30 p-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoUpload(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-[0_0_14px_rgba(239,45,67,0.15)] disabled:opacity-50 active:scale-95"
              >
                <Upload size={14} />
                {uploading ? `Uploading… ${Math.round(uploadPct)}%` : 'Upload custom logo image'}
              </button>
              {uploading && <ProgressBar pct={uploadPct} />}
              {uploadMsg && (
                <p
                  className={`flex items-center gap-1.5 font-mono text-xs ${
                    uploadMsg.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {uploadMsg.type === 'ok' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  {uploadMsg.text}
                </p>
              )}

              <Field label="Or paste logo URL" hint="A URL from /uploads/... or any public image URL.">
                <TextInput
                  value={logoUrl ?? ''}
                  onChange={(e) => update('logoUrl', e.target.value)}
                  placeholder="/logo.jpg"
                />
              </Field>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Identity ──────────────────────────────────────────────── */}
      <SectionCard
        icon={PanelBottom}
        title="Footer text"
        description="Text shown in the footer below the logo, and in the bottom copyright bar."
      >
        <div className="flex flex-col gap-5">
          <Field label="Footer description" hint="Shown below the logo on the left side of the footer.">
            <TextArea
              value={footerDescription ?? ''}
              onChange={(e) => update('footerDescription', e.target.value)}
              rows={3}
              placeholder="The most advanced HUD overlay for competitive Minecraft."
            />
          </Field>
          <Field label="Copyright text" hint="Shown in the bottom bar. Include © and the year.">
            <TextInput
              value={footerCopyright ?? ''}
              onChange={(e) => update('footerCopyright', e.target.value)}
              placeholder={`© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
            />
          </Field>

          {/* Live preview */}
          <div className="overflow-hidden rounded-xl border border-border/40 bg-background/20">
            <p className="border-b border-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Footer preview
            </p>
            <div className="flex items-center gap-3 px-5 py-4">
              <SiteLogo
                type={logoType}
                logoUrl={logoUrl}
                logoTint={logoTint}
                logoGlow={logoGlow}
                siteName={siteName}
                className="size-8"
              />
              <div>
                <p className="font-mono text-sm font-black uppercase tracking-widest text-foreground">{siteName}</p>
                <p className="text-xs text-muted-foreground">
                  {footerDescription?.slice(0, 60) ?? ''}
                  {(footerDescription?.length ?? 0) > 60 ? '…' : ''}
                </p>
              </div>
            </div>
            <div className="border-t border-border/30 px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60">
              {footerCopyright}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Link columns ──────────────────────────────────────────── */}
      <SectionCard
        icon={Link}
        title="Footer link columns"
        description="Groups of links shown in the footer. Add columns like 'Product', 'Support', 'Connect' — each with their own links."
        onAdd={addColumn}
        addLabel="Add column"
      >
        <div className="flex flex-col gap-4">
          {footerColumns.map((col) => (
            <div key={col.id} className="flex flex-col gap-3 rounded-xl border border-border/40 bg-background/40 p-4">
              {/* Column header */}
              <div className="flex items-center gap-2.5">
                <SmallInput
                  value={col.heading}
                  onChange={(e) => updateColumn(col.id, { heading: e.target.value })}
                  placeholder="Column heading"
                  className="flex-1 font-bold uppercase tracking-widest"
                />
                <IconGhostButton onClick={() => removeColumn(col.id)} label="Remove column" variant="danger">
                  <Trash2 size={12} /> Remove
                </IconGhostButton>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 pl-2">
                {col.links.map((lnk) => (
                  <div key={lnk.id} className="flex items-center gap-2">
                    <SmallInput
                      value={lnk.label}
                      onChange={(e) => updateLink(col.id, lnk.id, { label: e.target.value })}
                      placeholder="Link label"
                      className="flex-1"
                    />
                    <SmallInput
                      value={lnk.url}
                      onChange={(e) => updateLink(col.id, lnk.id, { url: e.target.value })}
                      placeholder="URL or #anchor"
                      className="flex-1"
                    />
                    <IconGhostButton onClick={() => removeLink(col.id, lnk.id)} label="Remove link" variant="danger">
                      <Trash2 size={12} />
                    </IconGhostButton>
                  </div>
                ))}

                <button
                  onClick={() => addLink(col.id)}
                  className="mt-1 flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                >
                  <Plus size={11} /> Add link
                </button>
              </div>
            </div>
          ))}

          {footerColumns.length === 0 && <EmptyState text="No columns yet — add one above." />}
        </div>
      </SectionCard>
    </div>
  )
}
