'use client'

import type { ComponentType, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { Plus } from 'lucide-react'

export function SectionCard({
  icon: Icon,
  title,
  description,
  onAdd,
  addLabel = 'Add',
  children,
}: {
  icon?: ComponentType<{ size?: number; className?: string }>
  title: string
  description?: string
  onAdd?: () => void
  addLabel?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm transition-colors">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            {Icon && <Icon size={14} className="text-primary" />}
            {title}
          </span>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
          >
            <Plus size={13} /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function SmallInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      {...rest}
      className={`resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function SmallTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      {...rest}
      className={`resize-none rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/40 p-3 transition-colors hover:border-border">{children}</div>
}

export function IconGhostButton({
  onClick,
  disabled,
  label,
  children,
  variant = 'default',
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
  children: ReactNode
  variant?: 'default' | 'danger' | 'active'
}) {
  const styles =
    variant === 'danger'
      ? 'border-border/50 text-red-400 hover:bg-red-500/10'
      : variant === 'active'
        ? 'border-primary/60 text-primary'
        : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors disabled:cursor-default disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-border/60 p-4 text-center font-mono text-xs text-muted-foreground">{text}</p>
}
