import { PageData, SEOCheck, SEOReport } from '@/types/seo'

function contains(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase())
}

function keywordDensity(bodyText: string, keyword: string): number {
  const words = bodyText.match(/\b\w+\b/g) ?? []
  const totalWords = words.length
  if (totalWords === 0) return 0

  const kw = keyword.toLowerCase().trim()
  const kwParts = kw.split(' ')
  const count =
    kwParts.length === 1
      ? words.filter((w) => w.toLowerCase() === kw).length
      : (bodyText.toLowerCase().match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length

  return parseFloat(((count / totalWords) * 100).toFixed(2))
}

export function analyzeSEO(page: PageData, keyword: string): SEOReport {
  const kw = keyword.toLowerCase().trim()
  const words = page.bodyText.match(/\b\w+\b/g) ?? []
  const totalWords = words.length
  const density = keywordDensity(page.bodyText, kw)
  const first100 = words.slice(0, 100).join(' ')

  const urlPath = (() => {
    try { return new URL(page.url).pathname.toLowerCase() }
    catch { return '' }
  })()
  const kwInUrl = urlPath.includes(kw) || urlPath.includes(kw.replace(/\s+/g, '-'))

  const checks: SEOCheck[] = [
    {
      key: 'keyword_in_title',
      label: 'Keyword in <title>',
      passed: contains(page.title, kw),
      weight: 15,
    },
    {
      key: 'keyword_in_meta_desc',
      label: 'Keyword in meta description',
      passed: contains(page.metaDescription, kw),
      weight: 10,
    },
    {
      key: 'keyword_in_h1',
      label: 'Keyword in <h1>',
      passed: page.h1Tags.some((h) => contains(h, kw)),
      weight: 15,
    },
    {
      key: 'keyword_in_h2_h3',
      label: 'Keyword in <h2> / <h3>',
      passed: [...page.h2Tags, ...page.h3Tags].some((h) => contains(h, kw)),
      weight: 8,
    },
    {
      key: 'keyword_in_first_100',
      label: 'Keyword in first 100 words',
      passed: contains(first100, kw),
      weight: 10,
    },
    {
      key: 'keyword_density_ok',
      label: 'Keyword density (1–3%)',
      passed: density >= 1 && density <= 3,
      weight: 10,
      detail: `${density}%`,
    },
    {
      key: 'keyword_in_url',
      label: 'Keyword in URL',
      passed: kwInUrl,
      weight: 5,
    },
    {
      key: 'keyword_in_img_alt',
      label: 'Keyword in image alt text',
      passed: page.imgAlts.some((alt) => contains(alt, kw)),
      weight: 5,
    },
    {
      key: 'word_count_ok',
      label: 'Word count ≥ 300',
      passed: totalWords >= 300,
      weight: 8,
      detail: `${totalWords.toLocaleString()} words`,
    },
    {
      key: 'schema_present',
      label: 'Schema markup present',
      passed: page.hasSchema,
      weight: 5,
    },
    {
      key: 'not_noindex',
      label: 'Page is indexable (no noindex)',
      passed: !page.metaRobots.toLowerCase().includes('noindex'),
      weight: 4,
    },
    {
      key: 'canonical_present',
      label: 'Canonical tag present',
      passed: !!page.canonicalUrl,
      weight: 3,
    },
    {
      key: 'og_tags_present',
      label: 'Open Graph tags present',
      passed: Object.keys(page.ogTags).length >= 2,
      weight: 2,
    },
  ]

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0)
  const bodyExcerpt = words.slice(0, 500).join(' ')

  return {
    url: page.url,
    keyword,
    pageTitle: page.title,
    metaDescription: page.metaDescription,
    wordCount: totalWords,
    internalLinkCount: page.internalLinks.length,
    externalLinkCount: page.externalLinks.length,
    keywordDensity: density,
    checks,
    score,
    bodyExcerpt,
  }
}
