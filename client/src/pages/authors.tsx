import { useState, useMemo } from "react";
import { Link } from "wouter";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import AdSpace from "../components/ad-space";
import { useBips } from "../hooks/use-bips";
import { useSEO } from "../hooks/use-seo";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, User, FileText } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import type { Bip } from "@shared/schema";

interface AuthorSummary {
  name: string;
  bipCount: number;
  finalBips: number;
  latestBip: Bip;
  bips: Bip[];
}

export default function Authors() {
  const { data: bips, isLoading } = useBips();
  const [searchTerm, setSearchTerm] = useState("");
  
  // SEO implementation
  useSEO({
    title: 'BIP Authors & Contributors - Bitcoin Development Community',
    description: 'Explore Bitcoin Improvement Proposal authors and contributors who have shaped Bitcoin\'s evolution through technical specifications.',
    keywords: 'Bitcoin developers, BIP authors, Bitcoin contributors, Bitcoin development community',
    canonicalUrl: 'https://bip-explorer.com/authors',
    ogType: 'website'
  });

  const authors = useMemo(() => {
    if (!bips) return [];
    
    const authorMap = new Map<string, AuthorSummary>();
    
    bips.forEach(bip => {
      bip.authors.forEach(authorName => {
        if (!authorMap.has(authorName)) {
          authorMap.set(authorName, {
            name: authorName,
            bipCount: 0,
            finalBips: 0,
            latestBip: bip,
            bips: []
          });
        }
        
        const author = authorMap.get(authorName)!;
        author.bipCount++;
        author.bips.push(bip);
        
        if (bip.status.toLowerCase() === 'final') {
          author.finalBips++;
        }
        
        // Update latest BIP (highest number)
        if (bip.number > author.latestBip.number) {
          author.latestBip = bip;
        }
      });
    });
    
    return Array.from(authorMap.values())
      .sort((a, b) => b.bipCount - a.bipCount);
  }, [bips]);

  const filteredAuthors = useMemo(() => {
    if (!searchTerm) return authors;
    return authors.filter(author => 
      author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [authors, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight">
            BIP Authors & Contributors
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the developers and researchers who have shaped Bitcoin's evolution through their technical contributions.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search authors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl border border-border text-lg focus:ring-2 focus:ring-bitcoin-500 focus:border-bitcoin-500 shadow-moderate"
                data-testid="input-author-search"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl font-light text-foreground mb-3 tracking-tight">
                Contributors
              </h2>
              <p className="text-muted-foreground text-lg">
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  `${filteredAuthors.length} active contributors`
                )}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl shadow-subtle p-8 border border-border">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-32" />
                      <div className="flex gap-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredAuthors.map((author) => (
                <Link key={author.name} href={`/author/${encodeURIComponent(author.name)}`}>
                  <div className="bg-card rounded-3xl shadow-subtle hover:shadow-prominent border border-border transition-apple hover-lift cursor-pointer" data-testid={`card-author-${author.name}`}>
                    <div className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-bitcoin-100 to-bitcoin-200 dark:from-bitcoin-900/30 dark:to-bitcoin-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-bitcoin-700 dark:text-bitcoin-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-light text-foreground mb-2 truncate" data-testid={`text-author-name-${author.name}`}>
                            {author.name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{author.bipCount} BIP{author.bipCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                                {author.finalBips} Final
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Latest:</span>{' '}
                            <span className="text-bitcoin-600">BIP {author.latestBip.number}</span> - {author.latestBip.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredAuthors.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-20">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <div className="text-foreground text-xl font-medium mb-3">No authors found</div>
                  <div className="text-muted-foreground text-lg">
                    Try a different search term to find contributors.
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