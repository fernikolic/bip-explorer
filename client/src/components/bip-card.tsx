import { Link } from "wouter";
import { Badge } from "./ui/badge";
import { ExternalLink, User, Calendar } from "lucide-react";
import type { Bip } from "@shared/schema";

interface BipCardProps {
  bip: Bip;
}

export default function BipCard({ bip }: BipCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'deferred': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'standards track': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'informational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'process': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full bg-card rounded-3xl shadow-subtle hover:shadow-prominent border border-border transition-apple hover-lift overflow-hidden" data-testid={`card-bip-${bip.number}`}>
      <div className="p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-muted rounded-2xl flex items-center justify-center shadow-subtle">
              <span className="text-foreground font-light text-xl lg:text-2xl" data-testid={`text-bip-number-${bip.number}`}>
                {bip.number}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/bip/${bip.number}`}>
                    <h3 className="text-xl lg:text-2xl font-light text-foreground hover:text-muted-foreground cursor-pointer transition-apple leading-tight line-clamp-2" data-testid={`text-bip-title-${bip.number}`}>
                      {bip.title}
                    </h3>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                  <Badge className={`${getStatusColor(bip.status)} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`} data-testid={`badge-status-${bip.number}`}>
                    {bip.status}
                  </Badge>
                  <Badge className={`${getTypeColor(bip.type)} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`} data-testid={`badge-type-${bip.number}`}>
                    {bip.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-muted-foreground text-base lg:text-lg font-light leading-relaxed line-clamp-3" data-testid={`text-bip-abstract-${bip.number}`}>
                {bip.eli5 || bip.abstract}
              </p>
            </div>
            
            {/* Modern Apple-inspired metadata section */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Author Card */}
              <div className="group flex items-center gap-3 bg-gray-50/60 dark:bg-gray-900/30 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all duration-200 flex-1 sm:flex-initial">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                    Author
                  </div>
                  <div className="truncate" data-testid={`text-authors-${bip.number}`}>
                    {bip.authors.slice(0, 2).map((author, index) => (
                      <span key={author}>
                        <Link href={`/author/${encodeURIComponent(author)}`}>
                          <span className="text-gray-700 dark:text-gray-300 hover:text-bitcoin-600 dark:hover:text-bitcoin-400 font-medium cursor-pointer transition-colors text-sm">
                            {author}
                          </span>
                        </Link>
                        {index < Math.min(bip.authors.length, 2) - 1 && ', '}
                      </span>
                    ))}
                    {bip.authors.length > 2 && (
                      <span className="text-gray-400 dark:text-gray-500 text-sm"> +{bip.authors.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date Card */}
              <div className="flex items-center gap-3 bg-gray-50/60 dark:bg-gray-900/30 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all duration-200 flex-1 sm:flex-initial">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                    Created
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium text-sm whitespace-nowrap" data-testid={`text-created-${bip.number}`}>
                    {bip.created}
                  </div>
                </div>
              </div>

              {/* View Source Card */}
              <a 
                href={bip.githubUrl} 
                className="group flex items-center gap-3 bg-bitcoin-50/60 dark:bg-bitcoin-950/20 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-bitcoin-100/80 dark:hover:bg-bitcoin-900/30 transition-all duration-200 flex-1 sm:flex-initial" 
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-github-${bip.number}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-bitcoin-500 to-bitcoin-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-bitcoin-600/70 dark:text-bitcoin-400/70 uppercase tracking-wider mb-0.5 group-hover:text-bitcoin-600 dark:group-hover:text-bitcoin-400 transition-colors">
                    GitHub
                  </div>
                  <div className="text-bitcoin-700 dark:text-bitcoin-300 font-medium text-sm whitespace-nowrap group-hover:text-bitcoin-800 dark:group-hover:text-bitcoin-200 transition-colors">
                    View Source
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
