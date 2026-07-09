export type PatternCategory = 'creacional' | 'estructural' | 'comportamiento'

export interface PatternMeta {
  slug: string
  title: string
  category: PatternCategory
  difficulty: 'principiante' | 'intermedio' | 'avanzado'
  description: string
  also_known_as?: string[]
  tags: string[]
  languages: string[]
}

export interface Pattern extends PatternMeta {
  content: string
}

export interface CodeExample {
  language: string
  label: string
  code: string
}

export const CATEGORY_META: Record<PatternCategory, {
  label: string
  description: string
  color: string
  accent: string
}> = {
  creacional: {
    label: 'Creacionales',
    description: 'Patrones que resuelven cómo crear objetos, desacoplando la lógica de creación de la de uso.',
    color: 'var(--color-accent-2)',
    accent: 'accent-2',
  },
  estructural: {
    label: 'Estructurales',
    description: 'Patrones que describen cómo componer clases u objetos para formar estructuras más grandes.',
    color: 'var(--color-accent-4)',
    accent: 'accent-4',
  },
  comportamiento: {
    label: 'Comportamiento',
    description: 'Patrones que definen cómo interactúan y se comunican los objetos entre sí.',
    color: 'var(--color-accent-3)',
    accent: 'accent-3',
  },
}

export const DIFFICULTY_LABEL: Record<PatternMeta['difficulty'], string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

export const LANGUAGE_LABELS: Record<string, string> = {
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

export const LANGUAGE_COLORS: Record<string, string> = {
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

