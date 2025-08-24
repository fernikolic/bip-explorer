import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
    // Scroll to results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-500/10 to-bitcoin-600/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bitcoin-500/5 via-transparent to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90">
            ⚡ Latest Bitcoin Protocol Specifications
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-extralight mb-8 leading-none tracking-tight">
            Bitcoin Improvement
            <br />
            <span className="font-light text-white">
              Proposals
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/70 font-light mb-12 max-w-4xl mx-auto leading-relaxed">
            The definitive resource for understanding how Bitcoin evolves. 
            Explore technical specifications with intelligent summaries designed for professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="w-full sm:w-[28rem]">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search by BIP number, title, or author..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl border-0 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-bitcoin-400 outline-none shadow-elevated font-medium text-lg transition-apple dark:bg-white/95 dark:text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-hero-search"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 dark:text-gray-500" />
              </div>
            </div>
            <Button 
              className="bg-bitcoin-500 hover:bg-bitcoin-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-apple shadow-elevated hover-lift active-scale border-0"
              onClick={handleSearch}
              data-testid="button-start-exploring"
            >
              Explore Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
