import Navigation from "../components/navigation";
import Hero from "../components/hero";
import StatsOverview from "../components/stats-overview";
import BipCard from "../components/bip-card";
import AdSpace from "../components/ad-space";
import CategoriesSection from "../components/categories-section";
import Footer from "../components/footer";
import { useBips } from "../hooks/use-bips";
import { useSearch } from "../hooks/use-search";
import { useSEO } from "../hooks/use-seo";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { data: bips, isLoading, error } = useBips();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("number");
  
  // SEO implementation
  useSEO({
    title: 'BIP Explorer - Bitcoin Improvement Proposals Directory',
    description: 'Comprehensive directory of Bitcoin Improvement Proposals (BIPs) with authentic GitHub data, advanced search, and intelligent explanations for technical Bitcoin concepts.',
    keywords: 'Bitcoin, BIP, Bitcoin Improvement Proposals, cryptocurrency, blockchain, technical documentation, Bitcoin development',
    canonicalUrl: 'https://bip-explorer.pages.dev/',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'BIP Explorer',
      'description': 'Educational directory for Bitcoin Improvement Proposals',
      'url': 'https://bip-explorer.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://bip-explorer.pages.dev/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  });
  
  const { searchResults, isSearching } = useSearch({
    bips: bips || [],
    searchTerm,
    statusFilter,
    typeFilter,
    sortBy,
  });

  const displayedBips = searchTerm || (statusFilter !== "all") || (typeFilter !== "all") ? searchResults : (bips || []);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load BIPs from GitHub API. Please try again later.
              {error instanceof Error && `: ${error.message}`}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <StatsOverview />
        
        {/* Browse by Category and Recent Updates */}
        <div className="mb-20">
          <CategoriesSection />
        </div>
        
        {/* Leaderboard Ad */}
        <div className="mb-16">
          <AdSpace size="leaderboard" />
        </div>

        <section id="bips-section">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-light text-foreground mb-3 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-10 w-64" />
                ) : (
                  'Bitcoin Improvement Proposals'
                )}
              </h2>
              <p className="text-muted-foreground text-xl font-light">
                {isLoading ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  `${displayedBips.length} proposals found`
                )}
              </p>
            </div>
            
            {/* Large Rectangle Ad for desktop */}
            <div className="hidden lg:block lg:flex-shrink-0 lg:w-full lg:max-w-sm">
              <AdSpace size="large-rectangle" />
            </div>
          </div>
          
          {/* Mobile Banner Ad */}
          <div className="mb-8 lg:hidden">
            <AdSpace size="mobile-banner" />
          </div>

          {isLoading ? (
            <div className="w-full space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full bg-card rounded-2xl shadow-subtle p-6 lg:p-8 border border-border">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <Skeleton className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-3">
                      <Skeleton className="h-6 lg:h-7 w-full max-w-md" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full space-y-6">
              {displayedBips.map((bip, index) => (
                <div key={bip.number}>
                  <BipCard bip={bip} />
                  {/* Insert banner ad after every 6th BIP */}
                  {(index + 1) % 6 === 0 && (
                    <div className="my-12">
                      <AdSpace size="banner" />
                    </div>
                  )}
                </div>
              ))}
              
              {displayedBips.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <div className="text-foreground text-xl font-medium mb-3">No proposals found</div>
                  <div className="text-muted-foreground text-lg">
                    Try adjusting your search terms or filters
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}