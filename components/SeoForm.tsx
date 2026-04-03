'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { AnalyzeResponse } from '@/types/seo'

interface SeoFormProps {
  onResult: (result: AnalyzeResponse) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
}

export default function SeoForm({ onResult, onLoading, onError }: SeoFormProps) {
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || !keyword.trim()) return

    setSubmitting(true)
    onLoading(true)
    onError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), keyword: keyword.trim() }),
      })

      const data: AnalyzeResponse = await res.json()

      if (!res.ok || data.error) {
        onError(data.error ?? 'Something went wrong. Please try again.')
      } else {
        onResult(data)
      }
    } catch {
      onError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
      onLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Search className="h-5 w-5" />
          SEO Keyword Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyword">Target Keyword</Label>
            <Input
              id="keyword"
              type="text"
              placeholder="e.g. best running shoes"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting || !url.trim() || !keyword.trim()}>
            {submitting ? 'Analyzing...' : 'Analyze Page'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
