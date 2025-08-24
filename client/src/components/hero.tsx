import SearchFilters from "./search-filters";

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function Hero({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
}: HeroProps) {
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
          
          {/* Advanced Search and Filters */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-elevated">
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                statusFilter={statusFilter}
                onStatusChange={onStatusChange}
                typeFilter={typeFilter}
                onTypeChange={onTypeChange}
                sortBy={sortBy}
                onSortChange={onSortChange}
                variant="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}