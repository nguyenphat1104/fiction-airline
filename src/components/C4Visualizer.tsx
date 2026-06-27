import React, { useState, useMemo } from 'react';
import { C4ModelData, C4Node } from '../types';
import { Layers, User, Server, Database, Info, HelpCircle } from 'lucide-react';

interface C4VisualizerProps {
  c4Model: C4ModelData;
}

export default function C4Visualizer({ c4Model }: C4VisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<C4Node | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const canvasWidth = 840;
  const canvasHeight = 460;
  const nodeWidth = 190;
  const nodeHeight = 85;

  // Layered layout calculation
  const positionedNodes = useMemo(() => {
    const { nodes } = c4Model;
    if (!nodes || nodes.length === 0) return [];

    // Separate into 3 layers
    const topLayer: C4Node[] = [];    // Persons / Actors
    const middleLayer: C4Node[] = []; // Frontends, APIs, Web Containers
    const bottomLayer: C4Node[] = []; // Databases, External Software Systems, Message Brokers

    nodes.forEach((node) => {
      const nameLower = node.name.toLowerCase();
      const techLower = (node.technology || '').toLowerCase();
      
      if (node.type === 'person') {
        topLayer.push(node);
      } else if (
        node.type === 'container' &&
        (nameLower.includes('db') ||
          nameLower.includes('database') ||
          nameLower.includes('cache') ||
          nameLower.includes('store') ||
          nameLower.includes('repository') ||
          techLower.includes('sql') ||
          techLower.includes('mongo') ||
          techLower.includes('redis'))
      ) {
        bottomLayer.push(node);
      } else if (node.type === 'software_system') {
        // External third-party systems go to bottom layer
        bottomLayer.push(node);
      } else {
        middleLayer.push(node);
      }
    });

    // Fallback if middle or bottom are completely empty
    if (middleLayer.length === 0 && bottomLayer.length > 0) {
      // transfer half of bottom to middle
      const half = Math.ceil(bottomLayer.length / 2);
      middleLayer.push(...bottomLayer.splice(0, half));
    }

    const layers = [topLayer, middleLayer, bottomLayer];
    const computedNodes: (C4Node & { x: number; y: number; layerIndex: number })[] = [];

    layers.forEach((layer, layerIndex) => {
      const N = layer.length;
      if (N === 0) return;

      // Calculate Y coordinate based on layer
      // layer 0 = 40, layer 1 = 190, layer 2 = 340
      const y = 45 + layerIndex * 150;

      layer.forEach((node, idx) => {
        // Calculate X coordinate to distribute evenly
        const x = (idx + 0.5) * (canvasWidth / N) - nodeWidth / 2;
        computedNodes.push({
          ...node,
          x,
          y,
          layerIndex
        });
      });
    });

    return computedNodes;
  }, [c4Model]);

  // Find node coordinates by ID
  const nodeCoords = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    positionedNodes.forEach((node) => {
      coords[node.id] = {
        x: node.x + nodeWidth / 2,
        y: node.y + nodeHeight / 2
      };
    });
    return coords;
  }, [positionedNodes]);

  // Render proper icon for node type
  const getNodeIcon = (type: string, name: string) => {
    const nameLower = name.toLowerCase();
    if (type === 'person') return <User className="w-5 h-5 text-indigo-400" />;
    if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis')) {
      return <Database className="w-5 h-5 text-emerald-400" />;
    }
    return <Server className="w-5 h-5 text-blue-400" />;
  };

  // Border/Bg classes depending on node type
  const getNodeStyleClasses = (node: C4Node, isSelected: boolean, isHovered: boolean) => {
    const activeRing = isSelected 
      ? 'ring-2 ring-indigo-500 border-indigo-400 shadow-indigo-900/40 bg-indigo-950/40' 
      : isHovered 
      ? 'border-indigo-500/80 shadow-indigo-950/20 bg-slate-800/90'
      : 'border-slate-800 bg-slate-900/90';

    if (node.type === 'person') {
      return `${activeRing} border-t-4 border-t-indigo-500 rounded-lg text-slate-100`;
    }
    if (node.name.toLowerCase().includes('database') || node.name.toLowerCase().includes('db')) {
      return `${activeRing} border-t-4 border-t-emerald-500 rounded-lg text-slate-100`;
    }
    return `${activeRing} border-t-4 border-t-blue-500 rounded-lg text-slate-100`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full" id="c4-visualizer-section">
      {/* Interactive Diagram Stage */}
      <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-200 font-sans">
              Interactive C4 Container Map (Level 2)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> Person
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> Container
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Database
            </span>
          </div>
        </div>

        {/* The Map Arena */}
        <div 
          className="relative flex-1 rounded-xl bg-slate-900/40 border border-slate-900/60 overflow-x-auto overflow-y-hidden"
          style={{ height: `${canvasHeight}px` }}
        >
          <div 
            style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
            className="relative mx-auto"
          >
            {/* SVG Relationship Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#4f46e5" />
                </marker>
                <marker
                  id="arrow-hover"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                </marker>
              </defs>

              {/* Render Relations */}
              {c4Model.relations && c4Model.relations.map((relation, idx) => {
                const source = nodeCoords[relation.sourceId];
                const target = nodeCoords[relation.targetId];

                if (!source || !target) return null;

                const isLineActive = hoveredNodeId === relation.sourceId || hoveredNodeId === relation.targetId;

                // Calculate angle for slight line adjust (avoid straight collisions inside cards)
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const angle = Math.atan2(dy, dx);

                // Offset lines from node centers to make them start/end exactly on card borders
                const startX = source.x + (nodeWidth / 2.3) * Math.cos(angle);
                const startY = source.y + (nodeHeight / 2.3) * Math.sin(angle);
                const endX = target.x - (nodeWidth / 2.3) * Math.cos(angle);
                const endY = target.y - (nodeHeight / 2.3) * Math.sin(angle);

                // For nice curved relationships when lines are vertical, use a cubic bezier
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                
                // Slight control offset for visual elegance
                const controlX = midX;
                const controlY = midY - 15;

                return (
                  <g key={`rel-${idx}`} className="transition-all duration-300">
                    {/* Path Line */}
                    <path
                      d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                      fill="none"
                      stroke={isLineActive ? '#818cf8' : '#334155'}
                      strokeWidth={isLineActive ? 2.5 : 1.5}
                      strokeDasharray={relation.technology ? '4,4' : 'none'}
                      markerEnd={isLineActive ? 'url(#arrow-hover)' : 'url(#arrow)'}
                      className="transition-colors duration-200"
                    />

                    {/* Relation Label text background */}
                    <rect
                      x={controlX - 65}
                      y={controlY - 8}
                      width={130}
                      height={18}
                      rx={4}
                      fill="#0b1329"
                      stroke={isLineActive ? '#4f46e5' : '#1e293b'}
                      strokeWidth={1}
                      className="transition-colors duration-200"
                    />

                    {/* Relation Label text */}
                    <text
                      x={controlX}
                      y={controlY + 4}
                      textAnchor="middle"
                      fill={isLineActive ? '#e2e8f0' : '#94a3b8'}
                      fontSize="9px"
                      fontFamily="monospace"
                      className="font-medium"
                    >
                      {relation.description.length > 22 
                        ? `${relation.description.slice(0, 20)}...` 
                        : relation.description}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes as Interactive Absolute Cards */}
            {positionedNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${nodeWidth}px`,
                    height: `${nodeHeight}px`,
                  }}
                  className={`p-3 border shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 text-left ${getNodeStyleClasses(node, isSelected, isHovered)} z-10`}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getNodeIcon(node.type, node.name)}
                      <h4 className="text-xs font-bold font-sans tracking-tight truncate text-slate-100">
                        {node.name}
                      </h4>
                    </div>
                    <span className="text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                      {node.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {node.description}
                  </p>

                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/50">
                    <span className="text-[8px] font-mono text-indigo-400 font-semibold truncate max-w-[120px]">
                      {node.technology || 'Core System'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      ID: {node.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inspector Side Panel */}
      <div className="w-full lg:w-72 bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between h-auto lg:h-[500px]">
        {selectedNode ? (
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Component Details
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold px-1.5 py-0.5 hover:bg-slate-800 rounded"
              >
                Clear
              </button>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block">Name</label>
              <h3 className="text-lg font-semibold text-slate-100 mt-0.5">
                {selectedNode.name}
              </h3>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block">Identifier</label>
              <code className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-300 block mt-1 w-fit">
                {selectedNode.id}
              </code>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block">Type</label>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 bg-indigo-900/40 border border-indigo-800 text-indigo-300 rounded-full capitalize font-medium">
                {selectedNode.type.replace('_', ' ')}
              </span>
            </div>

            {selectedNode.technology && (
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-500 block">Technology / Framework</label>
                <code className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-emerald-400 block mt-1 w-fit">
                  {selectedNode.technology}
                </code>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block">Architectural Role</label>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-12">
            <HelpCircle className="w-10 h-10 text-slate-700 mb-3 animate-bounce" />
            <h4 className="text-sm font-medium text-slate-400 font-sans">
              Interactive Inspector
            </h4>
            <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">
              Click any element in the container map to analyze its technical specs, interfaces, and role in the system.
            </p>
          </div>
        )}

        {/* Dynamic Connected Relations counts */}
        {selectedNode && (
          <div className="border-t border-slate-800 pt-3 mt-4 text-left">
            <h5 className="text-[10px] uppercase font-mono text-slate-500">Connected Boundaries</h5>
            <p className="text-xs text-indigo-400 font-mono mt-1">
              {c4Model.relations.filter(r => r.sourceId === selectedNode.id || r.targetId === selectedNode.id).length} Active Connections
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
