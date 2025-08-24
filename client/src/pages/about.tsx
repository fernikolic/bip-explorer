import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { useSEO } from "../hooks/use-seo";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ExternalLink, Github, Book, Search, Users, Zap, Shield, Globe } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Book className="w-8 h-8 text-bitcoin-600" />,
      title: "Comprehensive BIP Database",
      description: "Access all Bitcoin Improvement Proposals with real-time data from the official GitHub repository."
    },
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Advanced Search & Filtering",
      description: "Find specific BIPs using our powerful search engine with filters by status, type, and author."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Author Profiles",
      description: "Discover the contributors behind Bitcoin's evolution and explore their work."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Intelligent Explanations",
      description: "Get AI-powered summaries that make complex technical concepts accessible to professionals."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Authentic Data",
      description: "100% authentic content sourced directly from Bitcoin's official development repository."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Educational Focus",
      description: "Designed as a learning resource for understanding Bitcoin's technical evolution."
    }
  ];

  // SEO implementation
  useSEO({
    title: 'About BIP Explorer - Bitcoin Improvement Proposals Educational Platform',
    description: 'Learn about BIP Explorer, the comprehensive educational resource for Bitcoin Improvement Proposals featuring authentic GitHub data and intelligent explanations.',
    keywords: 'about BIP Explorer, Bitcoin education, BIP directory platform, Bitcoin improvement proposals guide',
    canonicalUrl: 'https://bip-explorer.com/about',
    ogType: 'website'
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-500/10 to-bitcoin-600/10" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extralight mb-6 leading-tight tracking-tight text-foreground">
              About BIP Explorer
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Your comprehensive guide to understanding how Bitcoin evolves through 
              community-driven technical specifications and improvements.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-light text-foreground mb-6 tracking-tight">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              BIP Explorer makes Bitcoin's technical evolution accessible to everyone. We provide 
              intelligent summaries and comprehensive search capabilities to help you understand 
              how Bitcoin's protocol develops through community consensus.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="text-4xl font-light text-foreground mb-12 text-center tracking-tight">
            Platform Features
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index} className="rounded-2xl shadow-subtle hover:shadow-moderate border border-gray-100 transition-apple hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* What are BIPs Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 lg:p-12">
            <h2 className="text-4xl font-light text-foreground mb-6 text-center tracking-tight">
              What are Bitcoin Improvement Proposals?
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-foreground text-lg leading-relaxed">
              <p>
                Bitcoin Improvement Proposals (BIPs) are design documents that provide information 
                to the Bitcoin community, or describe new features for Bitcoin or its processes 
                or environment.
              </p>
              <p>
                Each BIP contains a technical specification and rationale for the proposed change. 
                BIPs are the primary mechanism for proposing new features, collecting community 
                input on issues, and documenting design decisions.
              </p>
              <p>
                The BIP process allows for systematic evolution of the Bitcoin protocol while 
                maintaining decentralization and community consensus. Anyone can submit a BIP, 
                making it a truly open and collaborative development process.
              </p>
            </div>
          </div>
        </section>

        {/* Data Source Section */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Authentic & Up-to-Date
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              All data is sourced directly from the official Bitcoin BIPs repository, 
              ensuring accuracy and authenticity.
            </p>
            <Button 
              className="inline-flex items-center gap-3 bg-bitcoin-500 hover:bg-bitcoin-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-apple shadow-moderate hover-lift"
              onClick={() => window.open('https://github.com/bitcoin/bips', '_blank')}
            >
              <Github className="w-5 h-5" />
              View Official Repository
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="rounded-3xl shadow-subtle border-0">
              <CardContent className="p-10">
                <h3 className="text-2xl font-light text-foreground mb-4">
                  Technical Architecture
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Real-time GitHub API integration</li>
                  <li>• Advanced full-text search with Fuse.js</li>
                  <li>• Responsive design with Apple-inspired UI</li>
                  <li>• AI-powered technical summaries</li>
                  <li>• Automatic cache refresh every 15 minutes</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl shadow-subtle border-0">
              <CardContent className="p-10">
                <h3 className="text-2xl font-light text-foreground mb-4">
                  Content Processing
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Automatic MediaWiki & Markdown parsing</li>
                  <li>• Metadata extraction and normalization</li>
                  <li>• Author contribution tracking</li>
                  <li>• Status and category analysis</li>
                  <li>• Cross-reference linking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}