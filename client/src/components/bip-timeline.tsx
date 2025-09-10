import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  GitCommit, 
  Clock, 
  FileText, 
  User, 
  GitBranch, 
  History,
  ExternalLink,
  Calendar,
  AlertCircle,
  Zap,
  Edit,
  Move
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface TimelineEvent {
  date: string;
  type: 'created' | 'status_change' | 'major_revision' | 'author_change' | 'file_rename';
  title: string;
  author: string;
  commit_sha: string;
  message?: string;
  additions?: number;
  deletions?: number;
  files_changed?: number;
}

interface BipTimeline {
  bipNumber: number;
  events: TimelineEvent[];
  firstCommit: string;
  lastUpdated: string;
  totalCommits: number;
}

interface BipTimelineProps {
  bipNumber: number;
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created':
      return <FileText className="w-4 h-4" />;
    case 'status_change':
      return <Zap className="w-4 h-4" />;
    case 'major_revision':
      return <Edit className="w-4 h-4" />;
    case 'author_change':
      return <User className="w-4 h-4" />;
    case 'file_rename':
      return <Move className="w-4 h-4" />;
    default:
      return <GitCommit className="w-4 h-4" />;
  }
};

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created':
      return 'from-green-400 to-emerald-500';
    case 'status_change':
      return 'from-blue-400 to-cyan-500';
    case 'major_revision':
      return 'from-purple-400 to-violet-500';
    case 'author_change':
      return 'from-orange-400 to-amber-500';
    case 'file_rename':
      return 'from-gray-400 to-slate-500';
    default:
      return 'from-gray-400 to-slate-500';
  }
};

const getEventBadgeColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'status_change':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'major_revision':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'author_change':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'file_rename':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
  }
};

const formatEventType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'created':
      return 'Created';
    case 'status_change':
      return 'Status Change';
    case 'major_revision':
      return 'Major Revision';
    case 'author_change':
      return 'Author Change';
    case 'file_rename':
      return 'File Moved';
    default:
      return 'Update';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function BipTimeline({ bipNumber }: BipTimelineProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  
  const { data: timeline, isLoading, error } = useQuery<BipTimeline>({
    queryKey: ['bip-timeline', bipNumber],
    queryFn: async () => {
      const response = await fetch(`/api/bips/${bipNumber}/timeline`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline');
      }
      return response.json();
    },
  });

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-pink-50/40 to-red-50/60 dark:bg-black rounded-3xl" />
        
        <div className="relative bg-white/90 dark:bg-black backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-red-500/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Timeline & Version History
              </h2>
              <div className="text-sm text-muted-foreground">
                Unable to load timeline data
              </div>
            </div>
          </div>
          
          <div className="pl-16">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load timeline data. This may be due to GitHub API limits or the BIP file not being found in the repository.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-zinc-50/80 dark:bg-black rounded-3xl" />
        
        <div className="relative bg-white/90 dark:bg-black backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-slate-500/5">
          <div className="flex items-start gap-4 mb-6">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          <div className="pl-16 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!timeline || timeline.events.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-yellow-50/60 dark:bg-black rounded-3xl" />
        
        <div className="relative bg-white/90 dark:bg-black backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-amber-500/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Timeline & Version History
              </h2>
              <div className="text-sm text-muted-foreground">
                No timeline data available for this BIP
              </div>
            </div>
          </div>
          
          <div className="pl-16">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:bg-black rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <p className="text-amber-700 dark:text-amber-300 font-medium">
                Timeline data is not available for this BIP. This may be a newly added BIP or the file may not be tracked in the main repository.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayedEvents = showAllEvents ? timeline.events : timeline.events.slice(0, 5);
  const hasMoreEvents = timeline.events.length > 5;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-zinc-50/80 dark:bg-black rounded-3xl" />
      
      <div className="relative bg-white/90 dark:bg-black backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl shadow-slate-500/5">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-500 to-zinc-600 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-500/20">
            <History className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Timeline & Version History
            </h2>
            <div className="text-sm text-muted-foreground">
              Complete development history from GitHub commits
            </div>
          </div>
        </div>

        {/* Timeline Stats */}
        <div className="pl-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 dark:bg-black backdrop-blur-xl rounded-2xl border border-border/30 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <GitCommit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Commits</div>
                  <div className="text-lg font-bold text-foreground">{timeline.totalCommits}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-black backdrop-blur-xl rounded-2xl border border-border/30 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">First Commit</div>
                  <div className="text-sm font-bold text-foreground">
                    {timeline.events[0] ? formatDate(timeline.events[0].date) : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-black backdrop-blur-xl rounded-2xl border border-border/30 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div className="text-sm font-bold text-foreground">
                    {timeline.lastUpdated ? formatDate(timeline.lastUpdated) : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="pl-16">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-zinc-400 dark:from-slate-600 dark:to-zinc-700" />
            
            <div className="space-y-8">
              {displayedEvents.map((event, index) => (
                <div key={`${event.commit_sha}-${index}`} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-10 h-10 bg-gradient-to-br ${getEventColor(event.type)} rounded-xl flex items-center justify-center shadow-lg`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white/80 dark:bg-black backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-lg hover:shadow-slate-500/10 transition-all duration-200">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`${getEventBadgeColor(event.type)} border-none`}>
                              {formatEventType(event.type)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="w-3 h-3" />
                              {event.author}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDateTime(event.date)}
                            </div>
                          </div>
                        </div>
                        
                        <a
                          href={`https://github.com/bitcoin/bips/commit/${event.commit_sha}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-800/80 border border-border/50 rounded-xl font-medium text-sm text-foreground transition-all duration-200 hover:shadow-md hover:scale-105 group"
                        >
                          <GitBranch className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
                          {event.commit_sha.slice(0, 7)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      {/* Commit message */}
                      {event.message && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {event.message}
                          </p>
                        </div>
                      )}
                      
                      {/* Stats */}
                      {(event.additions !== undefined || event.deletions !== undefined) && (
                        <div className="flex items-center gap-4 text-xs">
                          {event.additions !== undefined && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <span className="w-2 h-2 bg-green-500 rounded-full" />
                              +{event.additions}
                            </div>
                          )}
                          {event.deletions !== undefined && (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <span className="w-2 h-2 bg-red-500 rounded-full" />
                              -{event.deletions}
                            </div>
                          )}
                          {event.files_changed !== undefined && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <FileText className="w-3 h-3" />
                              {event.files_changed} file{event.files_changed !== 1 ? 's' : ''} changed
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Show more button */}
          {hasMoreEvents && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="bg-white/60 dark:bg-black backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-800/80 border border-border/50"
              >
                {showAllEvents ? 'Show Less' : `Show ${timeline.events.length - 5} More Events`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}