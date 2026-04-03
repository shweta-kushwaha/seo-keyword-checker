'use client'

import { AnalyzeResponse, SEOCheck } from '@/types/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, XCircle, Globe, FileText, Link, Bot } from 'lucide-react'

interface SeoReportProps {
  result: AnalyzeResponse
}

function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

function progressColor(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function CheckRow({ check }: { check: SEOCheck }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {check.passed ? (
          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
        )}
        <span className="text-sm">{check.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {check.detail && (
          <span className="text-xs text-muted-foreground">{check.detail}</span>
        )}
        <Badge variant={check.passed ? 'default' : 'destructive'} className="text-xs">
          {check.passed ? 'PASS' : 'FAIL'}
        </Badge>
      </div>
    </div>
  )
}

export default function SeoReport({ result }: SeoReportProps) {
  const { report, aiAssessment } = result
  const score = report.score

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Optimization Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-bold ${scoreColor(score)}`}>{score}</span>
            <span className="text-xl text-muted-foreground mb-1">/ 100</span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progressColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Keyword: <span className="font-medium text-foreground">&ldquo;{report.keyword}&rdquo;</span>
          </p>
        </CardContent>
      </Card>

      {/* Page Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" /> Page Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">URL: </span>
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
              {report.url}
            </a>
          </div>
          <div>
            <span className="text-muted-foreground">Title: </span>
            <span>{report.pageTitle || '(none)'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Meta Description: </span>
            <span>{report.metaDescription || '(none)'}</span>
          </div>
          <Separator />
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span><span className="font-medium text-foreground">{report.wordCount.toLocaleString()}</span> words</span>
            <span><span className="font-medium text-foreground">{report.internalLinkCount}</span> internal links</span>
            <span><span className="font-medium text-foreground">{report.externalLinkCount}</span> external links</span>
            <span><span className="font-medium text-foreground">{report.keywordDensity}%</span> keyword density</span>
          </div>
        </CardContent>
      </Card>

      {/* SEO Checks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" /> SEO Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {report.checks.map((check) => (
            <CheckRow key={check.key} check={check} />
          ))}
        </CardContent>
      </Card>

      {/* AI Assessment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4" /> Gemini AI Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{aiAssessment}</div>
        </CardContent>
      </Card>

    </div>
  )
}
