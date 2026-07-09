import { getAllPatterns } from '@/lib/patterns'
import { CATEGORY_META } from '@/lib/types'
import { MainLayout } from '@/components/main-layout'
import { PatternCard } from '@/components/pattern-card'
import type { PatternCategory } from '@/lib/types'

const CATEGORY_ORDER_LIST: PatternCategory[] = ['creacional', 'estructural', 'comportamiento']

export default async function HomePage() {
  const patterns = await getAllPatterns()

  const grouped = CATEGORY_ORDER_LIST.reduce((acc, cat) => {
    acc[cat] = patterns.filter(p => p.category === cat)
    return acc
  }, {} as Record<PatternCategory, typeof patterns>)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-10 md:py-12">
        {/* Hero */}
        <div className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md px-3 py-1.5 mb-4 md:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block" />
            <span className="text-[10px] md:text-xs font-mono text-[var(--color-ink-3)] tracking-widest uppercase">
              Gang of Four · {patterns.length} patrones
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-ink)] tracking-tight leading-tight mb-3 md:mb-4">
            Design Patterns
            <span className="text-[var(--color-accent)]">.</span>
          </h1>

          <p className="text-sm md:text-lg text-[var(--color-ink-3)] leading-relaxed max-w-prose mb-6 md:mb-8">
            Referencia interactiva de los patrones de diseño clásicos de software,
            con ejemplos prácticos en TypeScript, Python, Go y Java.
          </p>

          {/* Stats row */}
          <div className="flex gap-3 md:gap-6 flex-wrap">
            {CATEGORY_ORDER_LIST.map(cat => {
              const meta = CATEGORY_META[cat]
              const count = grouped[cat].length
              return (
                <a
                  key={cat}
                  href={`#${cat}`}
                  className="no-underline flex items-center gap-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 md:px-5 md:py-3 transition-all hover:border-[var(--color-ink-2)]"
                >
                  <span className="text-lg md:text-2xl font-bold tracking-tight font-mono flex-shrink-0" style={{ color: meta.color }}>
                    {count}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-semibold text-[var(--color-ink)]">
                      {meta.label}
                    </div>
                    <div className="text-[10px] md:text-xs text-[var(--color-ink-3)]">
                      patrones
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Pattern groups */}
        {CATEGORY_ORDER_LIST.map(cat => {
          const meta = CATEGORY_META[cat]
          const items = grouped[cat]
          if (!items.length) return null

          return (
            <section key={cat} id={cat} className="mb-12 md:mb-16">
              {/* Section header */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 mb-5 md:mb-6 pb-3 md:pb-4 border-b border-[var(--color-border)]">
                <div
                  className="w-1 h-4 md:h-5 rounded-sm flex-shrink-0"
                  style={{ background: meta.color }}
                />
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2.5">
                  <h2 className="m-0 text-xl md:text-2xl font-bold text-[var(--color-ink)] tracking-tight">
                    {meta.label}
                  </h2>
                  <span className="text-xs md:text-sm font-mono text-[var(--color-ink-3)]">
                    {items.length} patrones
                  </span>
                </div>
                <p className="m-0 text-xs md:text-sm text-[var(--color-ink-3)] leading-relaxed md:ml-auto md:text-right">
                  {meta.description}
                </p>
              </div>

              {/* Card grid - responsive columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {items.map(pattern => (
                  <PatternCard key={pattern.slug} pattern={pattern} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Footer */}
        <div className="mt-16 md:mt-20 pt-6 md:pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 flex-wrap">
          <div className="text-xs md:text-sm text-[var(--color-ink-3)] font-mono">
            PatternCraft · Basado en{' '}
            <em>Design Patterns</em> — Gang of Four
          </div>
          <div className="text-xs md:text-sm text-[var(--color-ink-3)] font-mono">
            4 lenguajes · {patterns.length} patrones · MDX
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
