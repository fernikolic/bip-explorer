import { useState, useEffect } from "react";
import { useLocation, useSearch as useSearchParams } from "wouter";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import SearchFilters from "../../components/search-filters";
import BipCard from "../../components/bip-card";
import AdSpace from "../../components/ad-space";
import { useBips } from "../../hooks/use-bips";
import { useSearch } from "../../hooks/use-search";
import { useSEO } from "../../hooks/use-seo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

export default function Search() {
  const { data: bips, isLoading } = useBips();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("number");
  
  // SEO implementation
  useSEO({
    title: 'Search Bitcoin Improvement Proposals - BIP Explorer',
    description: 'Search and filter Bitcoin Improvement Proposals by status, type, author, or content. Find specific BIPs with advanced search capabilities.',
    keywords: 'Bitcoin BIP search, filter BIP proposals, Bitcoin improvement search, BIP directory search',
    canonicalUrl: 'https://bip-explorer.com/search',
    ogType: 'website'
  });
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlType = params.get('type');
    const urlStatus = params.get('status');
    const urlSearch = params.get('q');
    
    if (urlType) {
      setTypeFilter(urlType);
    }
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);
  
  const { searchResults, isSearching } = useSearch({
    bips: bips || [],
    searchTerm,
    statusFilter,
    typeFilter,
    sortBy,
  });

  const displayedBips = searchTerm || (statusFilter !== "all") || (typeFilter !== "all") ? searchResults : (bips || []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight">
            Search Bitcoin Improvement Proposals
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find specific BIPs by number, title, author, or content. Use advanced filters to narrow your search.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search BIPs by number, title, author, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl border border-border text-lg focus:ring-2 focus:ring-bitcoin-500 focus:border-bitcoin-500 shadow-moderate"
                data-testid="input-search"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Mobile Banner Ad */}
        <div className="flex justify-center mb-8 lg:hidden">
          <AdSpace size="mobile-banner" />
        </div>
        
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <section className="mt-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-light text-foreground mb-3 tracking-tight">
                Search Results
              </h2>
              <p className="text-muted-foreground text-lg">
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  `${displayedBips.length} proposals found`
                )}
              </p>
            </div>
            
            {/* Rectangle Ad for desktop */}
            <div className="hidden lg:block">
              <AdSpace size="rectangle" />
            </div>
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
                  {/* Insert banner ad after every 8th BIP */}
                  {(index + 1) % 8 === 0 && (
                    <div className="flex justify-center my-12">
                      <AdSpace size="banner" />
                    </div>
                  )}
                </div>
              ))}
              
              {displayedBips.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <div className="text-foreground text-xl font-medium mb-3">No proposals found</div>
                  <div className="text-muted-foreground text-lg max-w-md mx-auto">
                    Try different keywords or adjust your filters to find what you're looking for.
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