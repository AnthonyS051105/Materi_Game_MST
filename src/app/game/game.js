"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Plus,
  Minus,
  Play,
  RotateCcw,
  CheckCircle,
  Flag,
  Settings,
} from "lucide-react";

export default function GamePage() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [transformerCount, setTransformerCount] = useState(5);
  const [transformers, setTransformers] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [mst, setMst] = useState([]);
  const [mstWeight, setMstWeight] = useState(0);
  const [playerWeight, setPlayerWeight] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const canvasRef = useRef(null);

  // Transisi masuk ke dunia game
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate random transformers dalam area peta
  const generateTransformers = (count) => {
    const mapArea = {
      x: 100,
      y: 100,
      width: 600,
      height: 400,
    };

    const newTransformers = [];
    for (let i = 0; i < count; i++) {
      const x = mapArea.x + Math.random() * (mapArea.width - 60);
      const y = mapArea.y + Math.random() * (mapArea.height - 60);
      newTransformers.push({
        id: String.fromCharCode(65 + i),
        x: x,
        y: y,
        selected: false,
      });
    }
    return newTransformers;
  };

  // Generate edges dengan random weights
  const generateEdges = (transformers) => {
    const newEdges = [];
    for (let i = 0; i < transformers.length; i++) {
      for (let j = i + 1; j < transformers.length; j++) {
        const distance = Math.sqrt(
          Math.pow(transformers[i].x - transformers[j].x, 2) +
            Math.pow(transformers[i].y - transformers[j].y, 2)
        );
        const weight =
          Math.floor(distance / 10) + Math.floor(Math.random() * 20) + 1;

        newEdges.push({
          from: transformers[i].id,
          to: transformers[j].id,
          weight: weight,
          selected: false,
        });
      }
    }
    return newEdges;
  };

  // Kruskal algorithm untuk mencari MST
  const findMSTKruskal = (vertices, edges) => {
    const parent = {};
    const rank = {};

    // Initialize Union-Find
    vertices.forEach((v) => {
      parent[v.id] = v.id;
      rank[v.id] = 0;
    });

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x, y) => {
      const px = find(x);
      const py = find(y);

      if (px === py) return false;

      if (rank[px] < rank[py]) {
        parent[px] = py;
      } else if (rank[px] > rank[py]) {
        parent[py] = px;
      } else {
        parent[py] = px;
        rank[px]++;
      }
      return true;
    };

    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const mstEdges = [];
    let totalWeight = 0;

    for (const edge of sortedEdges) {
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge);
        totalWeight += edge.weight;
        if (mstEdges.length === vertices.length - 1) break;
      }
    }

    return { mstEdges, totalWeight };
  };

  const startGame = () => {
    const newTransformers = generateTransformers(transformerCount);
    const newEdges = generateEdges(newTransformers);
    const { mstEdges, totalWeight } = findMSTKruskal(newTransformers, newEdges);

    setTransformers(newTransformers);
    setEdges(newEdges);
    setMst(mstEdges);
    setMstWeight(totalWeight);
    setSelectedEdges([]);
    setPlayerWeight(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  const handleEdgeClick = (edge) => {
    if (gameFinished) return;

    const isSelected = selectedEdges.some(
      (e) =>
        (e.from === edge.from && e.to === edge.to) ||
        (e.from === edge.to && e.to === edge.from)
    );

    if (isSelected) {
      setSelectedEdges(
        selectedEdges.filter(
          (e) =>
            !(
              (e.from === edge.from && e.to === edge.to) ||
              (e.from === edge.to && e.to === edge.from)
            )
        )
      );
      setPlayerWeight(playerWeight - edge.weight);
    } else {
      setSelectedEdges([...selectedEdges, edge]);
      setPlayerWeight(playerWeight + edge.weight);
    }
  };

  const submitAnswer = () => {
    setGameFinished(true);
    const isCorrect =
      playerWeight === mstWeight &&
      selectedEdges.length === transformerCount - 1;

    // Store game data untuk halaman solusi
    sessionStorage.setItem(
      "gameData",
      JSON.stringify({
        transformers,
        edges,
        selectedEdges,
        mst,
        mstWeight,
        playerWeight,
        isCorrect,
      })
    );

    router.push("/game/solution");
  };

  const surrenderGame = () => {
    sessionStorage.setItem(
      "gameData",
      JSON.stringify({
        transformers,
        edges,
        selectedEdges: [],
        mst,
        mstWeight,
        playerWeight: 0,
        isCorrect: false,
        surrendered: true,
      })
    );

    router.push("/game/solution");
  };

  // Render game canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map background
    ctx.fillStyle = "#10B981";
    ctx.fillRect(80, 80, 640, 440);

    ctx.fillStyle = "#065F46";
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText("POWER GRID MAP", 300, 60);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = transformers.find((t) => t.id === edge.from);
      const toNode = transformers.find((t) => t.id === edge.to);

      if (!fromNode || !toNode) return;

      const isSelected = selectedEdges.some(
        (e) =>
          (e.from === edge.from && e.to === edge.to) ||
          (e.from === edge.to && e.to === edge.from)
      );

      ctx.strokeStyle = isSelected ? "#DC2626" : "#6B7280";
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.setLineDash(isSelected ? [] : [5, 5]);

      ctx.beginPath();
      ctx.moveTo(fromNode.x + 20, fromNode.y + 20);
      ctx.lineTo(toNode.x + 20, toNode.y + 20);
      ctx.stroke();

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2 + 20;
      const midY = (fromNode.y + toNode.y) / 2 + 20;

      ctx.fillStyle = isSelected ? "#DC2626" : "#374151";
      ctx.font = '12px "Press Start 2P"';
      ctx.fillText(edge.weight.toString(), midX - 10, midY - 5);
    });

    // Draw transformers
    transformers.forEach((transformer) => {
      // Transformer body (simplified as rectangle)
      ctx.fillStyle = "#1F2937";
      ctx.fillRect(transformer.x, transformer.y, 40, 40);

      // Transformer details
      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(transformer.x + 5, transformer.y + 5, 30, 30);

      // Label
      ctx.fillStyle = "#111827";
      ctx.font = '14px "Press Start 2P"';
      ctx.fillText(transformer.id, transformer.x + 15, transformer.y + 25);
    });
  }, [transformers, edges, selectedEdges, gameStarted]);

  const handleCanvasClick = (event) => {
    if (!gameStarted || gameFinished) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on an edge
    for (const edge of edges) {
      const fromNode = transformers.find((t) => t.id === edge.from);
      const toNode = transformers.find((t) => t.id === edge.to);

      if (!fromNode || !toNode) continue;

      // Simple distance check to edge line
      const dist = pointToLineDistance(
        x,
        y,
        fromNode.x + 20,
        fromNode.y + 20,
        toNode.x + 20,
        toNode.y + 20
      );

      if (dist < 10) {
        handleEdgeClick(edge);
        break;
      }
    }
  };

  const pointToLineDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-6xl mb-8 animate-pulse">⚡</div>
          <div className="text-white text-2xl mb-4 animate-fade-in font-mono">
            ENTERING POWER GRID DIMENSION...
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white font-mono">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4 text-green-400"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MST POWER GRID GAME
          </h1>
          <p className="text-green-300">
            Connect transformers with minimum cable cost!
          </p>
        </div>

        {!gameStarted ? (
          // Game Setup
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 border border-green-500">
            <h2 className="text-2xl mb-6 text-center text-green-400">
              GAME SETUP
            </h2>

            <div className="mb-6">
              <label className="block text-green-300 mb-2">
                Number of Transformers:
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setTransformerCount(Math.max(3, transformerCount - 1))
                  }
                  className="bg-red-600 hover:bg-red-700 p-2 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="text-2xl text-green-400 w-12 text-center">
                  {transformerCount}
                </span>
                <button
                  onClick={() =>
                    setTransformerCount(Math.min(8, transformerCount + 1))
                  }
                  className="bg-green-600 hover:bg-green-700 p-2 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Play size={20} />
              <span>START GAME</span>
            </button>
          </div>
        ) : (
          // Game Area
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Game Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 rounded-lg p-4 border border-green-500">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full border border-green-600 rounded cursor-pointer"
                  onClick={handleCanvasClick}
                />
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-4">
              {/* Score Panel */}
              <div className="bg-gray-800 rounded-lg p-4 border border-green-500">
                <h3 className="text-lg font-bold text-green-400 mb-3">SCORE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Your Weight:</span>
                    <span className="text-yellow-400">{playerWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target MST:</span>
                    <span className="text-green-400">{mstWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges Selected:</span>
                    <span className="text-blue-400">
                      {selectedEdges.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Edges:</span>
                    <span className="text-blue-400">
                      {transformerCount - 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-lg p-4 border border-green-500">
                <h3 className="text-lg font-bold text-green-400 mb-3">
                  INSTRUCTIONS
                </h3>
                <ul className="text-xs space-y-1 text-green-300">
                  <li>• Click on cables to select/deselect</li>
                  <li>• Connect all transformers</li>
                  <li>• Use minimum total cable weight</li>
                  <li>• Selected cables turn red</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={submitAnswer}
                  disabled={
                    gameFinished ||
                    selectedEdges.length !== transformerCount - 1
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>SUBMIT</span>
                </button>

                <button
                  onClick={surrenderGame}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
                >
                  <Flag size={16} />
                  <span>SURRENDER</span>
                </button>

                <button
                  onClick={startGame}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={16} />
                  <span>NEW GAME</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
