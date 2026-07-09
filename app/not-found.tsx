import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-canvas)',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 80,
        fontWeight: 700,
        color: 'var(--color-border-2)',
        lineHeight: 1,
        marginBottom: 16,
      }}>
        404
      </div>
      <h1 style={{
        fontSize: 24,
        fontWeight: 600,
        color: 'var(--color-ink)',
        letterSpacing: '-0.03em',
        margin: '0 0 10px',
      }}>
        Patrón no encontrado
      </h1>
      <p style={{
        fontSize: 14,
        color: 'var(--color-ink-3)',
        margin: '0 0 28px',
        maxWidth: '40ch',
        lineHeight: 1.6,
      }}>
        El patrón de diseño que buscas no existe en esta referencia.
      </p>
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--color-accent)',
        color: '#0a0a0a',
        fontWeight: 600,
        fontSize: 14,
        padding: '10px 20px',
        borderRadius: 8,
        textDecoration: 'none',
        transition: 'opacity 0.15s',
      }}>
        Volver al inicio
      </Link>
    </div>
  )
}
