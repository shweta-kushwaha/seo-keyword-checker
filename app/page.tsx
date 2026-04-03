'use client'

import { useState } from 'react'
import SeoForm from '@/components/SeoForm'
import SeoReport from '@/components/SeoReport'
import { AnalyzeResponse } from '@/types/seo'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleResult(data: AnalyzeResponse) {
    setResult(data)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">SEO Keyword Checker</h1>
          <p className="text-muted-foreground text-sm">
            Enter a URL and keyword to get an SEO optimization report powered by Gemini AI.
          </p>
        </div>

        <SeoForm onResult={handleResult} onLoading={setLoading} onError={setError} />

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Fetching page and analyzing SEO...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && !loading && !error && (
          <SeoReport result={result} />
        )}

      </div>
    </main>
  )
}
