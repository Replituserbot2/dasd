'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Trash2, Upload, Users } from 'lucide-react'
import type { TeamMember } from '@/lib/store'
import type { DiscordUser } from '@/lib/discord'
import { EmptyState, Field, IconGhostButton, Row, SectionCard, SmallInput } from '../ui'

type PreviewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'found'; user: DiscordUser }
  | { status: 'error'; message: string }

function useDiscordPreview(discordId: string | undefined) {
  const [preview, setPreview] = useState<PreviewState>({ status: 'idle' })

  useEffect(() => {
    const id = discordId?.trim()
    if (!id) {
      setPreview({ status: 'idle' })
      return
    }
    if (!/^\d{15,25}$/.test(id)) {
      setPreview({ status: 'error', message: 'Discord IDs are 15–25 digit numbers.' })
      return
    }

    let cancelled = false
    setPreview({ status: 'loading' })
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/discord/${id}`)
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (res.ok) setPreview({ status: 'found', user: data as DiscordUser })
        else setPreview({ status: 'error', message: data.error || 'Lookup failed.' })
      } catch {
        if (!cancelled) setPreview({ status: 'error', message: 'Network error during lookup.' })
      }
    }, 500)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [discordId])

  return preview
}

function MemberRow({
  member,
  uploadingKey,
  uploadPct,
  onUpdate,
  onRemove,
  onUploadClick,
  registerAvatarInput,
  onAvatarSelected,
}: {
  member: TeamMember
  uploadingKey: string | null
  uploadPct: number
  onUpdate: (patch: Partial<TeamMember>) => void
  onRemove: () => void
  onUploadClick: () => void
  registerAvatarInput: (el: HTMLInputElement | null) => void
  onAvatarSelected: (files: FileList | null) => void
}) {
  const preview = useDiscordPreview(member.discordId)
  const avatarKey = `avatar-${member.id}`
  const previewAvatar = preview.status === 'found' ? preview.user.avatarUrl : undefined
  const fallbackAvatar = member.avatarUrl || '/placeholder-user.jpg'

  return (
    <Row>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewAvatar || fallbackAvatar}
          alt=""
          className="size-10 shrink-0 rounded-full border border-border/50 object-cover"
        />
        <input
          ref={registerAvatarInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onAvatarSelected(e.target.files)}
        />
        <IconGhostButton onClick={onUploadClick} disabled={uploadingKey === avatarKey}>
          <Upload size={12} />
          {uploadingKey === avatarKey ? `Uploading... ${Math.round(uploadPct)}%` : 'Fallback avatar'}
        </IconGhostButton>
        <IconGhostButton onClick={onRemove} label="Remove member" variant="danger">
          <Trash2 size={14} />
        </IconGhostButton>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SmallInput
          value={member.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Name / section title (fallback)"
        />
        <SmallInput
          value={member.role}
          onChange={(e) => onUpdate({ role: e.target.value })}
          placeholder="Role / description"
        />
      </div>

      <Field label="Discord user ID">
        <SmallInput
          value={member.discordId || ''}
          onChange={(e) => onUpdate({ discordId: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="e.g. 123456789012345678"
          inputMode="numeric"
        />
      </Field>

      {preview.status === 'loading' && (
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 size={12} className="animate-spin" /> Looking up Discord profile...
        </p>
      )}
      {preview.status === 'found' && (
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
          <CheckCircle2 size={12} /> Found @{preview.user.username} — this profile will be shown on the site.
        </p>
      )}
      {preview.status === 'error' && (
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400">
          <AlertTriangle size={12} /> {preview.message} The name/role above will be used instead.
        </p>
      )}

      {!member.discordId && (
        <SmallInput
          value={member.discordUrl || ''}
          onChange={(e) => onUpdate({ discordUrl: e.target.value })}
          placeholder="Optional: custom profile link (used if no Discord ID)"
        />
      )}
    </Row>
  )
}

export default function CreditsSection({
  team,
  uploadingIdx,
  uploadPct,
  onAdd,
  onUpdate,
  onRemove,
  onUploadClick,
  registerAvatarInput,
  onAvatarSelected,
}: {
  team: TeamMember[]
  uploadingIdx: string | null
  uploadPct: number
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<TeamMember>) => void
  onRemove: (id: string) => void
  onUploadClick: (id: string) => void
  registerAvatarInput: (id: string, el: HTMLInputElement | null) => void
  onAvatarSelected: (id: string, files: FileList | null) => void
}) {
  return (
    <SectionCard
      icon={Users}
      title="Credits / Team"
      description="Add a Discord user ID to pull a live username, display name and avatar. Without one, the name and fallback avatar below are used."
      onAdd={onAdd}
    >
      <div className="flex flex-col gap-3">
        {team.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            uploadingKey={uploadingIdx}
            uploadPct={uploadPct}
            onUpdate={(patch) => onUpdate(member.id, patch)}
            onRemove={() => onRemove(member.id)}
            onUploadClick={() => onUploadClick(member.id)}
            registerAvatarInput={(el) => registerAvatarInput(member.id, el)}
            onAvatarSelected={(files) => onAvatarSelected(member.id, files)}
          />
        ))}
        {team.length === 0 && <EmptyState text="No team members yet — add one." />}
      </div>
      <a
        href="https://support.discord.com/hc/en-us/articles/206346498"
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex w-fit items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-primary"
      >
        How to find a Discord user ID <ExternalLink size={11} />
      </a>
    </SectionCard>
  )
}
