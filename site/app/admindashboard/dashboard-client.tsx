'use client'

import { useRef, useState } from 'react'
import { LockKeyhole, LogOut, Plus, Star, Trash2, Upload } from 'lucide-react'
import type { SiteContent, Version } from '@/lib/store'

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function makeId() {
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function DashboardClient({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [uploadingIdx, setUploadingIdx] = useState<string | null>(null)
  const [uploadPct, setUploadPct] = useState<number>(0)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }))

  const updateVersion = (id: string, patch: Partial<Version>) =>
    setContent((c) => ({
      ...c,
      versions: c.versions.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }))

  const addVersion = () => {
    const id = makeId()
    setContent((c) => ({
      ...c,
      versions: [{ id, version: '', date: '', size: '', file: '' }, ...c.versions],
    }))
  }

  const removeVersion = (id: string) =>
    setContent((c) => {
      const versions = c.versions.filter((v) => v.id !== id)
      const featuredVersionId =
        c.featuredVersionId === id ? versions[0]?.id || '' : c.featuredVersionId
      return { ...c, versions, featuredVersionId }
    })

  const setFeatured = (id: string) => update('featuredVersionId', id)

  const handleFileSelect = async (id: string, fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    setUploadingIdx(id)
    setUploadPct(0)
    setErrorMsg('')
    const MAX_SIZE = 500 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setErrorMsg('File is too large. Max upload size is 500 MB.')
      setUploadingIdx(null)
      return
    }

    try {
      const result = await new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload')
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadPct((e.loaded / e.total) * 100)
        }
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText)
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data)
            } else {
              reject(new Error(data.error || 'Upload failed.'))
            }
          } catch {
            reject(new Error('Upload failed.'))
          }
        }
        xhr.onerror = () => reject(new Error('Network error during upload.'))
        const fd = new FormData()
        fd.append('file', file)
        xhr.send(fd)
      })
      updateVersion(id, {
        fileUrl: result.url,
        file: file.name,
        size: formatSize(file.size),
      })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploadingIdx(null)
    }
  }

  const save = async () => {
    setStatus('saving')
    setErrorMsg('')
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setStatus('saved')
        window.setTimeout(() => setStatus('idle'), 2200)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Save failed.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error.')
      setStatus('error')
    }
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_var(--neon)]">
              <LockKeyhole size={16} />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Control center</p>
              <h1 className="font-mono text-lg font-bold">Site Editor</h1>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card/40 p-6">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Site name</span>
            <input
              value={content.siteName}
              onChange={(e) => update('siteName', e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Hero title</span>
            <textarea
              value={content.heroTitle}
              onChange={(e) => update('heroTitle', e.target.value)}
              rows={2}
              className="resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Hero subtitle</span>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) => update('heroSubtitle', e.target.value)}
              rows={2}
              className="resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Download name</span>
            <input
              value={content.downloadName}
              onChange={(e) => update('downloadName', e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Versions</span>
            <button
              onClick={addVersion}
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary transition-colors hover:text-foreground"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {content.versions.map((v) => {
              const isFeatured = v.id === content.featuredVersionId
              return (
                <div
                  key={v.id}
                  className={`flex flex-col gap-2 rounded-lg border p-3 ${
                    isFeatured ? 'border-primary/60 bg-primary/5' : 'border-border/50 bg-background/40'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:items-center">
                    <input
                      value={v.version}
                      onChange={(e) => updateVersion(v.id, { version: e.target.value })}
                      placeholder="Version"
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <input
                      value={v.date}
                      onChange={(e) => updateVersion(v.id, { date: e.target.value })}
                      placeholder="Date"
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <input
                      value={v.size}
                      onChange={(e) => updateVersion(v.id, { size: e.target.value })}
                      placeholder="Size"
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <input
                      value={v.file}
                      onChange={(e) => updateVersion(v.id, { file: e.target.value })}
                      placeholder="File name"
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => removeVersion(v.id)}
                      aria-label="Remove version"
                      className="flex items-center justify-center rounded-md border border-border/50 py-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={(el) => { fileInputs.current[v.id] = el }}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileSelect(v.id, e.target.files)}
                    />
                    <button
                      onClick={() => fileInputs.current[v.id]?.click()}
                      disabled={uploadingIdx === v.id}
                      className="flex items-center gap-1.5 rounded-md border border-border/50 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
                    >
                      <Upload size={12} />
                      {uploadingIdx === v.id ? `Uploading... ${Math.round(uploadPct)}%` : 'Upload file'}
                    </button>

                    <button
                      onClick={() => setFeatured(v.id)}
                      disabled={isFeatured}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors disabled:cursor-default ${
                        isFeatured
                          ? 'border-primary/60 text-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      <Star size={12} fill={isFeatured ? 'currentColor' : 'none'} />
                      {isFeatured ? 'Main download' : 'Set as main download'}
                    </button>

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
          </div>
        </div>

        {errorMsg && <p className="mt-4 font-mono text-xs text-red-400">{errorMsg}</p>}

        <button
          onClick={save}
          disabled={status === 'saving'}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-all hover:shadow-[0_0_24px_var(--neon)] disabled:opacity-50"
        >
          {status === 'saving'
            ? 'Saving...'
            : status === 'saved'
              ? 'Changes saved'
              : status === 'error'
                ? 'Save failed — try again'
                : 'Save changes'}
        </button>

        <a
          href="/"
          className="mt-4 block text-center font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to site
        </a>
      </div>
    </main>
  )
}
