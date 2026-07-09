'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Layers, Cpu, Shuffle, Home, LucideIcon } from 'lucide-react'
import type { PatternMeta, PatternCategory } from '@/lib/types'
import { CATEGORY_META } from '@/lib/types'

interface SidebarProps {
  patterns: PatternMeta[]
}

const CATEGORY_ICONS: Record<PatternCategory, LucideIcon> = {
  creacional: Cpu,
  estructural: Layers,
  comportamiento: Shuffle,
}

const CATEGORY_ORDER: PatternCategory[] = ['creacional', 'estructural', 'comportamiento']

export function Sidebar({ patterns }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState<Record<PatternCategory, boolean>>({
    creacional: true,
    estructural: true,
    comportamiento: true,
  })

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = patterns.filter(p => p.category === cat)
    return acc
  }, {} as Record<PatternCategory, PatternMeta[]>)

  function toggle(cat: PatternCategory) {
    setOpen(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <aside
      className="sidebar"
      style={{
        width: 256,
        minHeight: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--color-accent)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BookOpen size={16} color="#0a0a0a" />
          </div>
          <div>
            <div style={{ color: 'var(--color-ink)', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>
              PatternCraft
            </div>
            <div style={{ color: 'var(--color-ink-3)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              Design Patterns
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {/* Home link */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 20px',
            color: pathname === '/' ? 'var(--color-ink)' : 'var(--color-ink-3)',
            background: pathname === '/' ? 'var(--color-surface-2)' : 'transparent',
            fontSize: 13,
            fontWeight: pathname === '/' ? 500 : 400,
            transition: 'all 0.15s',
          }}>
            <Home size={13} />
            Inicio
          </div>
        </Link>

        <div style={{ height: 8 }} />

        {/* Categories */}
        {CATEGORY_ORDER.map(cat => {
          const meta = CATEGORY_META[cat]
          const Icon = CATEGORY_ICONS[cat]
          const isOpen = open[cat]
          const items = grouped[cat]

          return (
            <div key={cat}>
              <button
                onClick={() => toggle(cat)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '6px 20px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-ink-2)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={11} style={{ color: meta.color }} />
                  {meta.label}
                </span>
                {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>

              {isOpen && (
                <div style={{ marginBottom: 8 }}>
                  {items.map(pattern => {
                    const isActive = pathname === `/patterns/${pattern.slug}`
                    return (
                      <Link key={pattern.slug} href={`/patterns/${pattern.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '6px 20px 6px 36px',
                          color: isActive ? 'var(--color-ink)' : 'var(--color-ink-3)',
                          background: isActive ? 'var(--color-surface-2)' : 'transparent',
                          fontSize: 13,
                          fontWeight: isActive ? 500 : 400,
                          borderLeft: isActive ? `2px solid ${meta.color}` : '2px solid transparent',
                          marginLeft: 0,
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>{pattern.title}</span>
                          <span style={{
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            color: isActive ? meta.color : 'var(--color-ink-3)',
                            background: isActive ? `${meta.color}18` : 'transparent',
                            padding: '1px 5px',
                            borderRadius: 3,
                          }}>
                            {pattern.difficulty === 'principiante' ? 'P' : pattern.difficulty === 'intermedio' ? 'M' : 'A'}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--color-border)',
        fontSize: 11,
        color: 'var(--color-ink-3)',
        fontFamily: 'var(--font-mono)',
      }}>
        {patterns.length} patrones · 4 lenguajes
      </div>
    </aside>
  )
}
