// FILE: src/app/game/solution/page.js
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

  // Load Pixelify Sans font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap";
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

    const mapBounds = { x: 25, y: 25, width: 350, height: 250 };

    // Draw map background
    ctx.fillStyle = "#2D5016";
    ctx.fillRect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);

    // Map border
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.strokeRect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);

    // Scale trafos to fit smaller canvas
    const scaledTrafos = gameData.trafos.map((trafo) => ({
      ...trafo,
      x: (trafo.x - 50) * 0.5 + mapBounds.x,
      y: (trafo.y - 50) * 0.5 + mapBounds.y,
    }));

    // Draw all cables (dim)
    gameData.cables.forEach((cable) => {
      const fromTrafo = scaledTrafos.find((t) => t.id === cable.from);
      const toTrafo = scaledTrafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) return;

      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(fromTrafo.x + 15, fromTrafo.y + 15);
      ctx.lineTo(toTrafo.x + 15, toTrafo.y + 15);
      ctx.stroke();
    });

    // Draw MST cables (bright)
    gameData.mst.forEach((cable) => {
      const fromTrafo = scaledTrafos.find((t) => t.id === cable.from);
      const toTrafo = scaledTrafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) return;

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(fromTrafo.x + 15, fromTrafo.y + 15);
      ctx.lineTo(toTrafo.x + 15, toTrafo.y + 15);
      ctx.stroke();

      // Draw weight
      const midX = (fromTrafo.x + toTrafo.x) / 2 + 15;
      const midY = (fromTrafo.y + toTrafo.y) / 2 + 15;

      ctx.fillStyle = "#00FF00";
      ctx.font = 'bold 10px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillRect(midX - 8, midY - 6, 16, 12);
      ctx.fillStyle = "black";
      ctx.fillText(cable.weight.toString(), midX, midY + 3);
    });

    // Draw trafos
    scaledTrafos.forEach((trafo) => {
      ctx.fillStyle = "#4A5568";
      ctx.fillRect(trafo.x, trafo.y, 30, 30);

      ctx.fillStyle = "#FFD700";
      ctx.fillRect(trafo.x + 2, trafo.y + 2, 26, 26);

      ctx.fillStyle = "#1A202C";
      ctx.font = 'bold 12px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillText("⚡", trafo.x + 15, trafo.y + 18);
      ctx.fillText(trafo.id, trafo.x + 15, trafo.y + 26);
    });

    ctx.setLineDash([]);
  }, [gameData, activeTab]);

  if (!gameData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div
          className="text-2xl"
          style={{ fontFamily: '"Pixelify Sans", monospace' }}
        >
          Loading solution...
        </div>
      </div>
    );
  }

  const isCorrect = gameData.isCorrect;
  const surrendered = gameData.surrendered;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
      style={{ fontFamily: '"Pixelify Sans", monospace' }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-yellow-400">
            {surrendered
              ? "🏳️ GAME SOLUTION"
              : isCorrect
              ? "🏆 PERFECT SCORE!"
              : "📊 SOLUTION ANALYSIS"}
          </h1>
          {!surrendered && (
            <div className="flex items-center justify-center space-x-4 text-2xl">
              {isCorrect ? (
                <>
                  <CheckCircle className="text-green-400" size={40} />
                  <span className="text-green-400">
                    🎉 Congratulations! Your solution is optimal! 🎉
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400" size={40} />
                  <span className="text-red-400">
                    ⚠️ Your solution needs improvement. Let&apos;s learn! ⚠️
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b-2 border-yellow-600">
            <nav className="-mb-px flex space-x-8 justify-center">
              {[
                { id: "result", label: "📊 Your Result", icon: Target },
                { id: "kruskal", label: "🔧 Kruskal Solution", icon: Award },
                { id: "prim", label: "⚡ Prim Solution", icon: Award },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 text-lg font-bold border-b-4 transition-all ${
                    activeTab === tab.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "result" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Your Solution */}
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-red-500 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
                  <Target className="mr-2" size={28} />
                  YOUR SOLUTION
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-yellow-300">Your Total Weight:</span>
                    <span
                      className={`font-bold text-xl ${
                        isCorrect ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {gameData.playerWeight}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-yellow-300">Cables Selected:</span>
                    <span className="text-blue-400 font-bold">
                      {gameData.selectedCables.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-yellow-300">Required Cables:</span>
                    <span className="text-blue-400 font-bold">
                      {gameData.trafos.length - 1}
                    </span>
                  </div>
                </div>

                {gameData.selectedCables.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold mb-3 text-yellow-400">
                      📋 Selected Cables:
                    </h4>
                    <div className="space-y-2">
                      {gameData.selectedCables.map((edge, index) => (
                        <div
                          key={index}
                          className="flex justify-between bg-slate-700 p-3 rounded border border-gray-600"
                        >
                          <span className="font-mono">
                            🔌 {edge.from} ↔ {edge.to}
                          </span>
                          <span className="text-yellow-400 font-bold">
                            {edge.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optimal Solution */}
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-green-500 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
                  <Award className="mr-2" size={28} />
                  OPTIMAL SOLUTION (MST)
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-yellow-300">Optimal Weight:</span>
                    <span className="text-green-400 font-bold text-xl">
                      {gameData.mstWeight}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-yellow-300">Difference:</span>
                    <span
                      className={`font-bold text-xl ${
                        gameData.playerWeight - gameData.mstWeight === 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      +{gameData.playerWeight - gameData.mstWeight}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-3 text-green-400">
                    🎯 MST Cables:
                  </h4>
                  <div className="space-y-2">
                    {gameData.mst.map((edge, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-slate-700 p-3 rounded border border-green-600"
                      >
                        <span className="font-mono">
                          ⚡ {edge.from} ↔ {edge.to}
                        </span>
                        <span className="text-green-400 font-bold">
                          {edge.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual representation */}
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-3 text-green-400">
                    🗺️ Visual MST:
                  </h4>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="w-full border-2 border-green-500 rounded bg-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "kruskal" && (
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-green-500 shadow-lg">
              <h3 className="text-3xl font-bold mb-6 text-green-400 flex items-center">
                <Award className="mr-3" size={36} />
                🔧 KRUSKAL ALGORITHM SOLUTION
              </h3>

              <div className="mb-8 bg-slate-700 p-4 rounded-lg">
                <h4 className="text-xl font-bold mb-3 text-yellow-400">
                  📋 Algorithm Steps:
                </h4>
                <ol className="space-y-2 text-lg text-gray-300">
                  <li>1️⃣ Sort all cables by weight (ascending)</li>
                  <li>2️⃣ Initialize Union-Find data structure</li>
                  <li>3️⃣ For each cable, check if it creates a cycle</li>
                  <li>4️⃣ If no cycle, add cable to MST</li>
                  <li>5️⃣ Repeat until MST has V-1 cables</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-yellow-400">
                  🔄 Step-by-Step Execution:
                </h4>
                {kruskalSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      step.action === "added"
                        ? "border-green-500 bg-green-900/20"
                        : "border-red-500 bg-red-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold">
                        Step {step.step}
                      </span>
                      <span
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          step.action === "added"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {step.action.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div>
                        <span className="text-gray-400">Weight:</span>{" "}
                        <span className="font-bold">{step.edge.weight}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Reason:</span>{" "}
                        {step.reason}
                      </div>
                      <div>
                        <span className="text-gray-400">Total Weight:</span>{" "}
                        <span className="font-bold text-yellow-400">
                          {step.totalWeight}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prim" && (
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-purple-500 shadow-lg">
              <h3 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
                <Award className="mr-3" size={36} />⚡ PRIM ALGORITHM SOLUTION
              </h3>

              <div className="mb-8 bg-slate-700 p-4 rounded-lg">
                <h4 className="text-xl font-bold mb-3 text-yellow-400">
                  📋 Algorithm Steps:
                </h4>
                <ol className="space-y-2 text-lg text-gray-300">
                  <li>1️⃣ Start with an arbitrary tower</li>
                  <li>2️⃣ Add it to MST set</li>
                  <li>
                    3️⃣ Find minimum weight cable connecting MST to non-MST tower
                  </li>
                  <li>4️⃣ Add that cable and tower to MST</li>
                  <li>5️⃣ Repeat until all towers are in MST</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-yellow-400">
                  🔄 Step-by-Step Execution:
                </h4>
                <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-900/20">
                  <div className="text-xl font-bold mb-2">Initial Step</div>
                  <div className="text-base">
                    <span className="text-gray-400">Starting tower:</span>{" "}
                    <span className="font-bold text-yellow-400">
                      ⚡ {gameData.trafos[0].id}
                    </span>
                  </div>
                </div>

                {primSteps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-900/20"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold">
                        Step {step.step}
                      </span>
                      <span className="px-3 py-1 rounded text-sm font-bold bg-purple-500 text-white">
                        ADDED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div>
                        <span className="text-gray-400">Cable:</span>{" "}
                        <span className="font-mono">
                          ⚡ {step.edge.from} ↔ {step.edge.to}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Weight:</span>{" "}
                        <span className="font-bold">{step.edge.weight}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">New Tower:</span>{" "}
                        <span className="font-bold text-yellow-400">
                          ⚡ {step.newVertex}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Weight:</span>{" "}
                        <span className="font-bold text-yellow-400">
                          {step.totalWeight}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-400">MST Set:</span>{" "}
                      <span className="font-mono">
                        {step.visitedSet.map((v) => `⚡${v}`).join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mt-12">
          <button
            onClick={() => router.push("/game")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-8 rounded-lg flex items-center space-x-3 font-bold text-lg transition-all"
          >
            <RotateCcw size={24} />
            <span>🎮 PLAY AGAIN</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-lg flex items-center space-x-3 font-bold text-lg transition-all"
          >
            <Home size={24} />
            <span>🏠 BACK TO HOME</span>
          </button>
        </div>

        {/* Final Score Summary */}
        {!surrendered && (
          <div
            className={`mt-8 text-center p-6 rounded-lg border-2 ${
              isCorrect
                ? "bg-green-900/30 border-green-500 text-green-400"
                : "bg-red-900/30 border-red-500 text-red-400"
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">
              {isCorrect
                ? "🏆 MISSION ACCOMPLISHED! 🏆"
                : "📈 MISSION ANALYSIS 📈"}
            </h3>
            <p className="text-lg">
              {isCorrect
                ? "You successfully found the optimal power grid configuration!"
                : `Your solution cost ${
                    gameData.playerWeight - gameData.mstWeight
                  } more than optimal. Study the algorithms above to improve!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
