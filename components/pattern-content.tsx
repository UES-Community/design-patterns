'use client'

import { useState, useMemo } from 'react'
import { CodeBlock } from './code-block'

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  java: 'Java',
  javascript: 'JavaScript',
  rust: 'Rust',
  cpp: 'C++',
  csharp: 'C#',
  ruby: 'Ruby',
  php: 'PHP',
}

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: '#3178C6',
  python:     '#3776AB',
  go:         '#00ADD8',
  java:       '#ED8B00',
  javascript: '#F7DF1E',
  rust:       '#CE422B',
  cpp:        '#00599C',
  csharp:     '#512BD4',
  ruby:       '#CC342D',
  php:        '#777BB4',
}

interface CodeGroup {
  language: string
  code: string
  comment?: string
}

interface PatternContentProps {
  rawContent: string
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

export function PatternContent({ rawContent }: PatternContentProps) {
  const codeGroups = useMemo(() => parseCodeGroups(rawContent), [rawContent])

  // Deduplicate languages (keep first occurrence per language)
  const uniqueLangs = useMemo(() => {
    const seen = new Set<string>()
    return codeGroups.filter(g => {
      if (seen.has(g.language)) return false
      seen.add(g.language)
      return true
    }).map(g => g.language)
  }, [codeGroups])

  const [activeLanguage, setActiveLanguage] = useState<string>(uniqueLangs[0] ?? 'typescript')

  // Split content into sections (text blocks between code blocks)
  const sections = useMemo(() => {
    const parts = rawContent.split(/```[\s\S]*?```/)
    const codes = codeGroups
    const result: Array<{ type: 'text'; text: string } | { type: 'code'; group: CodeGroup }> = []

    parts.forEach((text, i) => {
      if (text.trim()) {
        result.push({ type: 'text', text })
      }
      if (codes[i]) {
        result.push({ type: 'code', group: codes[i] })
      }
    })
    return result
  }, [rawContent, codeGroups])

  // Find all code blocks for the active language
  const activeCodes = useMemo(
    () => codeGroups.filter(g => g.language === activeLanguage),
    [codeGroups, activeLanguage],
  )

  // Render text sections only (text before first code block is the "description")
  const textSections = useMemo(
    () => sections.filter((s): s is { type: 'text'; text: string } => s.type === 'text'),
    [sections],
  )

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
          {uniqueLangs.map(lang => {
            const isActive = lang === activeLanguage
            const color = LANGUAGE_COLORS[lang] ?? 'var(--color-accent)'
            return (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
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
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: color,
                  opacity: isActive ? 1 : 0.4,
                  flexShrink: 0,
                }} />
                {LANGUAGE_LABELS[lang] ?? lang}
              </button>
            )
          })}
        </div>

        {/* Code */}
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
      </div>
    </div>
  )
}
