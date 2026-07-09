import { getAllPatterns } from '@/lib/patterns'
import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const patterns = await getAllPatterns()

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-canvas)',
    }}>
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar patterns={patterns} />
      </div>

      {/* Mobile nav drawer */}
      <MobileNav patterns={patterns} />

      {/* Main content */}
      <main className="flex-1 w-full overflow-x-hidden md:min-w-0 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
