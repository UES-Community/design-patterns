'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { PatternMeta } from '@/lib/types'
import { CATEGORY_META, DIFFICULTY_LABEL } from '@/lib/types'

interface PatternCardProps {
  pattern: PatternMeta
}

const DIFFICULTY_COLORS: Record<PatternMeta['difficulty'], string> = {
  principiante: 'var(--color-accent-2)',
  intermedio: 'var(--color-accent)',
  avanzado: 'var(--color-accent-3)',
}

export function PatternCard({ pattern }: PatternCardProps) {
  const catMeta = CATEGORY_META[pattern.category]
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/patterns/${pattern.slug}`} className="no-underline block group">
      <div
        className={`relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 md:p-5 transition-all duration-200 cursor-pointer ${
          isHovered ? 'border-[var(--color-border-2)] bg-[var(--color-surface-2)] -translate-y-0.5 shadow-md' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Category accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: catMeta.color }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2.5 md:mb-3">
          <h3 className="m-0 text-sm md:text-base font-semibold text-[var(--color-ink)] tracking-tight leading-snug flex-1 min-w-0">
            {pattern.title}
          </h3>

          <span
            className="px-1.5 md:px-2 py-1 text-[9px] md:text-[10px] font-mono font-semibold rounded whitespace-nowrap flex-shrink-0"
            style={{
              color: DIFFICULTY_COLORS[pattern.difficulty],
              background: `${DIFFICULTY_COLORS[pattern.difficulty]}15`,
              border: `1px solid ${DIFFICULTY_COLORS[pattern.difficulty]}30`,
            }}
          >
            {DIFFICULTY_LABEL[pattern.difficulty]}
          </span>
        </div>

        {/* Description */}
        <p className="m-0 mb-3 md:mb-4 text-xs md:text-sm text-[var(--color-ink-3)] leading-relaxed line-clamp-2">
          {pattern.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-wrap min-w-0">
            {pattern.languages.slice(0, 3).map(lang => (
              <span
                key={lang}
                className="px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-mono text-[var(--color-ink-3)] bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded whitespace-nowrap"
              >
                {lang}
              </span>
            ))}
            {pattern.languages.length > 3 && (
              <span className="px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-mono text-[var(--color-ink-3)]">
                +{pattern.languages.length - 3}
              </span>
            )}
          </div>

          <span
            className="text-[10px] md:text-xs font-mono font-medium flex-shrink-0"
            style={{ color: catMeta.color }}
          >
            {catMeta.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
