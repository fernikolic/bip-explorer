import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useSEO } from "../hooks/use-seo";
import { AlertCircle, ArrowLeft, Calendar, Users, Tag, ExternalLink } from "lucide-react";
import type { Bip } from "@shared/schema";
import { getCategoryDefinition } from "@shared/categories";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  const { data: bips, isLoading, error } = useQuery<Bip[]>({
    queryKey: ['/api/bips'],
  });

  const categoryDef = category ? getCategoryDefinition(category) : undefined;
  const categoryBips = bips?.filter(bip => 
    bip.categories?.includes(category || '')
  ).sort((a, b) => b.number - a.number) || [];

  // SEO implementation
  useSEO({
    title: categoryDef ? `${categoryDef.name} BIPs - ${categoryDef.description}` : `Category: ${category}`,
    description: categoryDef ? `Browse all Bitcoin Improvement Proposals in the ${categoryDef.name} category. ${categoryDef.description}` : `Browse BIPs in the ${category} category`,
    keywords: categoryDef ? `Bitcoin BIP ${categoryDef.name} ${category} cryptocurrency` : `Bitcoin BIP ${category}`,
    canonicalUrl: `https://bip-explorer.pages.dev/category/${category}`,
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
              Failed to load BIPs. There was an error fetching the data.
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="outline" className="mt-4">
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/categories">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>

        {/* Category Header */}
        {categoryDef ? (
          <div className="relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-50/80 via-white to-bitcoin-50/60 dark:from-bitcoin-950/40 dark:via-background dark:to-bitcoin-950/20 rounded-3xl" />
            
            <div className="relative bg-white/80 dark:bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-bitcoin-500/5">
              <div className="flex items-start gap-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${categoryDef.color} rounded-2xl flex items-center justify-center shadow-2xl shadow-bitcoin-500/20`}>
                  <Tag className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
                    {categoryDef.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {categoryDef.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {categoryDef.group}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {categoryBips.length} BIPs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {category || 'Unknown Category'}
            </h1>
            <p className="text-muted-foreground">
              {categoryBips.length} BIPs in this category
            </p>
          </div>
        )}

        {/* BIPs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-16 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : categoryBips.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No BIPs found
            </h3>
            <p className="text-muted-foreground">
              There are no BIPs in the {categoryDef?.name || category} category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBips.map((bip) => (
              <Link key={bip.number} href={`/bip/${bip.number}`}>
                <Card className="group h-full hover:shadow-lg hover:shadow-bitcoin-500/10 transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    {/* BIP Number Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {bip.number}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-bitcoin-600 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-bitcoin-600 transition-colors">
                      {bip.title}
                    </h3>

                    {/* Abstract */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {bip.abstract}
                    </p>

                    {/* Status and Type Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(bip.status)}>
                        {bip.status}
                      </Badge>
                      <Badge className={getTypeColor(bip.type)}>
                        {bip.type}
                      </Badge>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(bip.created).getFullYear()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {bip.authors.length} author{bip.authors.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}