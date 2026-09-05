'use client'

import { useMemo, useRef, useState, type ComponentType } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Menu,
  Music,
  PanelBottom,
  Settings,
  Tag,
  Users,
  X,
} from 'lucide-react'
import type { BackgroundMusicConfig, Faq, Feature, HeroBadge, ShowcaseItem, SiteContent, TeamMember, Version } from '@/lib/store'
import GeneralSection from './sections/general-section'
import BadgesSection from './sections/badges-section'
import FeaturesSection from './sections/features-section'
import VersionsSection from './sections/versions-section'
import FaqSection from './sections/faq-section'
import CreditsSection from './sections/credits-section'
import FooterSection from './sections/footer-section'
import ShowcaseSection from './sections/showcase-section'
import MusicSection from './sections/music-section'

type TabKey = 'general' | 'badges' | 'features' | 'showcase' | 'music' | 'versions' | 'faq' | 'credits' | 'footer'

const TABS: { key: TabKey; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'badges', label: 'Hero badges', icon: Tag },
  { key: 'features', label: 'Features', icon: LayoutGrid },
  { key: 'showcase', label: 'Showcase', icon: ImageIcon },
  { key: 'music', label: 'Music player', icon: Music },
  { key: 'versions', label: 'Versions', icon: FileArchive },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'credits', label: 'Credits', icon: Users },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
]

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function DashboardClient({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialContent))
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [uploadingIdx, setUploadingIdx] = useState<string | null>(null)
  const [uploadPct, setUploadPct] = useState<number>(0)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})
  const avatarInputs = useRef<Record<string, HTMLInputElement | null>>({})
  const showcaseInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const isDirty = useMemo(() => JSON.stringify(content) !== savedSnapshot, [content, savedSnapshot])

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }))

  // Hero badges
  const addBadge = () => {
    const id = makeId('badge')
    setContent((c) => ({ ...c, heroBadges: [...c.heroBadges, { id, text: '' }] }))
  }
  const updateBadge = (id: string, text: string) =>
    setContent((c) => ({ ...c, heroBadges: c.heroBadges.map((b) => (b.id === id ? { ...b, text } : b)) }))
  const removeBadge = (id: string) =>
    setContent((c) => ({ ...c, heroBadges: c.heroBadges.filter((b) => b.id !== id) }))

  // Features
  const addFeature = () => {
    const id = makeId('feature')
    setContent((c) => ({
      ...c,
      features: [...c.features, { id, icon: 'star', title: '', text: '' } as Feature],
    }))
  }
  const updateFeature = (id: string, patch: Partial<Feature>) =>
    setContent((c) => ({ ...c, features: c.features.map((f) => (f.id === id ? { ...f, ...patch } : f)) }))
  const removeFeature = (id: string) =>
    setContent((c) => ({ ...c, features: c.features.filter((f) => f.id !== id) }))

  // Showcase
  const addShowcaseItem = () => {
    const id = makeId('sc')
    setContent((c) => ({
      ...c,
      showcase: [...c.showcase, { id, title: '', description: '', tag: '', imageUrl: '' }],
    }))
  }
  const updateShowcaseItem = (id: string, patch: Partial<ShowcaseItem>) =>
    setContent((c) => ({
      ...c,
      showcase: c.showcase.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  const removeShowcaseItem = (id: string) =>
    setContent((c) => ({ ...c, showcase: c.showcase.filter((s) => s.id !== id) }))
  const moveShowcaseItemUp = (index: number) => {
    if (index === 0) return
    setContent((c) => {
      const items = [...c.showcase]
      ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
      return { ...c, showcase: items }
    })
  }
  const moveShowcaseItemDown = (index: number) => {
    setContent((c) => {
      if (index >= c.showcase.length - 1) return c
      const items = [...c.showcase]
      ;[items[index], items[index + 1]] = [items[index + 1], items[index]]
      return { ...c, showcase: items }
    })
  }

  // Music
  const updateMusic = (patch: Partial<BackgroundMusicConfig>) =>
    setContent((c) => ({ ...c, music: { ...c.music, ...patch } }))

  // Versions
  const updateVersion = (id: string, patch: Partial<Version>) =>
    setContent((c) => ({ ...c, versions: c.versions.map((v) => (v.id === id ? { ...v, ...patch } : v)) }))

  const addVersion = () => {
    const id = makeId('v')
    setContent((c) => ({
      ...c,
      versions: [{ id, version: '', date: '', size: '', file: '' }, ...c.versions],
    }))
  }

  const removeVersion = (id: string) =>
    setContent((c) => {
      const versions = c.versions.filter((v) => v.id !== id)
      const featuredVersionId = c.featuredVersionId === id ? versions[0]?.id || '' : c.featuredVersionId
      return { ...c, versions, featuredVersionId }
    })

  const setFeatured = (id: string) => update('featuredVersionId', id)

  // FAQs
  const updateFaq = (id: string, patch: Partial<Faq>) =>
    setContent((c) => ({ ...c, faqs: c.faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)) }))

  const addFaq = () => {
    const id = makeId('faq')
    setContent((c) => ({ ...c, faqs: [...c.faqs, { id, question: '', answer: '' }] }))
  }

  const removeFaq = (id: string) => setContent((c) => ({ ...c, faqs: c.faqs.filter((f) => f.id !== id) }))

  // Team
  const updateMember = (id: string, patch: Partial<TeamMember>) =>
    setContent((c) => ({ ...c, team: c.team.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))

  const addMember = () => {
    const id = makeId('team')
    setContent((c) => ({ ...c, team: [...c.team, { id, name: '', role: '' }] }))
  }

  const removeMember = (id: string) => setContent((c) => ({ ...c, team: c.team.filter((t) => t.id !== id) }))

  const uploadRaw = async (file: File, onProgress: (pct: number) => void): Promise<{ url: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload')
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress((e.loaded / e.total) * 100)
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) resolve(data)
          else reject(new Error(data.error || 'Upload failed.'))
        } catch {
          reject(new Error('Upload failed.'))
        }
      }
      xhr.onerror = () => reject(new Error('Network error during upload.'))
      const fd = new FormData()
      fd.append('file', file)
      xhr.send(fd)
    })
  }

  const handleAvatarSelect = async (id: string, fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    const key = `avatar-${id}`
    setUploadingIdx(key)
    setUploadPct(0)
    setErrorMsg('')
    try {
      const result = await uploadRaw(file, setUploadPct)
      updateMember(id, { avatarUrl: result.url })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploadingIdx(null)
    }
  }

  const handleShowcaseImageSelect = async (id: string, fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    const key = `showcase-${id}`
    setUploadingIdx(key)
    setUploadPct(0)
    setErrorMsg('')
    try {
      const result = await uploadRaw(file, setUploadPct)
      updateShowcaseItem(id, { imageUrl: result.url })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploadingIdx(null)
    }
  }

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
      const result = await uploadRaw(file, setUploadPct)
      updateVersion(id, {
        fileUrl: result.url,
        file: file.name,
        size: formatSize(file.size),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
        setSavedSnapshot(JSON.stringify(content))
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

  const activeMeta = TABS.find((t) => t.key === activeTab)!

  const saveLabel =
    status === 'saving'
      ? 'Saving...'
      : status === 'saved'
        ? 'Changes saved'
        : status === 'error'
          ? 'Save failed — retry'
          : isDirty
            ? 'Save changes'
            : 'Saved'

  const navButtonClass = (key: TabKey) =>
    `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
      activeTab === key
        ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_var(--neon)]'
        : 'text-muted-foreground hover:bg-card hover:text-foreground'
    }`

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-1 pb-6">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_var(--neon)]">
          <LockKeyhole size={16} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Control center</p>
          <h1 className="font-mono text-base font-bold">Site Editor</h1>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key)
              setMobileNavOpen(false)
            }}
            className={navButtonClass(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-1 border-t border-border/40 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-card hover:text-primary"
        >
          ← View live site
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-card hover:text-primary"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </>
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/40 bg-card/30 p-5 md:flex">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <aside className="relative flex h-full w-72 flex-col border-r border-border/40 bg-card p-5">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-4 top-5 text-muted-foreground hover:text-primary"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="flex size-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:text-primary md:hidden"
                aria-label="Open menu"
              >
                <Menu size={16} />
              </button>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{activeMeta.label}</p>
                <h2 className="font-mono text-sm font-bold text-foreground sm:text-base">Editing site content</h2>
              </div>
            </div>

            <button
              onClick={save}
              disabled={status === 'saving' || !isDirty}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-all hover:shadow-[0_0_24px_var(--neon)] disabled:cursor-default disabled:opacity-50 disabled:shadow-none"
            >
              {status === 'saved' ? <CheckCircle2 size={14} /> : status === 'error' ? <AlertCircle size={14} /> : null}
              {saveLabel}
              {isDirty && status === 'idle' && <span className="size-1.5 rounded-full bg-primary-foreground" />}
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8">
            {errorMsg && (
              <p className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
                <AlertCircle size={14} /> {errorMsg}
              </p>
            )}

            {activeTab === 'general' && <GeneralSection content={content} update={update} />}

            {activeTab === 'badges' && (
              <BadgesSection badges={content.heroBadges} onAdd={addBadge} onUpdate={updateBadge} onRemove={removeBadge} />
            )}

            {activeTab === 'features' && (
              <FeaturesSection
                features={content.features}
                onAdd={addFeature}
                onUpdate={updateFeature}
                onRemove={removeFeature}
              />
            )}

            {activeTab === 'showcase' && (
              <ShowcaseSection
                title={content.showcaseTitle}
                subtitle={content.showcaseSubtitle}
                items={content.showcase}
                uploadingIdx={uploadingIdx}
                uploadPct={uploadPct}
                onUpdateTitle={(t) => update('showcaseTitle', t)}
                onUpdateSubtitle={(s) => update('showcaseSubtitle', s)}
                onAdd={addShowcaseItem}
                onUpdate={updateShowcaseItem}
                onRemove={removeShowcaseItem}
                onMoveUp={moveShowcaseItemUp}
                onMoveDown={moveShowcaseItemDown}
                onUploadClick={(id) => showcaseInputs.current[id]?.click()}
                registerFileInput={(id, el) => { showcaseInputs.current[id] = el }}
                onFileSelected={handleShowcaseImageSelect}
              />
            )}

            {activeTab === 'music' && (
              <MusicSection music={content.music} onUpdate={updateMusic} />
            )}

            {activeTab === 'versions' && (
              <VersionsSection
                versions={content.versions}
                featuredVersionId={content.featuredVersionId}
                uploadingIdx={uploadingIdx}
                uploadPct={uploadPct}
                onAdd={addVersion}
                onUpdate={updateVersion}
                onRemove={removeVersion}
                onSetFeatured={setFeatured}
                onUploadClick={(id) => fileInputs.current[id]?.click()}
                registerFileInput={(id, el) => {
                  fileInputs.current[id] = el
                }}
                onFileSelected={handleFileSelect}
              />
            )}

            {activeTab === 'faq' && (
              <FaqSection faqs={content.faqs} onAdd={addFaq} onUpdate={updateFaq} onRemove={removeFaq} />
            )}

            {activeTab === 'credits' && (
              <CreditsSection
                team={content.team}
                uploadingIdx={uploadingIdx}
                uploadPct={uploadPct}
                onAdd={addMember}
                onUpdate={updateMember}
                onRemove={removeMember}
                onUploadClick={(id) => avatarInputs.current[id]?.click()}
                registerAvatarInput={(id, el) => {
                  avatarInputs.current[id] = el
                }}
                onAvatarSelected={handleAvatarSelect}
              />
            )}

            {activeTab === 'footer' && (
              <FooterSection
                siteName={content.siteName}
                footerTagline={content.footerTagline}
                onUpdate={(value) => update('footerTagline', value)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
