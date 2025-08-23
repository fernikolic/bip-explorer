import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdSpace from "@/components/ad-space";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSEO } from "@/hooks/use-seo";
import { AlertCircle, ArrowLeft, ExternalLink, User, Calendar, Tag } from "lucide-react";
import type { Bip } from "@shared/schema";

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
    canonicalUrl: `https://bip-explorer.com/bip/${number}`,
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
    } : undefined
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
            <Card>
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
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 bg-bitcoin-100 dark:bg-bitcoin-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-bitcoin-700 dark:text-bitcoin-300 font-bold text-xl" data-testid="text-bip-number">
                        {bip.number}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground" data-testid="text-bip-title">
                        {bip.title}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getStatusColor(bip.status)} data-testid="badge-status">
                          {bip.status}
                        </Badge>
                        <Badge className={getTypeColor(bip.type)} data-testid="badge-type">
                          {bip.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <a
                  href={bip.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-bitcoin-600 hover:text-bitcoin-700"
                  data-testid="link-github"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Authors:</span>
                    <div className="font-medium" data-testid="text-authors">
                      {bip.authors.map((author, index) => (
                        <span key={author}>
                          <Link href={`/author/${encodeURIComponent(author)}`}>
                            <span className="text-bitcoin-600 hover:text-bitcoin-700 cursor-pointer">
                              {author}
                            </span>
                          </Link>
                          {index < bip.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <div className="font-medium" data-testid="text-created">
                      {bip.created}
                    </div>
                  </div>
                </div>
                
                {bip.layer && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Layer:</span>
                      <div className="font-medium" data-testid="text-layer">
                        {bip.layer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ELI5 Explanation */}
            {bip.eli5 && (
              <Card className="border-l-4 border-l-bitcoin-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-bitcoin-600">💡</span>
                    Executive Summary
                    <span className="text-xs bg-bitcoin-100 text-bitcoin-700 dark:bg-bitcoin-900/30 dark:text-bitcoin-300 px-2 py-1 rounded-full">CONTEXT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg" data-testid="text-eli5">
                    {bip.eli5}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Banner Ad */}
            <div className="flex justify-center my-8">
              <AdSpace size="banner" />
            </div>

            {/* Abstract */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed" data-testid="text-abstract">
                  {bip.abstract}
                </p>
              </CardContent>
            </Card>

            {/* Rectangle Ad */}
            <div className="flex justify-center my-8">
              <AdSpace size="rectangle" />
            </div>

            {/* Full Content */}
            <Card>
              <CardHeader>
                <CardTitle>Specification</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none text-foreground"
                  data-testid="text-content"
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded border border-border overflow-x-auto text-foreground">
                    {bip.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Banner Ad */}
            <div className="flex justify-center mt-8">
              <AdSpace size="banner" />
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
