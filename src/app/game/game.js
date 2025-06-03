"use client";

import { useState } from "react";
import { Zap, Play, RotateCcw } from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";
import AlgorithmStep from "../components/AlgorithmStep";

export default function Prim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(["A"]);

  const nodes = [
    { id: "A", label: "A", x: 150, y: 100 },
    { id: "B", label: "B", x: 350, y: 100 },
    { id: "C", label: "C", x: 450, y: 200 },
    { id: "D", label: "D", x: 250, y: 200 },
    { id: "E", label: "E", x: 150, y: 300 },
  ];

  const edges = [
    { from: "A", to: "B", weight: 7 },
    { from: "A", to: "D", weight: 5 },
    { from: "B", to: "C", weight: 8 },
    { from: "B", to: "D", weight: 9 },
    { from: "C", to: "D", weight: 7 },
    { from: "C", to: "E", weight: 5 },
    { from: "D", to: "E", weight: 15 },
    { from: "E", to: "A", weight: 6 },
  ];

  const primSteps = [
    {
      edge: { from: "A", to: "D", weight: 5 },
      newNode: "D",
      description: "Mulai dari A, pilih edge A-D dengan bobot minimum (5)",
    },
    {
      edge: { from: "E", to: "A", weight: 6 },
      newNode: "E",
      description: "Dari {A,D}, pilih edge E-A dengan bobot minimum (6)",
    },
    {
      edge: { from: "C", to: "E", weight: 5 },
      newNode: "C",
      description: "Dari {A,D,E}, pilih edge C-E dengan bobot minimum (5)",
    },
    {
      edge: { from: "A", to: "B", weight: 7 },
      newNode: "B",
      description: "Dari {A,D,E,C}, pilih edge A-B dengan bobot minimum (7)",
    },
  ];

  const algorithmSteps = [
    "Mulai dengan vertex A sebagai starting point",
    "Pilih edge A-D (bobot 5) - edge minimum dari A",
    "Pilih edge E-A (bobot 6) - edge minimum yang menghubungkan ke vertex baru",
    "Pilih edge C-E (bobot 5) - edge minimum yang menghubungkan ke vertex baru",
    "Pilih edge A-B (bobot 7) - edge minimum yang menghubungkan ke vertex baru",
    "MST selesai! Total bobot: 23",
  ];

  const handlePlay = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);

        if (newStep <= primSteps.length) {
          const stepData = primSteps[newStep - 1];
          setSelectedEdges([...selectedEdges, stepData.edge]);
          setVisitedNodes([...visitedNodes, stepData.newNode]);
        }
        setIsAnimating(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedEdges([]);
    setVisitedNodes(["A"]);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Zap className="mx-auto h-16 w-16 text-purple-600 mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algoritma Prim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Algoritma greedy yang membangun MST dengan menambahkan vertex satu
            per satu melalui edge berbobot minimum
          </p>
        </div>

        {/* Algorithm Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">
            Cara Kerja Algoritma Prim
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Langkah-langkah:</h3>
              <ol className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Pilih vertex awal (arbitrary)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Masukkan vertex ke dalam MST set</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Temukan edge berbobot minimum yang menghubungkan MST set
                    dengan vertex di luar
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Tambahkan edge dan vertex baru ke MST</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>Ulangi hingga semua vertex termasuk dalam MST</span>
                </li>
              </ol>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-800">
                Kompleksitas
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Time Complexity:</span>
                  <span className="ml-2 bg-purple-100 px-2 py-1 rounded text-sm">
                    O(V²) atau O(E log V)
                  </span>
                </div>
                <div>
                  <span className="font-medium">Space Complexity:</span>
                  <span className="ml-2 bg-purple-100 px-2 py-1 rounded text-sm">
                    O(V)
                  </span>
                </div>
                <p className="text-purple-700 text-sm mt-3">
                  O(V²) dengan array, O(E log V) dengan priority queue (heap).
                  Lebih efisien untuk dense graph.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Simulation */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <InteractiveGraph
              nodes={nodes}
              edges={edges}
              highlightedEdges={selectedEdges}
              title="Simulasi Algoritma Prim"
            />

            {/* Controls */}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handlePlay}
                disabled={
                  isAnimating || currentStep >= algorithmSteps.length - 1
                }
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                <span>Next Step</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Step-by-Step Process</h3>
            <div className="space-y-3">
              {algorithmSteps.map((step, index) => (
                <AlgorithmStep
                  key={index}
                  step={index + 1}
                  isActive={currentStep === index}
                >
                  {step}
                </AlgorithmStep>
              ))}
            </div>
          </div>
        </div>

        {/* MST Set Progress */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">MST Set Progress</h3>
          <div className="space-y-4">
            <div>
              <span className="font-medium">Vertices in MST: </span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {visitedNodes.map((node, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-medium">Remaining vertices: </span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {nodes
                  .filter((node) => !visitedNodes.includes(node.id))
                  .map((node, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {node.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Queue Simulation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">
            Available Edges (Priority Queue)
          </h3>
          <p className="text-gray-600 mb-4">
            Edges yang menghubungkan vertices dalam MST dengan vertices di luar
            MST
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Edge</th>
                  <th className="px-4 py-2 text-left">Bobot</th>
                  <th className="px-4 py-2 text-left">From (MST)</th>
                  <th className="px-4 py-2 text-left">To (Outside)</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {edges
                  .filter((edge) => {
                    const fromInMST = visitedNodes.includes(edge.from);
                    const toInMST = visitedNodes.includes(edge.to);
                    return (fromInMST && !toInMST) || (!fromInMST && toInMST);
                  })
                  .sort((a, b) => a.weight - b.weight)
                  .map((edge, index) => {
                    const fromInMST = visitedNodes.includes(edge.from);
                    const isNextEdge =
                      index === 0 &&
                      currentStep > 0 &&
                      currentStep < algorithmSteps.length - 1;

                    return (
                      <tr
                        key={index}
                        className={isNextEdge ? "bg-yellow-50" : ""}
                      >
                        <td className="px-4 py-2 font-mono">
                          {fromInMST
                            ? `${edge.from} - ${edge.to}`
                            : `${edge.to} - ${edge.from}`}
                        </td>
                        <td className="px-4 py-2 font-bold">{edge.weight}</td>
                        <td className="px-4 py-2">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                            {fromInMST ? edge.from : edge.to}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                            {fromInMST ? edge.to : edge.from}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {isNextEdge ? (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                              Next to select
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
