import { GoogleGenerativeAI } from '@google/generative-ai'
import { SEOReport } from '@/types/seo'

export async function getGeminiRecommendations(report: SEOReport): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return 'AI analysis unavailable: GEMINI_API_KEY is not configured.'
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const checkTable = report.checks
    .map((c) => `- ${c.label}: ${c.passed ? 'PASS' : 'FAIL'}${c.detail ? ` [${c.detail}]` : ''}`)
    .join('\n')

  const prompt = `You are an expert SEO analyst. Analyze this web page's keyword optimization.

## Page Data
- URL: ${report.url}
- Target Keyword: "${report.keyword}"
- Title: ${report.pageTitle || '(none)'}
- Meta Description: ${report.metaDescription || '(none)'}
- Word Count: ${report.wordCount}
- Keyword Density: ${report.keywordDensity}%
- Internal Links: ${report.internalLinkCount} | External Links: ${report.externalLinkCount}

## SEO Check Results
${checkTable}

## Overall Score: ${report.score}/100

## Content Excerpt (first ~500 words)
${report.bodyExcerpt || '(no body text extracted)'}

---
Provide exactly the following 3 sections:

**1. Overall Assessment**
Rate the page as "Good", "Needs Improvement", or "Poor" for the keyword "${report.keyword}". Write 1-2 sentences explaining why.

**2. Priority Recommendations**
Give 3-6 numbered, specific, actionable recommendations ordered by impact. For each, explain what to change AND why it will help ranking.

**3. Content Quality Note**
Write 1-2 sentences on whether the content genuinely serves the keyword intent or just mentions it superficially.

Be concise and direct.`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return `AI analysis unavailable: ${message}. Review the algorithmic results above.`
  }
}
