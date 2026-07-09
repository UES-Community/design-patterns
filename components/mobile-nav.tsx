'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight, BookOpen, Layers, Cpu, Shuffle, Home, LucideIcon } from 'lucide-react'
import type { PatternMeta, PatternCategory } from '@/lib/types'
import { CATEGORY_META } from '@/lib/types'

interface MobileNavProps {
  patterns: PatternMeta[]
}

const CATEGORY_ICONS: Record<PatternCategory, LucideIcon> = {
  creacional: Cpu,
  estructural: Layers,
  comportamiento: Shuffle,
}

const CATEGORY_ORDER: PatternCategory[] = ['creacional', 'estructural', 'comportamiento']

export function MobileNav({ patterns }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<PatternCategory, boolean>>({
    creacional: true,
    estructural: false,
    comportamiento: false,
  })

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = patterns.filter(p => p.category === cat)
    return acc
  }, {} as Record<PatternCategory, PatternMeta[]>)

  function toggleCategory(cat: PatternCategory) {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  function handleNavClick() {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="w-7 h-7 bg-[var(--color-accent)] rounded-md flex items-center justify-center flex-shrink-0">
            <BookOpen size={14} color="#0a0a0a" />
          </div>
          <div>
            <div className="text-[var(--color-ink)] font-bold text-xs tracking-tight">PatternCraft</div>
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 -mr-1 text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-35 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 md:hidden pt-16 flex flex-col overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 px-0 py-3">
          {/* Home link */}
          <Link href="/" onClick={handleNavClick} className="no-underline block">
            <div
              className={`flex items-center gap-2 px-5 py-2 text-xs font-${pathname === '/' ? 'semibold' : 'normal'} transition-all ${
                pathname === '/'
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-3)]'
              }`}
            >
              <Home size={13} />
              Inicio
            </div>
          </Link>

          <div className="h-2" />

          {/* Categories */}
          {CATEGORY_ORDER.map(cat => {
            const meta = CATEGORY_META[cat]
            const Icon = CATEGORY_ICONS[cat]
            const isOpenCat = openCategories[cat]
            const items = grouped[cat]

            return (
              <div key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-1.5 bg-none border-0 cursor-pointer text-[var(--color-ink-2)] text-[10px] font-bold uppercase tracking-widest font-mono hover:text-[var(--color-ink)] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon size={10} style={{ color: meta.color }} />
                    {meta.label}
                  </span>
                  {isOpenCat ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                </button>

                {isOpenCat && (
                  <div className="mb-2">
                    {items.map(pattern => {
                      const isActive = pathname === `/patterns/${pattern.slug}` || pathname.startsWith(`/patterns/${pattern.slug}/`)
                      return (
                        <Link
                          key={pattern.slug}
                          href={`/patterns/${pattern.slug}`}
                          onClick={handleNavClick}
                          className="no-underline block"
                        >
                          <div
                            className={`flex items-center justify-between px-5 py-1.5 text-xs transition-all border-l-2 ${
                              isActive
                                ? `bg-[var(--color-surface-2)] text-[var(--color-ink)] font-medium border-l-[${meta.color}]`
                                : `text-[var(--color-ink-3)] border-l-transparent`
                            }`}
                            style={isActive ? { borderLeftColor: meta.color } : {}}
                          >
                            <span className="truncate">{pattern.title}</span>
                            <span
                              className="text-[9px] font-mono ml-2 px-1.5 py-0.5 rounded flex-shrink-0"
                              style={{
                                color: isActive ? meta.color : 'var(--color-ink-3)',
                                background: isActive ? `${meta.color}18` : 'transparent',
                              }}
                            >
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
        <div className="px-5 py-3 border-t border-[var(--color-border)] text-[10px] text-[var(--color-ink-3)] font-mono">
          {patterns.length} patrones · 4 lenguajes
        </div>
      </div>
    </>
  )
}
