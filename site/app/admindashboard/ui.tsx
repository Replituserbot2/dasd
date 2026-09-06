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
  accent = false,
}: {
  icon?: ComponentType<{ size?: number; className?: string }>
  title: string
  description?: string
  onAdd?: () => void
  addLabel?: string
  children: ReactNode
  accent?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border bg-card/40 shadow-sm transition-all duration-300 ${
      accent
        ? 'border-primary/30 shadow-[0_0_30px_rgba(239,45,67,0.08)]'
        : 'border-border/50 hover:border-border'
    }`}>
      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              {Icon && (
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon size={13} />
                </span>
              )}
              {title}
            </span>
            {description && <p className="ml-8 text-xs leading-5 text-muted-foreground">{description}</p>}
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary/60 hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(239,45,67,0.2)] active:scale-95"
            >
              <Plus size={12} /> {addLabel}
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] leading-4 text-muted-foreground/70">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm text-foreground outline-none ring-0 transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-border focus:border-primary/60 focus:bg-background focus:shadow-[0_0_0_3px_rgba(239,45,67,0.12)] ${className}`}
    />
  )
}

export function SmallInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-xs text-foreground outline-none ring-0 transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-border focus:border-primary/60 focus:bg-background focus:shadow-[0_0_0_2px_rgba(239,45,67,0.12)] ${className}`}
    />
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      {...rest}
      className={`w-full resize-none rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm text-foreground outline-none ring-0 transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-border focus:border-primary/60 focus:bg-background focus:shadow-[0_0_0_3px_rgba(239,45,67,0.12)] ${className}`}
    />
  )
}

export function SmallTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      {...rest}
      className={`w-full resize-none rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-xs text-foreground outline-none ring-0 transition-all duration-200 placeholder:text-muted-foreground/50 hover:border-border focus:border-primary/60 focus:bg-background focus:shadow-[0_0_0_2px_rgba(239,45,67,0.12)] ${className}`}
    />
  )
}

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2.5 rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-200 hover:border-border/70 hover:bg-background/70 hover:shadow-sm ${className}`}>
      {children}
    </div>
  )
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
      ? 'border-border/40 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300'
      : variant === 'active'
        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_8px_rgba(239,45,67,0.2)]'
        : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/8 hover:text-primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 disabled:cursor-default disabled:opacity-40 active:scale-95 ${styles}`}
    >
      {children}
    </button>
  )
}

export function EmptyState({ text, icon }: { text: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/50 bg-background/30 p-8 text-center">
      {icon && <div className="text-muted-foreground/40">{icon}</div>}
      <p className="font-mono text-xs text-muted-foreground">{text}</p>
    </div>
  )
}

export function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/40 p-4 transition-all duration-200 hover:border-border/70">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ${
          enabled ? 'bg-primary shadow-[0_0_12px_rgba(239,45,67,0.4)]' : 'bg-muted'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  unit = '',
  hint,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  hint?: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-primary">{value}{unit}</span>
      </div>
      <div className="relative flex items-center">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-75"
            style={{ width: `${pct}%`, boxShadow: '0 0 8px rgba(239,45,67,0.5)' }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      {hint && <p className="text-[11px] leading-4 text-muted-foreground/70">{hint}</p>}
    </div>
  )
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(239,45,67,0.6)' }}
      />
    </div>
  )
}
