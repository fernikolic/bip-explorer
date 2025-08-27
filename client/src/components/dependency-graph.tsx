import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Link } from "wouter";
import { Network, RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  bipNumber: number;
  title: string;
  status: string;
  type: string;
  layer: string;
  categories: string[];
  authors: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'replaces' | 'references';
  label: string;
}

interface D3SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  bipNumber: number;
  title: string;
  status: string;
  type: string;
  layer: string;
  categories: string[];
  authors: string[];
}

interface D3SimulationLink extends d3.SimulationLinkDatum<D3SimulationNode> {
  id: string;
  source: string | D3SimulationNode;
  target: string | D3SimulationNode;
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

// Helper functions moved outside component to avoid circular dependencies
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

const getNodeSize = (node: GraphNode, edges: GraphEdge[]) => {
  // Size nodes based on how many connections they have
  const connections = edges.filter(e => 
    e.source === node.id || e.target === node.id
  ).length;
  return Math.max(8, Math.min(20, 8 + connections * 2));
};

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
  const [zoom, setZoom] = useState<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<D3SimulationNode, D3SimulationLink> | null>(null);

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

  const renderGraph = useCallback(() => {
    try {
      if (!filteredData || !filteredData.nodes.length) return;
      
      // Multiple safety checks for SVG element
      const svgElement = svgRef.current;
      if (!svgElement || !svgElement.getBoundingClientRect) return;
      
      // Wait for DOM to be ready
      requestAnimationFrame(() => {
        try {
          const currentSvg = svgRef.current;
          if (!currentSvg || !currentSvg.getBoundingClientRect) return;

      const svg = d3.select(currentSvg);
      const rect = currentSvg.getBoundingClientRect();
      const width = rect.width || 800;
      const containerHeight = rect.height || 600;

      // Clear previous graph
      svg.selectAll("*").remove();

      // Create container group for zooming/panning
      const container = svg.append("g");

      // Setup zoom behavior
      const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
        });

      svg.call(zoomBehavior);
      setZoom(zoomBehavior);

      // Prepare nodes and links for simulation
      const nodes: D3SimulationNode[] = filteredData.nodes.map(node => ({
        ...node,
        x: Math.random() * width,
        y: Math.random() * containerHeight
      }));

      const links: D3SimulationLink[] = filteredData.edges.map(edge => ({
        ...edge,
        source: edge.source,
        target: edge.target
      }));

      // Create force simulation
      const simulation = d3.forceSimulation<D3SimulationNode>(nodes)
        .force("link", d3.forceLink<D3SimulationNode, D3SimulationLink>(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, containerHeight / 2))
        .force("collision", d3.forceCollide().radius(d => getNodeSize(d, filteredData.edges) + 5));

      simulationRef.current = simulation;

      // Create links
      const link = container.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", d => d.type === 'replaces' ? '#ef4444' : '#3b82f6')
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2);

      // Create nodes
      const node = container.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => getNodeSize(d, filteredData.edges))
        .attr("fill", d => getStatusColor(d.status))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .call(d3.drag<SVGCircleElement, D3SimulationNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }))
        .on("click", (event, d) => {
          setSelectedNode(d);
        });

      // Add hover effects
      node
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke-width", 3)
            .attr("r", getNodeSize(d, filteredData.edges) + 2);
        })
        .on("mouseout", function(event, d) {
          d3.select(this)
            .attr("stroke-width", 2)
            .attr("r", getNodeSize(d, filteredData.edges));
        });

      // Add labels for important nodes
      const label = container.append("g")
        .selectAll("text")
        .data(nodes.filter(d => getNodeSize(d, filteredData.edges) > 12))
        .join("text")
        .text(d => `BIP ${d.bipNumber}`)
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .attr("fill", "#374151")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("pointer-events", "none");

      // Update positions on simulation tick
      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as D3SimulationNode).x!)
          .attr("y1", d => (d.source as D3SimulationNode).y!)
          .attr("x2", d => (d.target as D3SimulationNode).x!)
          .attr("y2", d => (d.target as D3SimulationNode).y!);

        node
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);

        label
          .attr("x", d => d.x!)
          .attr("y", d => d.y!);
      });

      // Focus on specific BIP if provided
      if (focusedBip) {
        const focusedNode = nodes.find(n => n.bipNumber === focusedBip);
        if (focusedNode) {
          // Highlight focused node and its connections
          node.attr("opacity", d => 
            d.bipNumber === focusedBip || 
            links.some(l => 
              ((l.source as D3SimulationNode).id === d.id && (l.target as D3SimulationNode).bipNumber === focusedBip) ||
              ((l.target as D3SimulationNode).id === d.id && (l.source as D3SimulationNode).bipNumber === focusedBip)
            ) ? 1 : 0.3
          );

          link.attr("opacity", d => 
            (d.source as D3SimulationNode).bipNumber === focusedBip || 
            (d.target as D3SimulationNode).bipNumber === focusedBip ? 1 : 0.1
          );
        }
          }
        } catch (error) {
          console.error('Error in D3 graph rendering:', error);
        }
      });
    } catch (error) {
      console.error('Error in renderGraph:', error);
    }
  }, [filteredData, height, focusedBip]);

  useEffect(() => {
    try {
      // Add delay to ensure DOM is fully mounted
      const timeout = setTimeout(() => {
        try {
          if (data && filteredData && svgRef.current) {
            renderGraph();
          }
        } catch (error) {
          console.error('Error in useEffect renderGraph call:', error);
        }
      }, 100);

      return () => {
        clearTimeout(timeout);
        try {
          if (simulationRef.current) {
            simulationRef.current.stop();
          }
        } catch (error) {
          console.error('Error stopping simulation:', error);
        }
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [data, filteredData, renderGraph]);

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
        
        {/* Interactive D3.js Graph */}
        <div 
          className="w-full border border-border rounded-lg bg-background relative overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {showControls && zoom && (
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoom.scaleBy(d3.select(svgRef.current), 1.2)}
                className="p-2"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoom.scaleBy(d3.select(svgRef.current), 0.8)}
                className="p-2"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoom.transform(d3.select(svgRef.current), d3.zoomIdentity)}
                className="p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%"
            className="w-full h-full"
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