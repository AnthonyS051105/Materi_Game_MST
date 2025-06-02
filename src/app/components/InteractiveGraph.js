"use client";

import { useState, useEffect } from "react";

export default function InteractiveGraph({
  nodes,
  edges,
  highlightedEdges = [],
  title,
}) {
  const [svgSize] = useState({ width: 600, height: 400 });
  const [animatedEdges, setAnimatedEdges] = useState([]);

  useEffect(() => {
    if (highlightedEdges.length > 0) {
      highlightedEdges.forEach((edge, index) => {
        setTimeout(() => {
          setAnimatedEdges((prev) => [...prev, edge]);
        }, index * 500);
      });
    }
  }, [highlightedEdges]);

  const getEdgeKey = (edge) => `${edge.from}-${edge.to}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="flex justify-center">
        <svg
          width={svgSize.width}
          height={svgSize.height}
          className="border rounded"
        >
          {/* Draw edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            const isHighlighted = animatedEdges.some(
              (e) => getEdgeKey(e) === getEdgeKey(edge)
            );

            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? "#ef4444" : "#9ca3af"}
                  strokeWidth={isHighlighted ? "3" : "2"}
                  className={isHighlighted ? "animate-pulse" : ""}
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  className="text-sm font-medium"
                  textAnchor="middle"
                  fill={isHighlighted ? "#ef4444" : "#374151"}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="2"
                className="hover:fill-blue-600 transition-colors cursor-pointer"
              />
              <text
                x={node.x}
                y={node.y + 5}
                className="text-white font-bold text-sm"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
