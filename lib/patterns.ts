import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PatternMeta, Pattern, PatternCategory } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'patterns')

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true })
  }
}

export function getAllPatternSlugs(): string[] {
  ensureContentDir()
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      .map((f) => f.replace(/\.(mdx|md)$/, ''))
  } catch {
    return []
  }
}

export function getPatternBySlug(slug: string): Pattern | null {
  ensureContentDir()
  const extensions = ['.mdx', '.md']
  let filePath: string | null = null

  for (const ext of extensions) {
    const candidate = path.join(CONTENT_DIR, `${slug}${ext}`)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      break
    }
  }

  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    category: data.category ?? 'creacional',
    difficulty: data.difficulty ?? 'intermedio',
    description: data.description ?? '',
    also_known_as: data.also_known_as ?? [],
    tags: data.tags ?? [],
    languages: data.languages ?? ['typescript'],
    content,
  }
}

export async function getAllPatterns(): Promise<PatternMeta[]> {
  return getAllPatternSlugs()
    .map((slug) => getPatternBySlug(slug))
    .filter((p): p is Pattern => p !== null)
    .map(({ content: _c, ...meta }) => meta)
    .sort((a, b) => a.title.localeCompare(b.title, 'es'))
}

export async function getPatternsByCategory(category: PatternCategory): Promise<PatternMeta[]> {
  const all = await getAllPatterns()
  return all.filter((p) => p.category === category)
}

export function getAllPatternSlugLangs(): Array<{ slug: string; lang: string }> {
  const slugs = getAllPatternSlugs()
  const params: Array<{ slug: string; lang: string }> = []
  for (const slug of slugs) {
    const pattern = getPatternBySlug(slug)
    if (pattern) {
      for (const lang of pattern.languages) {
        params.push({ slug, lang })
      }
    }
  }
  return params
}

