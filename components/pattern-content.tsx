'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { CodeBlock } from './code-block'
import { LANGUAGE_LABELS, LANGUAGE_COLORS } from '@/lib/types'

interface CodeGroup {
  language: string
  code: string
  comment?: string
}

interface PatternContentProps {
  slug: string
  rawContent: string
  languages: string[]
  activeLanguage?: string
  langContent?: string
}

function parseCodeGroups(content: string): CodeGroup[] {
  const groups: CodeGroup[] = []
  const regex = /```(\w+)\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const [, lang, code] = match
    // Extract the first comment line as title
    const firstLine = code.trim().split('\n')[0]
    const comment = firstLine.startsWith('//') || firstLine.startsWith('#')
      ? firstLine.replace(/^(\/\/|#)\s*/, '')
      : undefined
    groups.push({ language: lang, code, comment })
  }
  return groups
}

function renderMarkdownToHtml(content: string): string {
  let html = content
    // Remove code blocks (handled separately)
    .replace(/```[\s\S]*?```/g, '<CODE_BLOCK_PLACEHOLDER/>')
    // H2
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // H4
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Tables — simple
    .replace(/^\|(.+)\|$/gm, '<tr><td>$1</td></tr>')
    // Paragraphs (lines separated by blank lines)
    .replace(/\n\n([^<])/g, '\n\n<p>$1')
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')

  return html
}

export function PatternContent({ slug, rawContent, languages, activeLanguage, langContent }: PatternContentProps) {
  const codeGroups = useMemo(() => {
    if (langContent) {
      return parseCodeGroups(langContent)
    }
    return []
  }, [langContent])

  const uniqueLangs = languages

  const textSections = useMemo(() => {
    const parts = rawContent.split(/```[\s\S]*?```/)
    return parts.filter(p => p.trim()).map(text => ({ type: 'text', text }))
  }, [rawContent])

  const activeCodes = codeGroups

  if (uniqueLangs.length === 0) {
    // No code — just render the prose
    return (
      <div className="prose">
        {textSections.map((s, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(s.text) }} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Prose content */}
      <div className="prose" style={{ marginBottom: '2rem' }}>
        {textSections.map((s, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(s.text) }} />
        ))}
      </div>

      {/* Language selector + code viewer */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          overflowX: 'auto',
        }}>
          {/* Teoría / Resumen general Tab */}
          <Link
            href={`/patterns/${slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: !activeLanguage ? `2px solid var(--color-accent)` : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: !activeLanguage ? 600 : 400,
              fontFamily: 'var(--font-mono)',
              color: !activeLanguage ? 'var(--color-ink)' : 'var(--color-ink-3)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              textDecoration: 'none',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--color-accent)',
              opacity: !activeLanguage ? 1 : 0.4,
              flexShrink: 0,
            }} />
            Teoría
          </Link>

          {/* Languages tabs */}
          {uniqueLangs.map(lang => {
            const isActive = lang === activeLanguage
            const color = LANGUAGE_COLORS[lang] ?? 'var(--color-accent)'
            return (
              <Link
                key={lang}
                href={`/patterns/${slug}/${lang}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-mono)',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-3)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: color,
                  opacity: isActive ? 1 : 0.4,
                  flexShrink: 0,
                }} />
                {LANGUAGE_LABELS[lang] ?? lang}
              </Link>
            )
          })}
        </div>

        {/* Content Area */}
        {activeLanguage ? (
          /* Code blocks for active language */
          <div style={{ padding: '1.5rem' }}>
            {activeCodes.map((group, i) => (
              <div key={i} style={{ marginBottom: i < activeCodes.length - 1 ? '1.5rem' : 0 }}>
                <CodeBlock
                  code={group.code}
                  language={group.language}
                  title={group.comment}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Selection grid for Teoría view */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 600, color: 'var(--color-ink)' }}>
              Código de Implementación
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: 13, color: 'var(--color-ink-3)' }}>
              Selecciona uno de los lenguajes de programación disponibles para ver el código detallado:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 16,
              maxWidth: 600,
              margin: '0 auto',
            }}>
              {uniqueLangs.map(lang => {
                const color = LANGUAGE_COLORS[lang] ?? 'var(--color-accent)'
                const label = LANGUAGE_LABELS[lang] ?? lang
                return (
                  <Link
                    key={lang}
                    href={`/patterns/${slug}/${lang}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: '18px 12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        background: 'var(--color-surface-2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={e => {
                        const div = e.currentTarget as HTMLDivElement
                        div.style.borderColor = color
                        div.style.background = 'var(--color-surface-3)'
                        div.style.transform = 'translateY(-3px)'
                        div.style.boxShadow = `0 6px 20px ${color}15`
                      }}
                      onMouseLeave={e => {
                        const div = e.currentTarget as HTMLDivElement
                        div.style.borderColor = 'var(--color-border)'
                        div.style.background = 'var(--color-surface-2)'
                        div.style.transform = 'translateY(0)'
                        div.style.boxShadow = 'none'
                      }}
                    >
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: color,
                        boxShadow: `0 0 8px ${color}`,
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-ink-2)',
                      }}>
                        {label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

