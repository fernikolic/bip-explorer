import Navigation from "../components/navigation";
import Footer from "../components/footer";
import AdSpace from "../components/ad-space";
import SimpleDependencyGraph from "../components/simple-dependency-graph";
// import { useSEO } from "../hooks/use-seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Network, GitBranch, ArrowRight } from "lucide-react";

export default function Dependencies() {
  // Temporarily remove SEO to isolate error
  // useSEO({
  //   title: 'BIP Dependencies & Relationships - Bitcoin Improvement Proposal Network',
  //   description: 'Explore the relationships between Bitcoin Improvement Proposals through an interactive dependency graph showing how BIPs reference, replace, and build upon each other.',
  //   keywords: 'Bitcoin BIP dependencies, BIP relationships, Bitcoin proposal network, BIP references, Bitcoin development graph',
  //   canonicalUrl: 'https://bip-explorer.pages.dev/dependencies',
  //   ogType: 'website',
  //   structuredData: {
  //     '@context': 'https://schema.org',
  //     '@type': 'WebPage',
  //     'name': 'BIP Dependencies & Relationships',
  //     'description': 'Interactive visualization of relationships between Bitcoin Improvement Proposals',
  //     'url': 'https://bip-explorer.pages.dev/dependencies'
  //   }
  // });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Network className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">BIP Dependencies</h1>
              <p className="text-muted-foreground">
                Explore relationships between Bitcoin Improvement Proposals
              </p>
            </div>
          </div>
        </div>

        {/* Hero Ad */}
        <div className="mb-8">
          <AdSpace size="banner" />
        </div>

        {/* Introduction */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-blue-500" />
                References
              </CardTitle>
              <CardDescription>
                When BIPs mention or cite other BIPs in their specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Blue connections show when one BIP references another, indicating 
                conceptual relationships and dependencies in the Bitcoin protocol evolution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-red-500" />
                Replacements
              </CardTitle>
              <CardDescription>
                When newer BIPs supersede or replace older proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Red connections show formal replacement relationships, where newer 
                BIPs obsolete previous proposals with improved specifications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dependency Graph */}
        <div className="mb-8">
          <SimpleDependencyGraph 
            height={700} 
            showControls={true} 
          />
        </div>

        {/* Large Rectangle Ad */}
        <div className="mb-8">
          <AdSpace size="large-rectangle" />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Read the Graph</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                  <strong>Final BIPs:</strong> Green nodes represent finalized proposals that are part of the Bitcoin protocol
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <strong>Active BIPs:</strong> Blue nodes show currently active proposals
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <strong>Proposed BIPs:</strong> Yellow nodes indicate proposals under consideration
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5"></div>
                <div>
                  <strong>Draft BIPs:</strong> Gray nodes show work-in-progress proposals
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Graph Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Interactive Nodes:</strong> Click on any BIP to view detailed information and navigate to its page
              </div>
              <div>
                <strong>Connection Filtering:</strong> Toggle reference and replacement relationships on/off
              </div>
              <div>
                <strong>Status Filtering:</strong> Filter nodes by BIP status to focus on specific proposal types
              </div>
              <div>
                <strong>Node Sizing:</strong> Larger nodes indicate BIPs with more connections to other proposals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notable Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Hub BIPs:</strong> Look for large nodes that connect many proposals - these are foundational BIPs
              </div>
              <div>
                <strong>Evolution Chains:</strong> Follow replacement relationships to see how ideas evolved over time
              </div>
              <div>
                <strong>Isolated Nodes:</strong> Independent BIPs that don't reference or replace other proposals
              </div>
              <div>
                <strong>Clusters:</strong> Groups of related BIPs addressing similar aspects of Bitcoin
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Leaderboard Ad */}
        <div className="mt-8">
          <AdSpace size="leaderboard" />
        </div>
      </main>

      <Footer />
    </div>
  );
}