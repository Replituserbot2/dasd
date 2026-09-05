// Small, dependency-free helpers for turning an admin-picked accent hex
// color into the CSS custom properties the theme relies on.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  if (Number.isNaN(num) || full.length !== 6) return [239, 45, 67] // fallback to default brand red
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

export function accentToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Picks black or white foreground text for readability on top of the
// accent color, based on perceived luminance.
export function accentForeground(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff'
}
