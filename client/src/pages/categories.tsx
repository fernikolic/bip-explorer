import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useSEO } from "../hooks/use-seo";
import { ArrowLeft, Tag, Users, TrendingUp, Grid3X3 } from "lucide-react";
import type { Bip } from "@shared/schema";
import { 
  categoryDefinitions, 
  getCategoriesByGroup, 
  getAllCategoryGroups,
  CategoryGroup 
} from "@shared/categories";

export default function CategoriesPage() {
  const { data: bips, isLoading } = useQuery<Bip[]>({
    queryKey: ['/api/bips'],
  });

  // SEO implementation
  useSEO({
    title: "Bitcoin BIP Categories - Browse by Topic",
    description: "Explore Bitcoin Improvement Proposals organized by categories including governance, consensus, wallets, privacy, and more.",
    keywords: "Bitcoin BIP categories governance consensus wallets privacy security cryptocurrency",
    canonicalUrl: "https://bip-explorer.pages.dev/categories",
  });

  // Calculate BIP counts per category
  const categoryStats = new Map<string, number>();
  if (bips) {
    for (const bip of bips) {
      if (bip.categories) {
        for (const category of bip.categories) {
          categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
        }
      }
    }
  }

  const categoryGroups = getAllCategoryGroups();

  // Get most popular categories
  const popularCategories = Array.from(categoryStats.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([categoryId, count]) => ({
      definition: categoryDefinitions[categoryId],
      count
    }))
    .filter(item => item.definition);

  const totalBipsWithCategories = bips?.filter(bip => bip.categories && bip.categories.length > 0).length || 0;
  const totalCategoriesWithBips = categoryStats.size; // Only count categories that have BIPs
  const hasAnyCategories = totalCategoriesWithBips > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-50/80 via-white to-bitcoin-50/60 dark:from-bitcoin-950/40 dark:via-background dark:to-bitcoin-950/20 rounded-3xl" />
          
          <div className="relative bg-white/80 dark:bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-bitcoin-500/5">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-bitcoin-500/20">
                <Grid3X3 className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
                  BIP Categories
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Explore Bitcoin Improvement Proposals organized by technical domains and use cases
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/60 dark:bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{totalCategoriesWithBips}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                  <div className="bg-white/60 dark:bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{totalBipsWithCategories}</div>
                    <div className="text-sm text-muted-foreground">Categorized BIPs</div>
                  </div>
                  <div className="bg-white/60 dark:bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{categoryGroups.length}</div>
                    <div className="text-sm text-muted-foreground">Topic Groups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        {!isLoading && popularCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-bitcoin-600" />
              <h2 className="text-2xl font-bold text-foreground">Most Popular Categories</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCategories.map(({ definition, count }) => (
                <Link key={definition.id} href={`/category/${definition.id}`}>
                  <Card className="group h-full hover:shadow-lg hover:shadow-bitcoin-500/10 transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${definition.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Tag className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-bitcoin-600 transition-colors">
                            {definition.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {definition.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {definition.group}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-medium text-bitcoin-600">
                          <Users className="w-4 h-4" />
                          {count}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories by Group */}
        <div className="space-y-10">
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, groupIndex) => (
                <div key={groupIndex}>
                  <Skeleton className="h-8 w-64 mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-6 w-8" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !hasAnyCategories ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Grid3X3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Categories Loading...
                </h3>
                <p className="text-muted-foreground mb-6">
                  The BIP categorization system is initializing. This may take a moment on first load.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Refresh Page
                  </Button>
                  <Link href="/">
                    <Button variant="default">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            categoryGroups.map((group) => {
              const groupCategories = getCategoriesByGroup(group);
              const categoriesWithCounts = groupCategories
                .map(cat => ({
                  ...cat,
                  count: categoryStats.get(cat.id) || 0
                }))
                .filter(cat => cat.count > 0) // Only show categories with BIPs
                .sort((a, b) => b.count - a.count);

              if (categoriesWithCounts.length === 0) return null;

              return (
                <div key={group}>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Tag className="w-6 h-6 text-bitcoin-600" />
                    {group}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoriesWithCounts.map((category) => (
                      <Link key={category.id} href={`/category/${category.id}`}>
                        <Card className="group hover:shadow-lg hover:shadow-bitcoin-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                                <Tag className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground group-hover:text-bitcoin-600 transition-colors truncate">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {category.description}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs font-medium">
                                {category.count}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}