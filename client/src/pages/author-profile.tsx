import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import BipCard from "../../components/bip-card";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, User, FileText, AlertCircle } from "lucide-react";
import type { Bip } from "@shared/schema";
import { useSEO } from "../../hooks/use-seo";

export default function AuthorProfile() {
  const { author } = useParams<{ author: string }>();
  const decodedAuthor = author ? decodeURIComponent(author) : '';

  const { data: bips, isLoading, error } = useQuery<Bip[]>({
    queryKey: ['/api/authors', author, 'bips'],
    enabled: !!author,
  });
  
  // SEO implementation for author profiles
  useSEO({
    title: author ? `${decodeURIComponent(author)} - Bitcoin Developer Profile` : 'Bitcoin Developer Profile',
    description: author ? `Explore Bitcoin Improvement Proposals by ${decodeURIComponent(author)}, including technical contributions and BIP development history.` : 'Bitcoin developer profile and contribution history',
    keywords: author ? `${decodeURIComponent(author)}, Bitcoin developer, BIP author, Bitcoin contributor` : 'Bitcoin developer, BIP author',
    canonicalUrl: author ? `https://bip-explorer.com/author/${encodeURIComponent(author)}` : undefined,
    author: author ? decodeURIComponent(author) : undefined,
    ogType: 'profile',
    structuredData: author && bips ? {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': decodeURIComponent(author),
      'jobTitle': 'Bitcoin Developer',
      'description': `Bitcoin developer who has contributed ${bips.length} improvement proposals`,
      'knowsAbout': ['Bitcoin', 'Cryptocurrency', 'Blockchain Technology'],
      'url': `https://bip-explorer.com/author/${encodeURIComponent(author)}`
    } : undefined
  });

  const sortedBips = bips?.sort((a, b) => a.number - b.number) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load author profile. Please try again later.
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-gray-200 p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Author Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-bitcoin-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-bitcoin-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl" data-testid="text-author-name">
                      {decodedAuthor}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <FileText className="w-4 h-4" />
                      <span data-testid="text-bip-count">
                        {sortedBips.length} BIP{sortedBips.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Final BIPs</div>
                    <div className="text-lg font-semibold text-green-600" data-testid="text-final-count">
                      {sortedBips.filter(bip => bip.status === 'Final').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Active BIPs</div>
                    <div className="text-lg font-semibold text-blue-600" data-testid="text-active-count">
                      {sortedBips.filter(bip => bip.status === 'Active').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Draft BIPs</div>
                    <div className="text-lg font-semibold text-yellow-600" data-testid="text-draft-count">
                      {sortedBips.filter(bip => bip.status === 'Draft').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Standards Track</div>
                    <div className="text-lg font-semibold text-purple-600" data-testid="text-standards-count">
                      {sortedBips.filter(bip => bip.type === 'Standards Track').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BIPs List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                BIPs by {decodedAuthor}
              </h2>
              
              {sortedBips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No BIPs found</div>
                  <div className="text-gray-400 text-sm">
                    This author hasn't authored any BIPs yet.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedBips.map((bip) => (
                    <BipCard key={bip.number} bip={bip} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
