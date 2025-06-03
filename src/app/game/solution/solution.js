"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";

export default function SolutionPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [activeTab, setActiveTab] = useState("result");
  const [kruskalSteps, setKruskalSteps] = useState([]);
  const [primSteps, setPrimSteps] = useState([]);

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
    const sortedEdges = [...data.edges].sort((a, b) => a.weight - b.weight);
    const kruskalStepsData = [];
    const parent = {};
    const rank = {};

    // Initialize Union-Find
    data.transformers.forEach((t) => {
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
          reason: "Tidak membentuk cycle",
          totalWeight: totalWeight,
        });
      } else {
        kruskalStepsData.push({
          step: kruskalStepsData.length + 1,
          edge: edge,
          action: "skipped",
          reason: "Membentuk cycle",
          totalWeight: totalWeight,
        });
      }
    });

    setKruskalSteps(kruskalStepsData);

    // Generate Prim steps (simplified)
    const primStepsData = [];
    const visited = [data.transformers[0].id];
    let primWeight = 0;

    while (visited.length < data.transformers.length) {
      let minEdge = null;
      let minWeight = Infinity;

      data.edges.forEach((edge) => {
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

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isCorrect = gameData.isCorrect;
  const surrendered = gameData.surrendered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">
            {surrendered
              ? "GAME SOLUTION"
              : isCorrect
              ? "PERFECT SCORE!"
              : "SOLUTION & ANALYSIS"}
          </h1>
          {!surrendered && (
            <div className="flex items-center justify-center space-x-4 text-xl">
              {isCorrect ? (
                <>
                  <CheckCircle className="text-green-400" size={32} />
                  <span className="text-green-400">
                    Congratulations! Your solution is optimal!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400" size={32} />
                  <span className="text-red-400">
                    Your solution needs improvement. Let&apos;s learn!
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-600">
            <nav className="-mb-px flex space-x-8 justify-center">
              {[
                { id: "result", label: "Your Result" },
                { id: "kruskal", label: "Kruskal Solution" },
                { id: "prim", label: "Prim Solution" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-400"
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
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  Your Solution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Your Total Weight:</span>
                    <span
                      className={`font-bold ${
                        isCorrect ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {gameData.playerWeight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges Selected:</span>
                    <span className="text-blue-400">
                      {gameData.selectedEdges.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Edges:</span>
                    <span className="text-blue-400">
                      {gameData.transformers.length - 1}
                    </span>
                  </div>
                </div>

                {gameData.selectedEdges.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Selected Edges:</h4>
                    <div className="space-y-1 text-sm">
                      {gameData.selectedEdges.map((edge, index) => (
                        <div
                          key={index}
                          className="flex justify-between bg-gray-700 p-2 rounded"
                        >
                          <span>
                            {edge.from} - {edge.to}
                          </span>
                          <span className="text-yellow-400">{edge.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optimal Solution */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-bold mb-4 text-green-400">
                  Optimal Solution (MST)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Optimal Weight:</span>
                    <span className="text-green-400 font-bold">
                      {gameData.mstWeight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difference:</span>
                    <span
                      className={`font-bold ${
                        gameData.playerWeight - gameData.mstWeight === 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      +{gameData.playerWeight - gameData.mstWeight}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">MST Edges:</h4>
                  <div className="space-y-1 text-sm">
                    {gameData.mst.map((edge, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-gray-700 p-2 rounded"
                      >
                        <span>
                          {edge.from} - {edge.to}
                        </span>
                        <span className="text-green-400">{edge.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kruskal" && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-2xl font-bold mb-6 text-green-400">
                Kruskal Algorithm Solution
              </h3>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Algorithm Steps:</h4>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. Sort all edges by weight (ascending)</li>
                  <li>2. Initialize Union-Find data structure</li>
                  <li>3. For each edge, check if it creates a cycle</li>
                  <li>4. If no cycle, add edge to MST</li>
                  <li>5. Repeat until MST has V-1 edges</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">
                  Step-by-Step Execution:
                </h4>
                {kruskalSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded border-l-4 ${
                      step.action === "added"
                        ? "border-green-500 bg-green-900/20"
                        : "border-red-500 bg-red-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Step {step.step}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          step.action === "added"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {step.action.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Edge:</span>{" "}
                        {step.edge.from} - {step.edge.to}
                      </div>
                      <div>
                        <span className="text-gray-400">Weight:</span>{" "}
                        {step.edge.weight}
                      </div>
                      <div>
                        <span className="text-gray-400">Reason:</span>{" "}
                        {step.reason}
                      </div>
                      <div>
                        <span className="text-gray-400">Total Weight:</span>{" "}
                        {step.totalWeight}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prim" && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">
                Prim Algorithm Solution
              </h3>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Algorithm Steps:</h4>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. Start with an arbitrary vertex</li>
                  <li>2. Add it to MST set</li>
                  <li>
                    3. Find minimum weight edge connecting MST to non-MST vertex
                  </li>
                  <li>4. Add that edge and vertex to MST</li>
                  <li>5. Repeat until all vertices are in MST</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">
                  Step-by-Step Execution:
                </h4>
                <div className="p-4 rounded border-l-4 border-purple-500 bg-purple-900/20">
                  <div className="font-semibold mb-2">Initial Step</div>
                  <div className="text-sm">
                    <span className="text-gray-400">Starting vertex:</span>{" "}
                    {gameData.transformers[0].id}
                  </div>
                </div>

                {primSteps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 rounded border-l-4 border-purple-500 bg-purple-900/20"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Step {step.step}</span>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500 text-white">
                        ADDED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Edge:</span>{" "}
                        {step.edge.from} - {step.edge.to}
                      </div>
                      <div>
                        <span className="text-gray-400">Weight:</span>{" "}
                        {step.edge.weight}
                      </div>
                      <div>
                        <span className="text-gray-400">New Vertex:</span>{" "}
                        {step.newVertex}
                      </div>
                      <div>
                        <span className="text-gray-400">Total Weight:</span>{" "}
                        {step.totalWeight}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-400">MST Set:</span>{" "}
                      {step.visitedSet.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => router.push("/game")}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
