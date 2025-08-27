import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Link } from "wouter";
import { Network, RotateCcw, Info } from "lucide-react";

interface GraphNode {
  id: string;
  bipNumber: number;
  title: string;
  status: string;
  type: string;
  layer: string;
  categories: string[];
  authors: string[];
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'replaces' | 'references';
  label: string;
}

interface DependencyData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    totalNodes: number;
    totalEdges: number;
    replacesRelations: number;
    referencesRelations: number;
    connectedNodes: number;
  };
}

interface SimpleDependencyGraphProps {
  focusedBip?: number;
  height?: number;
  showControls?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'final': return 'bg-green-500';
    case 'active': return 'bg-blue-500';  
    case 'proposed': return 'bg-amber-500';
    case 'draft': return 'bg-gray-500';
    case 'deferred': return 'bg-purple-500';
    case 'rejected': return 'bg-red-500';
    case 'withdrawn': return 'bg-gray-400';
    case 'replaced': return 'bg-orange-500';
    case 'obsolete': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export default function SimpleDependencyGraph({ 
  focusedBip, 
  height = 600, 
  showControls = true 
}: SimpleDependencyGraphProps) {
  const [data, setData] = useState<DependencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterBy, setFilterBy] = useState<string>("all");
  const [showReferences, setShowReferences] = useState(true);
  const [showReplaces, setShowReplaces] = useState(true);

  const fetchDependencyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dependencies');
      if (!response.ok) {
        throw new Error('Failed to fetch dependency data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Dependency data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencyData();
  }, []);

  const filteredData = data ? {
    ...data,
    nodes: data.nodes.filter(node => {
      if (filterBy === "all") return true;
      if (filterBy === "connected") {
        return data.edges.some(e => e.source === node.id || e.target === node.id);
      }
      return node.status.toLowerCase() === filterBy.toLowerCase();
    }),
    edges: data.edges.filter(edge => {
      if (!showReferences && edge.type === 'references') return false;
      if (!showReplaces && edge.type === 'replaces') return false;
      return true;
    })
  } : null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            BIP Dependency Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            BIP Dependency Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 dark:text-red-400">
            Error loading dependency graph: {error}
          </div>
          <Button 
            onClick={fetchDependencyData} 
            variant="outline" 
            className="mt-2"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || !filteredData) {
    return null;
  }

  // Get connected nodes for focused view
  const connectedNodes = focusedBip ? filteredData.nodes.filter(node => {
    if (node.bipNumber === focusedBip) return true;
    return filteredData.edges.some(edge => 
      (edge.source === node.id && filteredData.nodes.find(n => n.id === edge.target)?.bipNumber === focusedBip) ||
      (edge.target === node.id && filteredData.nodes.find(n => n.id === edge.source)?.bipNumber === focusedBip)
    );
  }) : filteredData.nodes;

  const displayNodes = focusedBip ? connectedNodes : filteredData.nodes.slice(0, 50); // Limit for performance

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          BIP Dependency Graph
        </CardTitle>
        {data.stats && (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{data.stats.totalNodes} BIPs</Badge>
            <Badge variant="outline">{data.stats.totalEdges} connections</Badge>
            <Badge variant="outline">{data.stats.connectedNodes} connected</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {showControls && (
          <div className="mb-4 p-4 bg-muted/20 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filter-select" className="text-sm font-medium">Filter by Status</Label>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger id="filter-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All BIPs</SelectItem>
                    <SelectItem value="connected">Connected Only</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-references" 
                  checked={showReferences} 
                  onCheckedChange={setShowReferences}
                />
                <Label htmlFor="show-references" className="text-sm">
                  Show References ({data.stats.referencesRelations})
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-replaces" 
                  checked={showReplaces} 
                  onCheckedChange={setShowReplaces}
                />
                <Label htmlFor="show-replaces" className="text-sm">
                  Show Replaces ({data.stats.replacesRelations})
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Simple Grid-based Visualization */}
        <div 
          className="w-full border border-border rounded-lg bg-background p-4 overflow-auto"
          style={{ height: `${height}px` }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {displayNodes.map(node => {
              const connectionCount = filteredData.edges.filter(e => 
                e.source === node.id || e.target === node.id
              ).length;
              
              const isHighlighted = focusedBip ? node.bipNumber === focusedBip : false;
              
              return (
                <Link key={node.id} href={`/bip/${node.bipNumber}`}>
                  <div 
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all duration-200
                      hover:shadow-md hover:scale-105 hover:border-primary/50
                      ${isHighlighted ? 'ring-2 ring-primary shadow-lg' : ''}
                      ${connectionCount > 3 ? 'border-2' : ''}
                    `}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                      <span className="font-mono text-xs text-muted-foreground">
                        BIP {node.bipNumber}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">
                      {node.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {node.status}
                      </Badge>
                      {connectionCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {connectionCount} links
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {!focusedBip && filteredData.nodes.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing first 50 BIPs. Use filters to narrow results.
            </div>
          )}
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/bip/${selectedNode.bipNumber}`}>
                  <h4 className="font-semibold hover:text-primary cursor-pointer">
                    BIP {selectedNode.bipNumber}: {selectedNode.title}
                  </h4>
                </Link>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={`${getStatusColor(selectedNode.status)} text-white`}>
                    {selectedNode.status}
                  </Badge>
                  <Badge variant="outline">{selectedNode.type}</Badge>
                  <Badge variant="outline">{selectedNode.layer}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Authors: {selectedNode.authors.join(', ')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/10 rounded text-xs text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>References</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Replaces</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3" />
              <span>Thick border indicates high connectivity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}