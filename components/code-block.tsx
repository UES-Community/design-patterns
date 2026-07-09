'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
}

const LANG_NORMALISE: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  rb: 'ruby',
  cs: 'csharp',
  sh: 'bash',
  shell: 'bash',
  md: 'markdown',
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const lang = LANG_NORMALISE[language] ?? language

  useEffect(() => {
    let cancelled = false

    async function highlight() {
      try {
        const { codeToHtml } = await import('shiki')
        const result = await codeToHtml(code.trim(), {
          lang,
          theme: 'github-dark-default',
        })
        if (!cancelled) setHtml(result)
      } catch {
        if (!cancelled) setHtml('')
      }
    }

    highlight()
    return () => { cancelled = true }
  }, [code, lang])

  function handleCopy() {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--color-surface)',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* macOS-style traffic lights */}
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div
                key={c}
                style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }}
              />
            ))}
          </div>
          {title && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--color-ink-3)',
            }}>
              {title}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copiar código"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            color: copied ? 'var(--color-accent-2)' : 'var(--color-ink-3)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: 4,
            transition: 'color 0.15s',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Code content */}
      <div style={{ overflow: 'auto', maxHeight: 520 }}>
        {html ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ fontSize: '0.825rem', lineHeight: 1.7 }}
          />
        ) : (
          <pre style={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            lineHeight: 1.7,
            color: 'var(--color-ink-2)',
            overflowX: 'auto',
          }}>
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
