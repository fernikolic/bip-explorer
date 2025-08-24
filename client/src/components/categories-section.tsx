import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Settings, Info, Workflow, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import type { Stats } from "@shared/schema";

export default function CategoriesSection() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });
  
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <Card className="p-4">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid="card-standards-track">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Standards Track</h4>
                    <p className="text-sm text-muted-foreground mt-1">Protocol specifications</p>
                    <span className="text-2xl font-bold text-purple-600 mt-2 block" data-testid="text-standards-count">
                      {stats?.standardsTrack || 0}
                    </span>
                  </div>
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid="card-informational">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Informational</h4>
                    <p className="text-sm text-muted-foreground mt-1">Educational content</p>
                    <span className="text-2xl font-bold text-blue-600 mt-2 block" data-testid="text-informational-count">
                      {stats?.informational || 0}
                    </span>
                  </div>
                  <Info className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid="card-process">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Process</h4>
                    <p className="text-sm text-muted-foreground mt-1">Development procedures</p>
                    <span className="text-2xl font-bold text-green-600 mt-2 block" data-testid="text-process-count">
                      {stats?.process || 0}
                    </span>
                  </div>
                  <Workflow className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid="card-final-status">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Final Status</h4>
                    <p className="text-sm text-muted-foreground mt-1">Accepted proposals</p>
                    <span className="text-2xl font-bold text-bitcoin-600 mt-2 block" data-testid="text-final-status-count">
                      {stats?.finalBips || 0}
                    </span>
                  </div>
                  <CheckCircle className="w-8 h-8 text-bitcoin-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h3>
          <Card className="border border-border p-4">
            <CardContent className="p-0">
              <div className="space-y-4">
                <div className="flex items-start space-x-3" data-testid="update-recent-1">
                  <div className="w-2 h-2 bg-bitcoin-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">BIP 327 Updated</p>
                    <p className="text-xs text-muted-foreground">MuSig2 specification revised</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3" data-testid="update-recent-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">BIP 345 Proposed</p>
                    <p className="text-xs text-muted-foreground">OP_VAULT implementation</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3" data-testid="update-recent-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">BIP 324 Final</p>
                    <p className="text-xs text-muted-foreground">v2 transport encryption</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2 weeks ago
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="link" 
                className="w-full mt-4 text-sm text-bitcoin-600 hover:text-bitcoin-700 font-medium p-0" 
                data-testid="button-view-all-updates"
                onClick={() => setLocation('/search?sort=created')}
              >
                View All Updates
              </Button>
            </CardContent>
          </Card>
        </div>
    </section>
  );
}
