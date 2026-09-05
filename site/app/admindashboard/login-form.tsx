'use client'

import { useState, type FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        window.location.reload()
        return
      }
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed.')
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card/60 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_var(--neon)]">
            <LockKeyhole size={16} />
          </span>
          <h1 className="font-mono text-sm font-bold uppercase tracking-widest">Admin Access</h1>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="mt-4 flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mt-3 font-mono text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_16px_var(--neon)] transition-all hover:shadow-[0_0_24px_var(--neon)] disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </main>
  )
}
