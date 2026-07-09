import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPatternBySlug, getAllPatternSlugs, getAllPatterns } from '@/lib/patterns'
import { CATEGORY_META, DIFFICULTY_LABEL } from '@/lib/types'
import { MainLayout } from '@/components/main-layout'
import { PatternContent } from '@/components/pattern-content'
import { PatternNav } from '@/components/pattern-nav'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPatternSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pattern = getPatternBySlug(slug)
  if (!pattern) return {}
  return {
    title: pattern.title,
    description: pattern.description,
  }
}

export default async function PatternPage({ params }: Props) {
  const { slug } = await params
  const pattern = getPatternBySlug(slug)
  if (!pattern) notFound()

  const allPatterns = await getAllPatterns()
  const catMeta = CATEGORY_META[pattern.category]

  // Find adjacent patterns in same category
  const sameCategory = allPatterns.filter(p => p.category === pattern.category)
  const idx = sameCategory.findIndex(p => p.slug === slug)
  const prev = idx > 0 ? sameCategory[idx - 1] : null
  const next = idx < sameCategory.length - 1 ? sameCategory[idx + 1] : null

  return (
    <MainLayout>
      <article className="max-w-3xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10 pb-16 md:pb-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 md:gap-2 mb-6 md:mb-8 text-xs md:text-sm font-mono text-[var(--color-ink-3)] overflow-x-auto pb-1">
          <a href="/" className="text-[var(--color-ink-3)] no-underline hover:text-[var(--color-ink)] transition-colors whitespace-nowrap">
            Inicio
          </a>
          <span className="text-[var(--color-border)]">/</span>
          <a
            href={`/#${pattern.category}`}
            className="no-underline hover:underline whitespace-nowrap"
            style={{ color: catMeta.color }}
          >
            {catMeta.label}
          </a>
          <span className="text-[var(--color-border)]">/</span>
          <span className="text-[var(--color-ink-2)] truncate">{pattern.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
            {/* Category badge */}
            <span
              className="text-[10px] md:text-xs font-mono font-semibold rounded px-2.5 py-1 uppercase tracking-widest"
              style={{
                color: catMeta.color,
                background: `${catMeta.color}18`,
                border: `1px solid ${catMeta.color}35`,
              }}
            >
              {catMeta.label}
            </span>

            {/* Difficulty badge */}
            <span className="text-[10px] md:text-xs font-mono text-[var(--color-ink-3)] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-2.5 py-1">
              {DIFFICULTY_LABEL[pattern.difficulty]}
            </span>

            {/* Languages */}
            {pattern.languages.map(lang => (
              <span key={lang} className="text-[10px] md:text-xs font-mono text-[var(--color-ink-3)] bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded px-2.5 py-1">
                {lang}
              </span>
            ))}
          </div>

          <h1 className="m-0 mb-2 md:mb-3 text-2xl md:text-4xl font-bold text-[var(--color-ink)] tracking-tight leading-tight">
            {pattern.title}
            <span style={{ color: catMeta.color }}>.</span>
          </h1>

          <p className="m-0 text-sm md:text-base text-[var(--color-ink-3)] leading-relaxed max-w-prose">
            {pattern.description}
          </p>

          {pattern.also_known_as && pattern.also_known_as.length > 0 && (
            <p className="m-0 mt-2 md:mt-3 text-xs md:text-sm text-[var(--color-ink-3)] font-mono leading-relaxed">
              También conocido como:{' '}
              <span className="text-[var(--color-ink-2)]">
                {pattern.also_known_as.join(', ')}
              </span>
            </p>
          )}
        </header>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[var(--color-border)] to-transparent mb-8 md:mb-10" />

        {/* MDX Content with language switcher */}
        <PatternContent rawContent={pattern.content} />

        {/* Tags */}
        {pattern.tags.length > 0 && (
          <div className="mt-8 md:mt-12 flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="text-xs md:text-sm text-[var(--color-ink-3)] font-mono flex-shrink-0">
              Tags:
            </span>
            {pattern.tags.map(tag => (
              <span key={tag} className="text-[10px] md:text-xs font-mono text-[var(--color-ink-3)] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        <PatternNav prev={prev} next={next} />
      </article>
    </MainLayout>
  )
}
