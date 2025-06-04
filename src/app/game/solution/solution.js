// FILE: src/app/game/solution/solution.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Award,
  Target,
} from "lucide-react";

export default function SolutionPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [activeTab, setActiveTab] = useState("result");
  const [kruskalSteps, setKruskalSteps] = useState([]);
  const [primSteps, setPrimSteps] = useState([]);
  const canvasRef = useRef(null);

  // Load Press Start 2P font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("gameData");
    if (data) {
      const parsedData = JSON.parse(data);
      setGameData(parsedData);
      generateAlgorithmSteps(parsedData);
    } else {
      router.push("/game");
    }
  }, [router]);

  const generateAlgorithmSteps = (data) => {
    // Generate Kruskal steps
    const sortedEdges = [...data.cables].sort((a, b) => a.weight - b.weight);
    const kruskalStepsData = [];
    const parent = {};
    const rank = {};

    // Initialize Union-Find
    data.trafos.forEach((t) => {
      parent[t.id] = t.id;
      rank[t.id] = 0;
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

    let totalWeight = 0;
    sortedEdges.forEach((edge, index) => {
      const canAdd = find(edge.from) !== find(edge.to);
      if (canAdd) {
        union(edge.from, edge.to);
        totalWeight += edge.weight;
        kruskalStepsData.push({
          step: kruskalStepsData.length + 1,
          edge: edge,
          action: "added",
          reason: "Does not create cycle",
          totalWeight: totalWeight,
        });
      } else {
        kruskalStepsData.push({
          step: kruskalStepsData.length + 1,
          edge: edge,
          action: "skipped",
          reason: "Creates cycle",
          totalWeight: totalWeight,
        });
      }
    });

    setKruskalSteps(kruskalStepsData);

    // Generate Prim steps
    const primStepsData = [];
    const visited = [data.trafos[0].id];
    let primWeight = 0;

    while (visited.length < data.trafos.length) {
      let minEdge = null;
      let minWeight = Infinity;

      data.cables.forEach((edge) => {
        const fromVisited = visited.includes(edge.from);
        const toVisited = visited.includes(edge.to);

        if ((fromVisited && !toVisited) || (!fromVisited && toVisited)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      });

      if (minEdge) {
        const newVertex = visited.includes(minEdge.from)
          ? minEdge.to
          : minEdge.from;
        visited.push(newVertex);
        primWeight += minEdge.weight;

        primStepsData.push({
          step: primStepsData.length + 1,
          edge: minEdge,
          newVertex: newVertex,
          visitedSet: [...visited],
          totalWeight: primWeight,
        });
      }
    }

    setPrimSteps(primStepsData);
  };

  // Canvas drawing for visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameData) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate bounds of all trafos to properly scale
    const minX = Math.min(...gameData.trafos.map((t) => t.x));
    const maxX = Math.max(...gameData.trafos.map((t) => t.x));
    const minY = Math.min(...gameData.trafos.map((t) => t.y));
    const maxY = Math.max(...gameData.trafos.map((t) => t.y));

    const originalWidth = maxX - minX;
    const originalHeight = maxY - minY;

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate padding and scale to fit properly
    const padding = 40;
    const availableWidth = canvasWidth - 2 * padding;
    const availableHeight = canvasHeight - 2 * padding;

    const scaleX = originalWidth > 0 ? availableWidth / originalWidth : 1;
    const scaleY = originalHeight > 0 ? availableHeight / originalHeight : 1;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed

    // Draw map background
    ctx.fillStyle = "#2D5016";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Map border
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, canvasWidth - 4, canvasHeight - 4);

    // Scale and center trafos
    const scaledTrafos = gameData.trafos.map((trafo) => ({
      ...trafo,
      x: padding + (trafo.x - minX) * scale,
      y: padding + (trafo.y - minY) * scale,
    }));

    // Draw all cables (dim)
    gameData.cables.forEach((cable) => {
      const fromTrafo = scaledTrafos.find((t) => t.id === cable.from);
      const toTrafo = scaledTrafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) return;

      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(fromTrafo.x + 15, fromTrafo.y + 15);
      ctx.lineTo(toTrafo.x + 15, toTrafo.y + 15);
      ctx.stroke();
    });

    // Draw MST cables (bright green)
    gameData.mst.forEach((cable) => {
      const fromTrafo = scaledTrafos.find((t) => t.id === cable.from);
      const toTrafo = scaledTrafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) return;

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 4;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(fromTrafo.x + 15, fromTrafo.y + 15);
      ctx.lineTo(toTrafo.x + 15, toTrafo.y + 15);
      ctx.stroke();

      // Draw weight with better visibility
      const midX = (fromTrafo.x + toTrafo.x) / 2 + 15;
      const midY = (fromTrafo.y + toTrafo.y) / 2 + 15;

      // Background for weight label
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(midX - 12, midY - 8, 24, 16);

      // Border for weight label
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.strokeRect(midX - 12, midY - 8, 24, 16);

      // Weight text
      ctx.fillStyle = "#00FF00";
      ctx.font = 'bold 10px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText(cable.weight.toString(), midX, midY + 3);
    });

    // Draw trafos (transformers)
    scaledTrafos.forEach((trafo) => {
      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(trafo.x + 3, trafo.y + 3, 30, 30);

      // Main trafo body (dark gray)
      ctx.fillStyle = "#4A5568";
      ctx.fillRect(trafo.x, trafo.y, 30, 30);

      // Smaller inner yellow part (reduced size)
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(trafo.x + 6, trafo.y + 6, 18, 12);

      // Border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(trafo.x, trafo.y, 30, 30);

      // Label background (positioned below yellow part)
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(trafo.x + 3, trafo.y + 20, 24, 8);

      // Trafo ID (white text for better contrast)
      ctx.fillStyle = "#FFFFFF";
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText(trafo.id, trafo.x + 15, trafo.y + 26);
    });

    // Reset line dash
    ctx.setLineDash([]);
  }, [gameData, activeTab]);

  if (!gameData) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: '"Press Start 2P", cursive' }}
      >
        <div className="text-2xl text-[#3b6ea5]">Loading solution...</div>
      </div>
    );
  }

  const isCorrect = gameData.isCorrect;
  const surrendered = gameData.surrendered;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: '"Press Start 2P", cursive' }}
    >
      {/* Main content */}
      <main className="px-6 pb-12 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="relative max-w-6xl mt-16">
          <div className="absolute -top-8 left-0 bg-[#3b6ea5] rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-none px-6 py-2 text-white text-[14px] select-none">
            {surrendered
              ? "Game Solution"
              : isCorrect
              ? "Perfect Score!"
              : "Solution Analysis"}
          </div>
          <div className="mt-6 bg-[#fbbf24] rounded-xl p-1">
            <div className="bg-[#fef1c7] rounded-lg p-6 text-[14px] text-black leading-relaxed">
              {surrendered && (
                <div className="text-center mb-6">
                  <div className="text-[#3b6ea5] text-[16px] font-bold mb-2">
                    🏳️ Game Solution
                  </div>
                  <div className="text-[12px]">
                    Tidak apa-apa! Mari kita pelajari solusi yang benar untuk
                    memahami konsep MST dengan lebih baik.
                  </div>
                </div>
              )}

              {!surrendered && isCorrect && (
                <div className="text-center mb-6">
                  <div className="text-[#3b6ea5] text-[16px] font-bold mb-2">
                    🏆 Perfect Score!
                  </div>
                  <div className="text-[12px]">
                    Selamat! Anda berhasil menemukan Minimum Spanning Tree yang
                    optimal. Jawaban Anda sudah benar dengan total bobot
                    minimum.
                  </div>
                </div>
              )}

              {!surrendered && !isCorrect && (
                <div className="text-center mb-6">
                  <div className="text-[#3b6ea5] text-[16px] font-bold mb-2">
                    📊 Solution Analysis
                  </div>
                  <div className="text-[12px]">
                    Jawaban Anda masih belum optimal. Mari kita analisis dan
                    pelajari solusi yang benar menggunakan algoritma Kruskal dan
                    Prim.
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex space-x-2 mb-6 justify-center">
                {[
                  { id: "result", label: "Your Result" },
                  { id: "kruskal", label: "Kruskal Solution" },
                  { id: "prim", label: "Prim Solution" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-[10px] border-2 border-black rounded ${
                      activeTab === tab.id
                        ? "bg-[#3b6ea5] text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "result" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Your Solution */}
                  <div className="bg-white border-2 border-black rounded-lg p-4">
                    <div className="bg-[#3b6ea5] text-white px-3 py-1 text-[12px] font-bold mb-3 rounded">
                      YOUR SOLUTION
                    </div>

                    <div className="space-y-3 text-[10px]">
                      <div className="flex justify-between">
                        <span>Your Total Weight:</span>
                        <span
                          className={`font-bold ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {gameData.playerWeight}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cables Selected:</span>
                        <span className="text-[#3b6ea5] font-bold">
                          {gameData.selectedCables.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Cables:</span>
                        <span className="text-[#3b6ea5] font-bold">
                          {gameData.trafos.length - 1}
                        </span>
                      </div>
                    </div>

                    {gameData.selectedCables.length > 0 && (
                      <div className="mt-4">
                        <div className="text-[10px] font-bold mb-2">
                          Selected Cables:
                        </div>
                        <div className="space-y-1">
                          {gameData.selectedCables.map((edge, index) => (
                            <div
                              key={index}
                              className="flex justify-between bg-gray-100 p-2 rounded text-[9px]"
                            >
                              <span>
                                {edge.from} ↔ {edge.to}
                              </span>
                              <span className="font-bold">{edge.weight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optimal Solution */}
                  <div className="bg-white border-2 border-black rounded-lg p-4">
                    <div className="bg-green-600 text-white px-3 py-1 text-[12px] font-bold mb-3 rounded">
                      OPTIMAL SOLUTION (MST)
                    </div>

                    <div className="space-y-3 text-[10px]">
                      <div className="flex justify-between">
                        <span>Optimal Weight:</span>
                        <span className="text-green-600 font-bold">
                          {gameData.mstWeight}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difference:</span>
                        <span
                          className={`font-bold ${
                            gameData.playerWeight - gameData.mstWeight === 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          +{gameData.playerWeight - gameData.mstWeight}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-[10px] font-bold mb-2">
                        MST Cables:
                      </div>
                      <div className="space-y-1">
                        {gameData.mst.map((edge, index) => (
                          <div
                            key={index}
                            className="flex justify-between bg-green-100 p-2 rounded text-[9px]"
                          >
                            <span>
                              {edge.from} ↔ {edge.to}
                            </span>
                            <span className="text-green-600 font-bold">
                              {edge.weight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual representation */}
                    <div className="mt-4">
                      <div className="text-[10px] font-bold mb-2">
                        Visual MST:
                      </div>
                      <div className="border-2 border-black rounded bg-white p-2">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={380}
                          className="w-full h-auto max-w-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "kruskal" && (
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <div className="bg-green-600 text-white px-3 py-1 text-[12px] font-bold mb-3 rounded">
                    KRUSKAL ALGORITHM SOLUTION
                  </div>

                  <div className="mb-4 bg-gray-100 p-3 rounded text-[10px]">
                    <div className="font-bold mb-2">Algorithm Steps:</div>
                    <div className="space-y-1">
                      <div>1. Sort all cables by weight (ascending)</div>
                      <div>2. Initialize Union-Find data structure</div>
                      <div>3. For each cable, check if it creates a cycle</div>
                      <div>4. If no cycle, add cable to MST</div>
                      <div>5. Repeat until MST has V-1 cables</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold">
                      Step-by-Step Execution:
                    </div>
                    {kruskalSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border text-[9px] ${
                          step.action === "added"
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">Step {step.step}</span>
                          <span
                            className={`px-2 py-1 rounded text-[8px] font-bold ${
                              step.action === "added"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {step.action.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span>
                              Cable: {step.edge.from}-{step.edge.to}
                            </span>
                          </div>
                          <div>
                            <span>Weight: {step.edge.weight}</span>
                          </div>
                          <div>
                            <span>Reason: {step.reason}</span>
                          </div>
                          <div>
                            <span>Total: {step.totalWeight}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "prim" && (
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <div className="bg-purple-600 text-white px-3 py-1 text-[12px] font-bold mb-3 rounded">
                    PRIM ALGORITHM SOLUTION
                  </div>

                  <div className="mb-4 bg-gray-100 p-3 rounded text-[10px]">
                    <div className="font-bold mb-2">Algorithm Steps:</div>
                    <div className="space-y-1">
                      <div>1. Start with an arbitrary transformer</div>
                      <div>2. Add it to MST set</div>
                      <div>
                        3. Find minimum weight cable connecting MST to non-MST
                        transformer
                      </div>
                      <div>4. Add that cable and transformer to MST</div>
                      <div>5. Repeat until all transformers are in MST</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold">
                      Step-by-Step Execution:
                    </div>

                    <div className="p-2 rounded border border-purple-500 bg-purple-50 text-[9px]">
                      <div className="font-bold mb-1">Initial Step</div>
                      <div>Starting transformer: {gameData.trafos[0].id}</div>
                    </div>

                    {primSteps.map((step, index) => (
                      <div
                        key={index}
                        className="p-2 rounded border border-purple-500 bg-purple-50 text-[9px]"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">Step {step.step}</span>
                          <span className="px-2 py-1 rounded text-[8px] font-bold bg-purple-500 text-white">
                            ADDED
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span>
                              Cable: {step.edge.from}-{step.edge.to}
                            </span>
                          </div>
                          <div>
                            <span>Weight: {step.edge.weight}</span>
                          </div>
                          <div>
                            <span>New Transformer: {step.newVertex}</span>
                          </div>
                          <div>
                            <span>Total: {step.totalWeight}</span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <span>MST Set: {step.visitedSet.join(", ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => router.push("/game")}
                  className="bg-[#3b6ea5] text-white px-4 py-2 rounded border-2 border-black hover:bg-[#2d5a8a] transition-colors text-[10px] font-bold"
                >
                  PLAY AGAIN
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="bg-white text-[#3b6ea5] px-4 py-2 rounded border-2 border-[#3b6ea5] hover:bg-gray-100 transition-colors text-[10px] font-bold"
                >
                  BACK TO HOME
                </button>
              </div>

              {/* Final Score Summary */}
              {!surrendered && (
                <div
                  className={`mt-6 text-center p-4 rounded border-2 ${
                    isCorrect
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                  }`}
                >
                  <div className="text-[12px] font-bold mb-1">
                    {isCorrect
                      ? "🏆 MISSION ACCOMPLISHED! 🏆"
                      : "📈 MISSION ANALYSIS 📈"}
                  </div>
                  <div className="text-[10px]">
                    {isCorrect
                      ? "You successfully found the optimal power grid configuration!"
                      : `Your solution cost ${
                          gameData.playerWeight - gameData.mstWeight
                        } more than optimal. Study the algorithms above to improve!`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
