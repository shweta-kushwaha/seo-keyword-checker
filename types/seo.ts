export interface PageData {
  url: string
  title: string
  metaDescription: string
  h1Tags: string[]
  h2Tags: string[]
  h3Tags: string[]
  bodyText: string
  imgAlts: string[]
  internalLinks: string[]
  externalLinks: string[]
  hasSchema: boolean
  metaRobots: string
  canonicalUrl: string
  ogTags: Record<string, string>
}

export interface SEOCheck {
  key: string
  label: string
  passed: boolean
  weight: number
  detail?: string
}

export interface SEOReport {
  url: string
  keyword: string
  pageTitle: string
  metaDescription: string
  wordCount: number
  internalLinkCount: number
  externalLinkCount: number
  keywordDensity: number
  checks: SEOCheck[]
  score: number
  bodyExcerpt: string
}

export interface AnalyzeResponse {
  report: SEOReport
  aiAssessment: string
  error?: string
}
