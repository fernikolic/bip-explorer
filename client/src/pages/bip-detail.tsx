import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import AdSpace from "../components/ad-space";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useSEO } from "../hooks/use-seo";
import { AlertCircle, ArrowLeft, ExternalLink, User, Calendar, Tag } from "lucide-react";
import type { Bip } from "@shared/schema";
import { getCategoryDefinition } from "@shared/categories";

export default function BipDetail() {
  const { number } = useParams<{ number: string }>();
  
  const { data: bip, isLoading, error } = useQuery<Bip>({
    queryKey: ['/api/bips', number],
    enabled: !!number,
  });
  
  // SEO implementation for individual BIP pages
  useSEO({
    title: bip ? `BIP ${bip.number}: ${bip.title} - Bitcoin Improvement Proposal` : `BIP ${number} - Bitcoin Improvement Proposal`,
    description: bip ? `${bip.title} - ${bip.eli5?.substring(0, 155) || bip.abstract?.substring(0, 155) || 'Bitcoin Improvement Proposal detailed specification'}...` : `Bitcoin Improvement Proposal ${number} details and technical specification`,
    keywords: bip ? `BIP ${bip.number}, ${bip.title}, Bitcoin improvement, ${bip.type}, ${bip.status}` : `BIP ${number}, Bitcoin improvement proposal`,
    canonicalUrl: `https://bip-explorer.pages.dev/bip/${number}`,
    author: bip ? bip.authors.join(', ') : undefined,
    ogType: 'article',
    structuredData: bip ? {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': `BIP ${bip.number}: ${bip.title}`,
      'description': bip.eli5 || bip.abstract || bip.title,
      'author': bip.authors.map(author => ({ '@type': 'Person', 'name': author })),
      'dateCreated': bip.created,
      'articleSection': bip.type,
      'keywords': [bip.type, bip.status, 'Bitcoin', 'BIP', 'cryptocurrency'].join(', ')
    } : undefined,
    breadcrumbs: bip ? [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://bip-explorer.pages.dev/'
      },
      {
        '@type': 'ListItem', 
        position: 2,
        name: 'Bitcoin Improvement Proposals',
        item: 'https://bip-explorer.pages.dev/#bips-section'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `BIP ${bip.number}: ${bip.title}`,
        item: `https://bip-explorer.pages.dev/bip/${bip.number}`
      }
    ] : undefined
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'deferred': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'standards track': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'informational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'process': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load BIP details. The BIP may not exist or there was an error fetching the data.
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="outline" className="mt-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Card className="bg-card dark:bg-gray-900">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        ) : bip ? (
          <div className="space-y-8">
            {/* Modern Hero Header */}
            <div className="relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-50/80 via-white to-bitcoin-50/60 dark:from-bitcoin-950/40 dark:via-background dark:to-bitcoin-950/20" />
              
              <div className="relative bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-bitcoin-500/5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* BIP Number and Title */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-bitcoin-500/20">
                          <span className="text-white font-bold text-2xl tracking-tight" data-testid="text-bip-number">
                            {bip.number}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4" data-testid="text-bip-title">
                          {bip.title}
                        </h1>
                        
                        {/* Modern Status Badges */}
                        <div className="flex flex-wrap gap-3">
                          <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-medium text-sm shadow-lg backdrop-blur-sm ${getStatusColor(bip.status)}`} data-testid="badge-status">
                            <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-70" />
                            {bip.status}
                          </div>
                          <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-medium text-sm shadow-lg backdrop-blur-sm ${getTypeColor(bip.type)}`} data-testid="badge-type">
                            {bip.type}
                          </div>
                        </div>
                        
                        {/* Categories */}
                        {bip.categories && bip.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {bip.categories.slice(0, 6).map((categoryId) => {
                              const categoryDef = getCategoryDefinition(categoryId);
                              return (
                                <Link key={categoryId} href={`/category/${categoryId}`}>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium transition-all hover:scale-105 cursor-pointer shadow-sm hover:shadow-md ${
                                    categoryDef 
                                      ? `bg-gradient-to-r ${categoryDef.color}/90 hover:${categoryDef.color} text-white backdrop-blur-sm`
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                  }`}>
                                    <Tag className="w-3 h-3 mr-1.5 opacity-90" />
                                    {categoryDef ? categoryDef.name : categoryId}
                                  </div>
                                </Link>
                              );
                            })}
                            {bip.categories.length > 6 && (
                              <div className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                +{bip.categories.length - 6} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* GitHub Link */}
                  <a
                    href={bip.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-800/80 border border-border/50 rounded-2xl font-medium text-foreground transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
                    data-testid="link-github"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    View on GitHub
                  </a>
                </div>

                {/* Modern Metadata Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {/* Authors Card */}
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 rounded-2xl" />
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Author{bip.authors.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-foreground font-medium leading-tight" data-testid="text-authors">
                            {bip.authors.map((author, index) => (
                              <span key={author}>
                                <Link href={`/author/${encodeURIComponent(author)}`}>
                                  <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors duration-200 underline decoration-transparent hover:decoration-current underline-offset-2">
                                    {author}
                                  </span>
                                </Link>
                                {index < bip.authors.length - 1 && (
                                  <span className="text-muted-foreground mx-1">•</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Created Date Card */}
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-2xl" />
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-lg hover:shadow-slate-500/10 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Created
                          </div>
                          <div className="text-foreground font-medium" data-testid="text-created">
                            {new Date(bip.created).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Layer Card (if available) */}
                  {bip.layer && (
                    <Link href={`/layer/${encodeURIComponent(bip.layer)}`}>
                      <div className="group relative overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-stone-50 dark:from-zinc-950/30 dark:to-stone-950/30 rounded-2xl" />
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 p-5 hover:shadow-lg hover:shadow-zinc-500/10 transition-all duration-200 hover:-translate-y-0.5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-zinc-600 to-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                Layer
                              </div>
                              <div className="text-foreground font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors" data-testid="text-layer">
                                {bip.layer}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Modern ELI5 Explanation */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-50/60 via-orange-50/40 to-yellow-50/60 dark:from-bitcoin-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 rounded-3xl" />
              
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-bitcoin-500/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-bitcoin-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-bitcoin-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Explained in simple terms
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      A clear, technical explanation without the jargon
                    </div>
                  </div>
                </div>
                
                <div className="pl-16">
                  {bip.eli5 ? (
                    <div className="prose prose-lg max-w-none text-foreground leading-relaxed" data-testid="text-eli5">
                      <p className="text-lg font-medium leading-relaxed">
                        {bip.eli5}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-amber-700 dark:text-amber-300 font-medium">
                        Explanation is being prepared for this BIP. Please check back soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard Ad */}
            <div className="my-8">
              <AdSpace size="leaderboard" />
            </div>

            {/* Modern Abstract */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-zinc-50/80 dark:from-slate-950/30 dark:via-gray-950/20 dark:to-zinc-950/30 rounded-3xl" />
              
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-slate-500/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-500 to-zinc-600 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Technical Abstract
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      The formal technical summary of this proposal
                    </div>
                  </div>
                </div>
                
                <div className="pl-16">
                  <div className="prose prose-lg max-w-none text-foreground leading-relaxed" data-testid="text-abstract">
                    <p className="text-base font-medium leading-relaxed">
                      {bip.abstract}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Rectangle Ad */}
            <div className="my-8">
              <AdSpace size="large-rectangle" />
            </div>

            {/* Modern Specification */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-gray-50/80 dark:from-gray-950/30 dark:via-slate-950/20 dark:to-gray-950/30 rounded-3xl" />
              
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-gray-500/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl shadow-gray-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Full Specification
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Complete technical documentation and implementation details
                    </div>
                  </div>
                </div>
                
                <div className="pl-16">
                  <div 
                    className="prose prose-sm max-w-none text-foreground"
                    data-testid="text-content"
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 dark:from-slate-800 dark:via-gray-800 dark:to-zinc-800" />
                      <pre className="relative whitespace-pre-wrap font-mono text-sm bg-slate-950/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-100 dark:text-slate-200 p-6 rounded-2xl overflow-x-auto border border-slate-700/50 shadow-2xl shadow-slate-900/20">
                        {bip.content}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Bottom Leaderboard Ad */}
            <div className="mt-8">
              <AdSpace size="leaderboard" />
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
