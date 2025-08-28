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
import { AlertCircle, ArrowLeft, Calendar, Users, Layers, ExternalLink } from "lucide-react";
import type { Bip } from "@shared/schema";

export default function LayerPage() {
  const { layer } = useParams<{ layer: string }>();
  
  const { data: bips, isLoading, error } = useQuery<Bip[]>({
    queryKey: ['/api/bips'],
  });

  const layerBips = bips?.filter(bip => 
    bip.layer?.toLowerCase() === layer?.toLowerCase()
  ).sort((a, b) => b.number - a.number) || [];

  // SEO implementation
  useSEO({
    title: `${layer} Layer BIPs - Bitcoin Protocol Layer`,
    description: `Browse all Bitcoin Improvement Proposals for the ${layer} layer. Explore protocol specifications and technical details.`,
    keywords: `Bitcoin BIP ${layer} layer protocol consensus cryptocurrency`,
    canonicalUrl: `https://bip-explorer.pages.dev/layer/${layer}`,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'deferred': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'standards track': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'informational': return 'bg-blue-100 text-blue-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'process': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getLayerColor = (layerName: string) => {
    switch (layerName.toLowerCase()) {
      case 'consensus (soft fork)': return 'from-red-500 to-rose-600';
      case 'consensus (hard fork)': return 'from-orange-500 to-red-600';
      case 'peer services': return 'from-blue-500 to-indigo-600';
      case 'api/rpc': return 'from-green-500 to-emerald-600';
      case 'applications': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
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
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Layer Header */}
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-50/80 via-white to-bitcoin-50/60 dark:bg-black rounded-3xl" />
          
          <div className="relative bg-white/80 dark:bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-bitcoin-500/5">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${getLayerColor(layer || '')} rounded-2xl flex items-center justify-center shadow-2xl shadow-bitcoin-500/20`}>
                <Layers className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
                  {layer} Layer
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Bitcoin protocol layer specifications and improvements
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    Protocol Layer
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {layerBips.length} BIPs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BIPs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 bg-card dark:bg-black">
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
        ) : layerBips.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No BIPs found
            </h3>
            <p className="text-muted-foreground">
              There are no BIPs in the {layer} layer yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layerBips.map((bip) => (
              <Link key={bip.number} href={`/bip/${bip.number}`}>
                <Card className="group h-full hover:shadow-lg hover:shadow-bitcoin-500/10 transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white dark:bg-black">
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