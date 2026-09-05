import {
  Gauge,
  Code2,
  LockKeyhole,
  Zap,
  ShieldCheck,
  Star,
  Rocket,
  Trophy,
  Sparkles,
  Users,
  Gamepad2,
  Heart,
  type LucideIcon,
} from 'lucide-react'
import type { FeatureIcon } from './store'

export const FEATURE_ICON_MAP: Record<FeatureIcon, LucideIcon> = {
  gauge: Gauge,
  code: Code2,
  lock: LockKeyhole,
  zap: Zap,
  shield: ShieldCheck,
  star: Star,
  rocket: Rocket,
  trophy: Trophy,
  sparkles: Sparkles,
  users: Users,
  gamepad: Gamepad2,
  heart: Heart,
}

export const FEATURE_ICON_OPTIONS: { key: FeatureIcon; label: string }[] = [
  { key: 'gauge', label: 'Gauge' },
  { key: 'code', label: 'Code' },
  { key: 'lock', label: 'Lock' },
  { key: 'zap', label: 'Zap' },
  { key: 'shield', label: 'Shield' },
  { key: 'star', label: 'Star' },
  { key: 'rocket', label: 'Rocket' },
  { key: 'trophy', label: 'Trophy' },
  { key: 'sparkles', label: 'Sparkles' },
  { key: 'users', label: 'Users' },
  { key: 'gamepad', label: 'Gamepad' },
  { key: 'heart', label: 'Heart' },
]
