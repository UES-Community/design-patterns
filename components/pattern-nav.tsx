'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { PatternMeta } from '@/lib/types'
import { CATEGORY_META } from '@/lib/types'

interface PatternNavProps {
  prev: PatternMeta | null
  next: PatternMeta | null
}

export function PatternNav({ prev, next }: PatternNavProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Navegación entre patrones"
      style={{
        marginTop: 56,
        paddingTop: 24,
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 12,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {prev ? (
        <Link href={`/patterns/${prev.slug}`} style={{ textDecoration: 'none', flex: '0 1 45%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '14px 18px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'var(--color-border-2)'
              el.style.background = 'var(--color-surface-2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'var(--color-border)'
              el.style.background = 'var(--color-surface)'
            }}
          >
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-3)',
            }}>
              <ArrowLeft size={11} />
              Anterior
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-ink)',
              letterSpacing: '-0.02em',
            }}>
              {prev.title}
            </span>
            <span style={{
              fontSize: 11,
              color: CATEGORY_META[prev.category].color,
              fontFamily: 'var(--font-mono)',
            }}>
              {CATEGORY_META[prev.category].label}
            </span>
          </div>
        </Link>
      ) : (
        <div style={{ flex: '0 1 45%' }} />
      )}

      {next ? (
        <Link href={`/patterns/${next.slug}`} style={{ textDecoration: 'none', flex: '0 1 45%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
              padding: '14px 18px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'var(--color-border-2)'
              el.style.background = 'var(--color-surface-2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'var(--color-border)'
              el.style.background = 'var(--color-surface)'
            }}
          >
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-3)',
            }}>
              Siguiente
              <ArrowRight size={11} />
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-ink)',
              letterSpacing: '-0.02em',
            }}>
              {next.title}
            </span>
            <span style={{
              fontSize: 11,
              color: CATEGORY_META[next.category].color,
              fontFamily: 'var(--font-mono)',
            }}>
              {CATEGORY_META[next.category].label}
            </span>
          </div>
        </Link>
      ) : (
        <div style={{ flex: '0 1 45%' }} />
      )}
    </nav>
  )
}
