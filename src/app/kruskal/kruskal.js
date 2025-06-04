"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";
import AlgorithmStep from "../components/AlgorithmStep";
import TextEditor from "../components/TextEditor";
import PseudoText from "../components/Pseudocode";

const edgeCode = `// Kode structure Edge
struct Edge {
    int u, v, weight;

    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};`;

const unionFindCode = ` // Kode disjoint-set (UnionFind)
class UnionFind {
    private:
        vector<int> parent, rank;
    public:
        UnionFind(int n) {
            parent.resize(n);
            rank.resize(n, 0);
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            if (rootX == rootY) return false;

            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
};
`;

const kruskalCode = ` // Kode kruskal
int kruskal(int n, vector<Edge>& edges, vector<Edge>& mst) {
    sort(edges.begin(), edges.end());
    UnionFind uf(n);
    int mstWeight = 0;

    for (const auto& edge : edges) {
        if (uf.unite(edge.u, edge.v)) {
            mst.push_back(edge);
            mstWeight += edge.weight;
        }
    }

    return mstWeight;
}
`;

const mainCode = ` // Kode implementasi algoritma kruskal
int main() {
    int n = 5;
    vector<Edge> edges = {
        {0, 1, 10},
        {0, 2, 6},
        {0, 3, 5},
        {1, 3, 15},
        {2, 3, 4}
    };

    vector<Edge> mst;
    int totalWeight = kruskal(n, edges, mst);

    cout << "Total weight of MST: " << totalWeight << endl;
    cout << "Edges in MST:" << endl;
    for (const auto& edge : mst) {
        cout << edge.u << " - " << edge.v << " : " << edge.weight << endl;
    }

    return 0;
}
`;

const kruskalPseudoCode = `FUNCTION kruskal(n, edges):
  SORT(edges by weight)
  uf = UnionFind(n), mst=[], weight=0
  FOR edge IN edges:
    IF uf.unite(edge.u, edge.v):
      mst.add(edge), weight += edge.weight
  RETURN (mst, weight)
`;

export default function Kruskal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEdges, setSelectedEdges] = useState([]);

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

  const sortedEdges = [
    { from: "A", to: "D", weight: 5 },
    { from: "C", to: "E", weight: 5 },
    { from: "E", to: "A", weight: 6 },
    { from: "A", to: "B", weight: 7 },
    { from: "C", to: "D", weight: 7 },
  ];

  const steps = [
    "Urutkan semua edge berdasarkan bobot dari terkecil ke terbesar",
    "Pilih edge dengan bobot 5: A-D (tidak membentuk cycle)",
    "Pilih edge dengan bobot 5: C-E (tidak membentuk cycle)",
    "Pilih edge dengan bobot 6: E-A (tidak membentuk cycle)",
    "Pilih edge dengan bobot 7: A-B (tidak membentuk cycle)",
    "MST selesai! Total bobot: 23",
  ];

  const handlePlay = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        if (currentStep < 4) {
          setSelectedEdges([...selectedEdges, sortedEdges[currentStep]]);
        }
        setIsAnimating(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedEdges([]);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Settings
            className="mx-auto h-16 w-16 text-green-600 mb-4 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algoritma Kruskal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Algoritma Kruskal adalah algoritma greedy di dalam teori graph yang
            bertujuan untuk mencari Minimum Spanning Tree (MST). Algoritma ini
            bekerja dengan cara memilih edge yang memiliki bobot terkecil satu
            per satu tanpa membentuk siklus hingga semua simpul terhubung.
          </p>
        </div>

        {/* Algorithm Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-green-800">
            Cara Kerja Algoritma Kruskal
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Langkah-langkah:</h3>
              <ol className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Urutkan semua edge berdasarkan bobot (ascending)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Inisialisasi Union-Find untuk deteksi cycle</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Untuk setiap edge, periksa apakah menambahkannya akan
                    membentuk cycle
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Jika tidak membentuk cycle, tambahkan edge ke MST</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>Ulangi hingga MST memiliki V-1 edge</span>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-800">
                Kompleksitas
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Time Complexity:</span>
                  <span className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">
                    O(E log E) or O(E log V)
                  </span>
                </div>
                <div>
                  <span className="font-medium">Space Complexity:</span>
                  <span className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">
                    O(E + V)
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-3">
                  Dominan pada sorting edge. Union-Find operations hampir
                  konstan dengan path compression.
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
              title="Simulasi Algoritma Kruskal"
            />

            {/* Controls */}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handlePlay}
                disabled={isAnimating || currentStep >= steps.length - 1}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {steps.map((step, index) => (
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

        {/* Edge Table */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">Tabel Edge Terurut</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Edge</th>
                  <th className="px-4 py-2 text-left">Bobot</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {sortedEdges.map((edge, index) => {
                  const isSelected = selectedEdges.some(
                    (e) =>
                      (e.from === edge.from && e.to === edge.to) ||
                      (e.from === edge.to && e.to === edge.from)
                  );
                  const isPending = index === currentStep - 1;

                  return (
                    <tr
                      key={index}
                      className={`${
                        isPending
                          ? "bg-yellow-50"
                          : isSelected
                          ? "bg-green-50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono">
                        {edge.from} - {edge.to}
                      </td>
                      <td className="px-4 py-2">{edge.weight}</td>
                      <td className="px-4 py-2">
                        {isSelected ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Dipilih
                          </span>
                        ) : isPending ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                            Sedang diproses
                          </span>
                        ) : index < currentStep ? (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            Dilewati
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-sm">
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {isSelected
                          ? "Tidak membentuk cycle"
                          : isPending
                          ? "Sedang diperiksa..."
                          : index < currentStep
                          ? "Tidak diperlukan"
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-green-800 pt-4 pb-2">
          Pseudocode Algoritma Kruskal
        </h1>
        <div className="flex justify-center items-center pt-2">
          <PseudoText pseudoCode={kruskalPseudoCode} />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-green-800 pt-4 pb-2">
          Implementasi Algoritma Kruskal dalam C++
        </h1>
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TextEditor cppCode={edgeCode} />
          <TextEditor cppCode={unionFindCode} />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TextEditor cppCode={kruskalCode} />
          <TextEditor cppCode={mainCode} />
        </div>
      </div>
    </div>
  );
}
