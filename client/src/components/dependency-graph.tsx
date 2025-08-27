import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Link } from "wouter";
import { Network, RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react";

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

interface DependencyGraphProps {
  focusedBip?: number;
  height?: number;
  showControls?: boolean;
}

export default function DependencyGraph({ 
  focusedBip, 
  height = 600, 
  showControls = true 
}: DependencyGraphProps) {
  const [data, setData] = useState<DependencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterBy, setFilterBy] = useState<string>("all");
  const [showReferences, setShowReferences] = useState(true);
  const [showReplaces, setShowReplaces] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchDependencyData();
  }, []);

  const fetchDependencyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dependencies');
      if (!response.ok) {
        throw new Error('Failed to fetch dependency data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return '#22c55e'; // green
      case 'active': return '#3b82f6'; // blue  
      case 'proposed': return '#f59e0b'; // amber
      case 'draft': return '#6b7280'; // gray
      case 'deferred': return '#8b5cf6'; // purple
      case 'rejected': return '#ef4444'; // red
      case 'withdrawn': return '#9ca3af'; // gray-400
      case 'replaced': return '#f97316'; // orange
      case 'obsolete': return '#6b7280'; // gray
      default: return '#6b7280'; // gray
    }
  };

  const getNodeSize = (node: GraphNode) => {
    // Size nodes based on how many connections they have
    if (!data) return 8;
    const connections = data.edges.filter(e => 
      e.source === node.id || e.target === node.id
    ).length;
    return Math.max(8, Math.min(20, 8 + connections * 2));
  };

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
            <Skeleton className={`h-${height / 4} w-full`} />
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
        
        {/* Graph Placeholder - Will be implemented with D3.js */}
        <div 
          className="w-full border border-border rounded-lg bg-background relative overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
            <div className="text-center space-y-4">
              <Network className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Graph Visualization</h3>
                <p className="text-muted-foreground text-sm">
                  Interactive dependency graph will be rendered here
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredData.nodes.length} nodes, {filteredData.edges.length} edges
                </p>
              </div>
            </div>
          </div>
          
          {/* SVG will be mounted here */}
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%"
            className="absolute inset-0"
          />
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
                  <Badge 
                    style={{ backgroundColor: getStatusColor(selectedNode.status) }}
                    className="text-white"
                  >
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
              <span>Node size indicates connection count</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}