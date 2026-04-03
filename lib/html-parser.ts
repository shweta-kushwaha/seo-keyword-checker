import * as cheerio from 'cheerio'
import { PageData } from '@/types/seo'

export function parsePage(html: string, pageUrl: string): PageData {
  const $ = cheerio.load(html)
  const base = new URL(pageUrl)

  // Remove non-content elements before extracting body text
  $('script, style, noscript, nav, header, footer').remove()

  const ogTags: Record<string, string> = {}
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr('property')
    const content = $(el).attr('content')
    if (property && content) ogTags[property] = content
  })

  const internalLinks: string[] = []
  const externalLinks: string[] = []
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? ''
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    try {
      const link = new URL(href, base)
      if (link.hostname === base.hostname) internalLinks.push(href)
      else externalLinks.push(href)
    } catch {
      // ignore malformed hrefs
    }
  })

  const imgAlts = $('img[alt]')
    .map((_, el) => $(el).attr('alt') ?? '')
    .get()
    .filter((alt) => alt.trim().length > 0)

  return {
    url: pageUrl,
    title: $('title').first().text().trim(),
    metaDescription: $('meta[name="description"]').attr('content') ?? '',
    h1Tags: $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean),
    h2Tags: $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean),
    h3Tags: $('h3').map((_, el) => $(el).text().trim()).get().filter(Boolean),
    bodyText: $('body').text().replace(/\s+/g, ' ').trim(),
    imgAlts,
    internalLinks,
    externalLinks,
    hasSchema: $('script[type="application/ld+json"]').length > 0,
    metaRobots: $('meta[name="robots"]').attr('content') ?? '',
    canonicalUrl: $('link[rel="canonical"]').attr('href') ?? '',
    ogTags,
  }
}
