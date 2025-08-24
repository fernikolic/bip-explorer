import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  variant?: "hero" | "page";
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  variant = "page",
}: SearchFiltersProps) {
  const clearAllFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onTypeChange("all");
    onSortChange("number");
  };

  const hasActiveFilters = searchTerm || (statusFilter !== "all") || (typeFilter !== "all") || sortBy !== "number";

  const isHero = variant === "hero";
  
  // Scroll to results when used in hero
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (isHero && value) {
      setTimeout(() => {
        document.getElementById('bips-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const content = (
    <>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1">
          {!isHero && (
            <label className="block text-sm font-medium text-foreground mb-2">Search & Filter</label>
          )}
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search by BIP number, title, author, or content..."
              className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-bitcoin-500 focus:border-bitcoin-500 outline-none text-lg ${
                isHero 
                  ? "border-gray-300 text-gray-900 placeholder-gray-500 bg-white"
                  : "border-border"
              }`}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              data-testid="input-search"
            />
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isHero ? "text-gray-400" : "text-muted-foreground"
            }`} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col">
            {!isHero && <label className="text-xs text-muted-foreground mb-1">Status</label>}
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className={`w-40 ${isHero ? "bg-white border-gray-300 text-gray-900" : ""}`} data-testid="select-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
                <SelectItem value="Proposed">Proposed</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Deferred">Deferred</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                <SelectItem value="Obsolete">Obsolete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col">
            {!isHero && <label className="text-xs text-muted-foreground mb-1">Type</label>}
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className={`w-40 ${isHero ? "bg-white border-gray-300 text-gray-900" : ""}`} data-testid="select-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Standards Track">Standards Track</SelectItem>
                <SelectItem value="Informational">Informational</SelectItem>
                <SelectItem value="Process">Process</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col">
            {!isHero && <label className="text-xs text-muted-foreground mb-1">Sort By</label>}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className={`w-36 ${isHero ? "bg-white border-gray-300 text-gray-900" : ""}`} data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">BIP Number</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className={`text-sm ${isHero ? "text-gray-600" : "text-muted-foreground"}`}>Active filters:</span>
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-filter-status">
              Status: {statusFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => onStatusChange("all")}
                data-testid="button-clear-status"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {typeFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-filter-type">
              Type: {typeFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => onTypeChange("all")}
                data-testid="button-clear-type"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-filter-search">
              Search: "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleSearchChange("")}
                data-testid="button-clear-search"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            data-testid="button-clear-all"
          >
            Clear all
          </Button>
        </div>
      )}
    </>
  );

  if (isHero) {
    return content;
  }

  return (
    <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-8" id="search-results">
      {content}
    </section>
  );
}