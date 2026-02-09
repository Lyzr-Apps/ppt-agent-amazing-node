'use client'

import { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { FiFile, FiDownload, FiRefreshCw, FiLayout, FiCheck, FiAlertCircle, FiUsers, FiList, FiLoader, FiZap } from 'react-icons/fi'

const AGENT_ID = '698a007b772813afd752509c'
const AGENT_NAME = 'Presentation Generator Agent'

const SAMPLE_DATA = {
  topic: 'Digital Transformation Strategy for 2025',
  slides: '6',
  audience: 'C-suite executives',
  keyPoints: 'AI adoption, cloud migration, cybersecurity, ROI metrics',
  style: 'Professional',
  responseText: 'Your professional 6-slide PowerPoint presentation titled "Digital Transformation Strategy for 2025"\u2014tailored for C-suite executives and covering AI adoption, cloud migration, cybersecurity, and ROI metrics\u2014has been created.\n\nYou can download the complete presentation here:\n[Download Digital Transformation Strategy for 2025 (PPTX)](https://url-shortner.studio.lyzr.ai/0cd23cc7)\n\nIf you need changes or want to review the detailed slide content, just let me know!',
  downloadUrl: 'https://url-shortner.studio.lyzr.ai/0cd23cc7',
}

function extractDownloadUrl(text: string): string | null {
  const urlMatch = text.match(/https:\/\/url-shortner\.studio\.lyzr\.ai\/[a-zA-Z0-9]+/)
  return urlMatch ? urlMatch[0] : null
}

function extractResponseText(result: any): string {
  const text =
    result?.raw_response ||
    result?.response?.message ||
    result?.response?.result?.response ||
    result?.response?.result?.message ||
    (typeof result?.response?.result === 'string' ? result.response.result : '') ||
    ''
  return text
}

function formatResponseText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function SkeletonLoader() {
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
          <div className="h-3 w-1/2 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-3 w-5/6 bg-muted animate-pulse rounded-md" />
        <div className="h-3 w-4/6 bg-muted animate-pulse rounded-md" />
      </div>
      <div className="h-12 w-48 bg-primary/10 animate-pulse rounded-[0.875rem]" />
      <div className="space-y-3 mt-4">
        <div className="h-3 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-3 w-3/4 bg-muted animate-pulse rounded-md" />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary/30 animate-pulse rounded-full" />
        </div>
        <span className="text-xs text-muted-foreground">Generating...</span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <FiLayout className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="text-lg font-semibold text-foreground/80 mb-2">Your presentation will appear here</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Fill in the form on the left and click "Generate Presentation" to create a polished PowerPoint file powered by AI.</p>
      <div className="flex gap-2 mt-6">
        <Badge variant="secondary" className="text-xs gap-1"><FiFile className="w-3 h-3" /> PPTX Output</Badge>
        <Badge variant="secondary" className="text-xs gap-1"><FiZap className="w-3 h-3" /> AI-Powered</Badge>
      </div>
    </div>
  )
}

