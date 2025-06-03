// FILE: src/app/game/page.js
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
  const [trafoCount, setTrafoCount] = useState(5);
  const [trafos, setTrafos] = useState([]);
  const [cables, setCables] = useState([]);
  const [selectedCables, setSelectedCables] = useState([]);
  const [mst, setMst] = useState([]);
  const [mstWeight, setMstWeight] = useState(0);
  const [playerWeight, setPlayerWeight] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const canvasRef = useRef(null);

  // Pixelify Sans font loading
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Transition effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Map boundaries for trafo placement
  const mapBounds = {
    x: 50,
    y: 50,
    width: 700,
    height: 500,
  };

  // Generate random trafos within map bounds
  const generateTrafos = (count) => {
    const newTrafos = [];
    for (let i = 0; i < count; i++) {
      const x = mapBounds.x + Math.random() * (mapBounds.width - 60);
      const y = mapBounds.y + Math.random() * (mapBounds.height - 60);
      newTrafos.push({
        id: String.fromCharCode(65 + i),
        x: x,
        y: y,
        selected: false,
      });
    }
    return newTrafos;
  };

  // Generate cables with random weights based on distance
  const generateCables = (trafos) => {
    const newCables = [];
    for (let i = 0; i < trafos.length; i++) {
      for (let j = i + 1; j < trafos.length; j++) {
        const distance = Math.sqrt(
          Math.pow(trafos[i].x - trafos[j].x, 2) +
            Math.pow(trafos[i].y - trafos[j].y, 2)
        );
        const weight =
          Math.floor(distance / 15) + Math.floor(Math.random() * 10) + 1;

        newCables.push({
          from: trafos[i].id,
          to: trafos[j].id,
          weight: weight,
          selected: false,
        });
      }
    }
    return newCables;
  };

  // Kruskal algorithm for MST
  const findMSTKruskal = (vertices, edges) => {
    const parent = {};
    const rank = {};

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
    const newTrafos = generateTrafos(trafoCount);
    const newCables = generateCables(newTrafos);
    const { mstEdges, totalWeight } = findMSTKruskal(newTrafos, newCables);

    setTrafos(newTrafos);
    setCables(newCables);
    setMst(mstEdges);
    setMstWeight(totalWeight);
    setSelectedCables([]);
    setPlayerWeight(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  const handleCableClick = (cable) => {
    if (gameFinished) return;

    const isSelected = selectedCables.some(
      (c) =>
        (c.from === cable.from && c.to === cable.to) ||
        (c.from === cable.to && c.to === cable.from)
    );

    if (isSelected) {
      setSelectedCables(
        selectedCables.filter(
          (c) =>
            !(
              (c.from === cable.from && c.to === cable.to) ||
              (c.from === cable.to && c.to === cable.from)
            )
        )
      );
      setPlayerWeight(playerWeight - cable.weight);
    } else {
      setSelectedCables([...selectedCables, cable]);
      setPlayerWeight(playerWeight + cable.weight);
    }
  };

  const submitAnswer = () => {
    setGameFinished(true);
    const isCorrect =
      playerWeight === mstWeight && selectedCables.length === trafoCount - 1;

    // Store game data for solution page
    sessionStorage.setItem(
      "gameData",
      JSON.stringify({
        trafos,
        cables,
        selectedCables,
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
        trafos,
        cables,
        selectedCables: [],
        mst,
        mstWeight,
        playerWeight: 0,
        isCorrect: false,
        surrendered: true,
      })
    );

    router.push("/game/solution");
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map background
    ctx.fillStyle = "#2D5016";
    ctx.fillRect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);

    // Map border
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 4;
    ctx.strokeRect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);

    // Draw grid pattern
    ctx.strokeStyle = "#3D6B26";
    ctx.lineWidth = 1;
    for (let i = mapBounds.x; i <= mapBounds.x + mapBounds.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, mapBounds.y);
      ctx.lineTo(i, mapBounds.y + mapBounds.height);
      ctx.stroke();
    }
    for (let i = mapBounds.y; i <= mapBounds.y + mapBounds.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(mapBounds.x, i);
      ctx.lineTo(mapBounds.x + mapBounds.width, i);
      ctx.stroke();
    }

    // Draw title
    ctx.fillStyle = "#FFD700";
    ctx.font = 'bold 24px "Pixelify Sans", monospace';
    ctx.textAlign = "center";
    ctx.fillText("POWER GRID MAP", canvas.width / 2, 30);

    // Draw cables
    cables.forEach((cable) => {
      const fromTrafo = trafos.find((t) => t.id === cable.from);
      const toTrafo = trafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) return;

      const isSelected = selectedCables.some(
        (c) =>
          (c.from === cable.from && c.to === cable.to) ||
          (c.from === cable.to && c.to === cable.from)
      );

      ctx.strokeStyle = isSelected ? "#FF4444" : "#666666";
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.setLineDash(isSelected ? [] : [8, 4]);

      ctx.beginPath();
      ctx.moveTo(fromTrafo.x + 30, fromTrafo.y + 30);
      ctx.lineTo(toTrafo.x + 30, toTrafo.y + 30);
      ctx.stroke();

      // Draw weight label
      const midX = (fromTrafo.x + toTrafo.x) / 2 + 30;
      const midY = (fromTrafo.y + toTrafo.y) / 2 + 30;

      ctx.fillStyle = isSelected ? "#FF4444" : "#333333";
      ctx.font = 'bold 14px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillRect(midX - 15, midY - 10, 30, 20);
      ctx.fillStyle = "white";
      ctx.fillText(cable.weight.toString(), midX, midY + 5);
    });

    // Draw trafos
    trafos.forEach((trafo) => {
      // Trafo body (simplified tower representation)
      ctx.fillStyle = "#4A5568";
      ctx.fillRect(trafo.x, trafo.y, 60, 60);

      // Trafo details
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(trafo.x + 5, trafo.y + 5, 50, 50);

      // Power symbol
      ctx.fillStyle = "#1A202C";
      ctx.font = 'bold 20px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillText("⚡", trafo.x + 30, trafo.y + 35);

      // Label
      ctx.fillStyle = "#1A202C";
      ctx.font = 'bold 16px "Pixelify Sans", monospace';
      ctx.fillText(trafo.id, trafo.x + 30, trafo.y + 50);
    });

    ctx.setLineDash([]);
  }, [trafos, cables, selectedCables, gameStarted]);

  const handleCanvasClick = (event) => {
    if (!gameStarted || gameFinished) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a cable
    for (const cable of cables) {
      const fromTrafo = trafos.find((t) => t.id === cable.from);
      const toTrafo = trafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) continue;

      const dist = pointToLineDistance(
        x,
        y,
        fromTrafo.x + 30,
        fromTrafo.y + 30,
        toTrafo.x + 30,
        toTrafo.y + 30
      );

      if (dist < 15) {
        handleCableClick(cable);
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

  // Transition screen
  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-8xl mb-8 animate-pulse">⚡</div>
          <div
            className="text-white text-4xl mb-6 animate-bounce"
            style={{ fontFamily: '"Pixelify Sans", monospace' }}
          >
            ENTERING POWER GRID DIMENSION...
          </div>
          <div className="flex space-x-3 justify-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <div
            className="text-yellow-300 text-lg mt-8"
            style={{ fontFamily: '"Pixelify Sans", monospace' }}
          >
            Loading transmission towers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
      style={{ fontFamily: '"Pixelify Sans", monospace' }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-yellow-400">
            MST POWER GRID GAME
          </h1>
          <p className="text-xl text-yellow-300">
            Connect transmission towers with minimum cable cost!
          </p>
        </div>

        {!gameStarted ? (
          // Game Setup
          <div className="max-w-md mx-auto bg-slate-800 rounded-lg p-8 border-2 border-yellow-500 shadow-lg">
            <h2 className="text-3xl mb-6 text-center text-yellow-400">
              GAME SETUP
            </h2>

            <div className="mb-6">
              <label className="block text-yellow-300 mb-4 text-lg">
                Number of Transmission Towers:
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setTrafoCount(Math.max(3, trafoCount - 1))}
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-3xl text-yellow-400 w-16 text-center font-bold">
                  {trafoCount}
                </span>
                <button
                  onClick={() => setTrafoCount(Math.min(10, trafoCount + 1))}
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all font-bold text-lg"
            >
              <Play size={24} />
              <span>START GAME</span>
            </button>
          </div>
        ) : (
          // Game Area
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Game Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800 rounded-lg p-4 border-2 border-yellow-500 shadow-lg">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full border-2 border-yellow-600 rounded cursor-pointer bg-slate-700"
                  onClick={handleCanvasClick}
                />
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-6">
              {/* Score Panel */}
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                  ⚡ POWER STATS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-yellow-300">Your Cable Cost:</span>
                    <span className="text-yellow-400 font-bold text-xl">
                      {playerWeight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-300">Target MST Cost:</span>
                    <span className="text-green-400 font-bold text-xl">
                      {mstWeight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-300">Cables Selected:</span>
                    <span className="text-blue-400 font-bold">
                      {selectedCables.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-300">Required Cables:</span>
                    <span className="text-blue-400 font-bold">
                      {trafoCount - 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  📋 MISSION
                </h3>
                <ul className="text-sm space-y-2 text-yellow-300">
                  <li>🎯 Click cables to select/deselect</li>
                  <li>⚡ Connect all towers</li>
                  <li>💰 Use minimum total cable cost</li>
                  <li>🔴 Selected cables turn red</li>
                  <li>🏆 Perfect score = MST solution</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={submitAnswer}
                  disabled={
                    gameFinished || selectedCables.length !== trafoCount - 1
                  }
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-bold transition-all"
                >
                  <CheckCircle size={20} />
                  <span>SUBMIT SOLUTION</span>
                </button>

                <button
                  onClick={surrenderGame}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-bold transition-all"
                >
                  <Flag size={20} />
                  <span>SURRENDER</span>
                </button>

                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-bold transition-all"
                >
                  <RotateCcw size={20} />
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
