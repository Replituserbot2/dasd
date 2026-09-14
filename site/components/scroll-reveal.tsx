'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  /** Tailwind class applied when visible. Defaults to 'animate-pop-in'. */
  animation?: string
  /** Extra delay class, e.g. 'delay-150'. */
  delay?: string
  /** Class always applied to the wrapper. */
  className?: string
  /** Root margin for IntersectionObserver (how early to trigger). Default '-60px'. */
  rootMargin?: string
  /** Threshold for IntersectionObserver. Default 0.1. */
  threshold?: number
}

export default function ScrollReveal({
  children,
  animation = 'animate-pop-in',
  delay,
  className = '',
  rootMargin = '-60px',
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  const animClasses = visible ? `${animation}${delay ? ' ' + delay : ''}` : 'opacity-0'

  return (
    <div ref={ref} className={`${animClasses} ${className}`.trim()}>
      {children}
    </div>
  )
}
