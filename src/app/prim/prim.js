"use client";

import { useState } from "react";
import { Zap, Play, RotateCcw } from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";
import AlgorithmStep from "../components/AlgorithmStep";
import TextEditor from "../components/TextEditor";
import PseudoText from "../components/Pseudocode";

const primCode = `// Kode algoritma prim
typedef pair<int, int> pii;
int spanningTree(int V, int E, vector<vector<int>> &edges) {
    vector<vector<int>> adj[V];
    for (int i = 0; i < E; i++) {
        int u = edges[i][0];
        int v = edges[i][1];
        int wt = edges[i][2];
        adj[u].push_back({v, wt});
        adj[v].push_back({u, wt});
    }
    
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<bool> visited(V, false);
    int res = 0;
    pq.push({0, 0});
    while(!pq.empty()){
        auto p = pq.top();
        pq.pop();
        
        int wt = p.first;  
        int u = p.second;  
        if(visited[u] == true){
            continue;  
        }

        res += wt;  
        visited[u] = true;  
        for(auto v : adj[u]){
            if(visited[v[0]] == false){
                pq.push({v[1], v[0]}); 
            }
        }
    }
    return res;
}
`;

const mainCode = `// implementasi algoritma prim
int main() {
    vector<vector<int>> graph = {{0, 1, 7},
                                {0, 3, 5},
                                {0, 4, 6},
                                {1, 3, 9},
                                {1, 2, 8},
                                {2, 3, 7},
                                {2, 4, 5},
                                {3, 4, 15}};
    cout << spanningTree(5, 8, graph) << endl;

    return 0;
}
`;

const primPseudoCode = `FUNCTION spanning Tree (V, E, edges): 
  adj = ARRAY[V] OF LISTS 
  FOR 1 FROM 0 TO E-1: 
    u, v, wt edges[i][8], edges[i][1], edges[i][2] 
    adj [u].ADD((v, wt)) 
    adj[v].ADD((u, wt)) 
  pq = MIN-HEAP OF (weight, node) PAIRS 
  visited = ARRAY [V] INITIALIZED TO False 
  res = 0 
  pq.PUSH((0, 0)) 
  WHILE NOT pq. EMPTY(): 
    wt, u = pq.POP() 
    IF visited[u]: 
      CONTINUE 
    res += wt 
    visited[u] = True 
    FOR (v, edge_wt) IN adj[u]: 
      IF NOT visited[v]: 
        pq.PUSH((edge_wt, v)) 
  RETURN res 
`;

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
            Algoritma Prim adalah algoritma greedy yang digunakan untuk mencari
            Minimum Spanning Tree (MST) dari sebuah graf berbobot dan terhubung.
            Algoritma ini dimulai dari satu simpul dan secara bertahap
            menambahkan sisi dengan bobot terkecil yang menghubungkan simpul
            yang sudah dikunjungi ke simpul yang belum dikunjungi.
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
                  <span>Tambahkan edge dan vertex baru ke MST </span>
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
                    O(V²) atau O((E + V) log V)
                  </span>
                </div>
                <div>
                  <span className="font-medium">Space Complexity:</span>
                  <span className="ml-2 bg-purple-100 px-2 py-1 rounded text-sm">
                    O(V) atau O(E + V)
                  </span>
                </div>
                <p className="text-purple-700 text-sm mt-3">
                  O(V²) dengan array, O((E + V) log V) dengan priority queue
                  (heap). Lebih efisien untuk dense graph.
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
        <h1 className="text-2xl font-bold mb-6 text-purple-800 pt-4 pb-2">
          Pseudocode Algoritma Kruskal
        </h1>
        <div className="flex justify-center items-center pt-2">
          <PseudoText pseudoCode={primPseudoCode} />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-purple-800 pt-4 pb-2">
          Implementasi Algoritma Prim dalam C++
        </h1>
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TextEditor cppCode={primCode} />
          <TextEditor cppCode={mainCode} />
        </div>
      </div>
    </div>
  );
}