function ResultDisplay({
  responseText,
  downloadUrl,
  onRegenerate,
  loading,
}: {
  responseText: string
  downloadUrl: string | null
  onRegenerate: () => void
  loading: boolean
}) {
  const cleanText = formatResponseText(responseText)

  return (
    <div className="space-y-5 p-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FiCheck className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Presentation Ready</h3>
          <p className="text-xs text-muted-foreground">Your PowerPoint file has been generated successfully</p>
        </div>
      </div>

      <Separator />

      <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{cleanText}</div>

      {downloadUrl && (
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="block">
          <div className="flex items-center gap-4 p-4 rounded-[0.875rem] bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-all duration-200 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <FiFile className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Presentation.pptx</p>
              <p className="text-xs text-muted-foreground">PowerPoint file ready for download</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-200">
              <FiDownload className="w-4 h-4" />
              Download
            </div>
          </div>
        </a>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onRegenerate} disabled={loading} className="gap-2">
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>
    </div>
  )
}

function AgentInfoCard({ isActive }: { isActive: boolean }) {
  return (
    <div className="backdrop-blur-[16px] bg-card/75 border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-accent'}`} />
          <div>
            <p className="text-xs font-medium text-foreground">{AGENT_NAME}</p>
            <p className="text-[11px] text-muted-foreground">Generates PPTX presentations from text prompts</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px]">{isActive ? 'Processing' : 'Ready'}</Badge>
      </div>
    </div>
  )
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [slides, setSlides] = useState('8')
  const [audience, setAudience] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [style, setStyle] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [responseText, setResponseText] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [topicError, setTopicError] = useState(false)
  const [showSampleData, setShowSampleData] = useState(false)

  const currentTopic = showSampleData && !topic ? SAMPLE_DATA.topic : topic
  const currentSlides = showSampleData && slides === '8' ? SAMPLE_DATA.slides : slides
  const currentAudience = showSampleData && !audience ? SAMPLE_DATA.audience : audience
  const currentKeyPoints = showSampleData && !keyPoints ? SAMPLE_DATA.keyPoints : keyPoints
  const currentStyle = showSampleData && style === 'Professional' ? SAMPLE_DATA.style : style

  const displayResponseText = showSampleData && !responseText ? SAMPLE_DATA.responseText : responseText
  const displayDownloadUrl = showSampleData && !downloadUrl ? SAMPLE_DATA.downloadUrl : downloadUrl

  const handleGenerate = async () => {
    const activeTopic = currentTopic.trim()
    if (!activeTopic) {
      setTopicError(true)
      return
    }
    setTopicError(false)
    setLoading(true)
    setError(null)
    setResponseText(null)
    setDownloadUrl(null)

    const prompt = `Create a ${currentSlides}-slide ${currentStyle.toLowerCase()} presentation on "${activeTopic}".${currentAudience ? ` Target audience: ${currentAudience}.` : ''}${currentKeyPoints ? ` Key points to cover: ${currentKeyPoints}.` : ''} Style: ${currentStyle}.`

    try {
      const result = await callAIAgent(prompt, AGENT_ID)
      if (result.success) {
        const text = extractResponseText(result)
        if (text) {
          setResponseText(text)
          setDownloadUrl(extractDownloadUrl(text))
        } else {
          setError('The agent returned an empty response. Please try again.')
        }
      } else {
        setError(result?.error || 'Failed to generate presentation. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleTopicChange = (value: string) => {
    setTopic(value)
    if (value.trim()) setTopicError(false)
  }

  const keyPointsLength = currentKeyPoints.length

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(230 50% 95%) 0%, hsl(260 45% 94%) 40%, hsl(220 50% 95%) 70%, hsl(200 45% 94%) 100%)' }}>
      {/* Header */}
      <header className="backdrop-blur-[16px] bg-card/75 border-b border-white/[0.18] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FiLayout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground" style={{ letterSpacing: '-0.01em' }}>PPT Generator</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">AI-Powered Presentation Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
            <Switch id="sample-toggle" checked={showSampleData} onCheckedChange={setShowSampleData} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Input Form (40%) */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="backdrop-blur-[16px] bg-card/75 border border-white/[0.18] shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
                  <FiFile className="w-4 h-4 text-primary" />
                  Presentation Details
                </CardTitle>
                <CardDescription className="text-xs" style={{ lineHeight: '1.55' }}>Configure your presentation settings below. Provide a topic and customize the output to match your needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Topic */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium">
                    Presentation Topic <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Digital Transformation Strategy for 2025"
                    value={showSampleData && !topic ? SAMPLE_DATA.topic : topic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className={`transition-colors ${topicError ? 'border-destructive ring-1 ring-destructive/30' : ''}`}
                  />
                  {topicError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      Topic is required to generate a presentation
                    </p>
                  )}
                </div>

                {/* Slides and Style Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slides" className="text-sm font-medium flex items-center gap-1.5">
                      <FiList className="w-3.5 h-3.5 text-muted-foreground" />
                      Slides
                    </Label>
                    <Select value={showSampleData && slides === '8' ? SAMPLE_DATA.slides : slides} onValueChange={setSlides}>
                      <SelectTrigger id="slides">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 slides</SelectItem>
                        <SelectItem value="8">8 slides</SelectItem>
                        <SelectItem value="10">10 slides</SelectItem>
                        <SelectItem value="12">12 slides</SelectItem>
                        <SelectItem value="15">15 slides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-sm font-medium flex items-center gap-1.5">
                      <FiZap className="w-3.5 h-3.5 text-muted-foreground" />
                      Style
                    </Label>
                    <Select value={showSampleData && style === 'Professional' ? SAMPLE_DATA.style : style} onValueChange={setStyle}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="Minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium flex items-center gap-1.5">
                    <FiUsers className="w-3.5 h-3.5 text-muted-foreground" />
                    Target Audience
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., C-suite executives, marketing team"
                    value={showSampleData && !audience ? SAMPLE_DATA.audience : audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keypoints" className="text-sm font-medium">Key Points to Cover</Label>
                    <span className={`text-[11px] ${keyPointsLength > 180 ? 'text-destructive' : 'text-muted-foreground'}`}>{keyPointsLength}/200</span>
                  </div>
                  <Textarea
                    id="keypoints"
                    placeholder="e.g., AI adoption, cloud migration, cybersecurity, ROI metrics"
                    value={showSampleData && !keyPoints ? SAMPLE_DATA.keyPoints : keyPoints}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) setKeyPoints(e.target.value)
                    }}
                    className="resize-none min-h-[80px]"
                  />
                </div>

                {/* Generate Button */}
                <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2 h-11 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
                  {loading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiZap className="w-4 h-4" />
                      Generate Presentation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <AgentInfoCard isActive={loading} />
          </div>

          {/* Right Panel - Preview/Result (60%) */}
          <div className="lg:col-span-3">
            <Card className="backdrop-blur-[16px] bg-card/75 border border-white/[0.18] shadow-md min-h-[500px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
                  <FiLayout className="w-4 h-4 text-primary" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Error State */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-[0.875rem] bg-destructive/5 border border-destructive/15 mb-4">
                    <FiAlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Generation Failed</p>
                      <p className="text-xs text-destructive/80 mt-1">{error}</p>
                      <Button variant="outline" size="sm" onClick={handleGenerate} className="mt-3 gap-1.5 text-xs">
                        <FiRefreshCw className="w-3 h-3" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && !error && <SkeletonLoader />}

                {/* Result State */}
                {!loading && !error && displayResponseText && (
                  <ResultDisplay
                    responseText={displayResponseText}
                    downloadUrl={displayDownloadUrl ?? null}
                    onRegenerate={handleRegenerate}
                    loading={loading}
                  />
                )}

                {/* Empty State */}
                {!loading && !error && !displayResponseText && (
                  <div className="flex-1 flex items-center justify-center">
                    <EmptyState />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
