import { NextRequest, NextResponse } from 'next/server'
import { fetchPage } from '@/lib/page-fetcher'
import { parsePage } from '@/lib/html-parser'
import { analyzeSEO } from '@/lib/seo-analyzer'
import { getGeminiRecommendations } from '@/lib/gemini-advisor'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url, keyword } = body

  if (!url || !keyword) {
    return NextResponse.json({ error: 'URL and keyword are required.' }, { status: 400 })
  }

  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  try {
    new URL(normalizedUrl)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 })
  }

  try {
    const html = await fetchPage(normalizedUrl)
    const pageData = parsePage(html, normalizedUrl)
    const report = analyzeSEO(pageData, keyword.trim())
    const aiAssessment = await getGeminiRecommendations(report)
    return NextResponse.json({ report, aiAssessment })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to analyze page.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
