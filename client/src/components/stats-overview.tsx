import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { Stats } from "@shared/schema";

export default function StatsOverview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/refresh', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to refresh data');
      }
      return response.json();
    },
    onSuccess: (data: { count: number; timestamp: string }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bips'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Data Refreshed",
        description: `Updated ${data.count} BIPs from GitHub at ${new Date(data.timestamp).toLocaleTimeString()}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Failed to fetch latest data from GitHub. Please try again.",
      });
    },
  });

  if (isLoading) {
    return (
      <section className="mb-20">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-12">
          <div className="text-lg text-gray-500 font-light">
            Live data from the official Bitcoin BIPs repository, updated every 15 minutes
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-10 rounded-3xl shadow-subtle hover:shadow-prominent border border-border bg-card dark:bg-black transition-apple">
              <CardContent className="p-0 text-center">
                <Skeleton className="h-12 w-20 mb-4 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="mb-20">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-12">
        <div className="text-lg text-gray-500 font-light">
          Live data from the official Bitcoin BIPs repository, updated every 15 minutes
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          className="flex items-center gap-3 px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50 transition-apple font-medium"
          data-testid="button-refresh-data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          {refreshMutation.isPending ? 'Updating...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      <Card className="p-10 rounded-3xl shadow-subtle hover:shadow-prominent border border-border bg-card dark:bg-black transition-apple hover-lift" data-testid="card-total-bips">
        <CardContent className="p-0 text-center">
          <div className="text-5xl font-light text-foreground mb-4 tracking-tight" data-testid="text-total-bips">
            {stats.totalBips}
          </div>
          <div className="text-sm text-muted-foreground font-normal uppercase tracking-wide">Total Proposals</div>
        </CardContent>
      </Card>
      
      <Card className="p-10 rounded-3xl shadow-subtle hover:shadow-prominent border border-border bg-card dark:bg-black transition-apple hover-lift" data-testid="card-final-bips">
        <CardContent className="p-0 text-center">
          <div className="text-5xl font-light text-foreground mb-4 tracking-tight" data-testid="text-final-bips">
            {stats.finalBips}
          </div>
          <div className="text-sm text-muted-foreground font-normal uppercase tracking-wide">Final Status</div>
        </CardContent>
      </Card>
      
      <Card className="p-10 rounded-3xl shadow-subtle hover:shadow-prominent border border-border bg-card dark:bg-black transition-apple hover-lift" data-testid="card-active-bips">
        <CardContent className="p-0 text-center">
          <div className="text-5xl font-light text-foreground mb-4 tracking-tight" data-testid="text-active-bips">
            {stats.activeBips}
          </div>
          <div className="text-sm text-muted-foreground font-normal uppercase tracking-wide">Active & Draft</div>
        </CardContent>
      </Card>
      
      <Card className="p-10 rounded-3xl shadow-subtle hover:shadow-prominent border border-border bg-card dark:bg-black transition-apple hover-lift" data-testid="card-contributors">
        <CardContent className="p-0 text-center">
          <div className="text-5xl font-light text-foreground mb-4 tracking-tight" data-testid="text-contributors">
            {stats.contributors}
          </div>
          <div className="text-sm text-muted-foreground font-normal uppercase tracking-wide">Contributors</div>
        </CardContent>
      </Card>
      </div>
    </section>
  );
}
