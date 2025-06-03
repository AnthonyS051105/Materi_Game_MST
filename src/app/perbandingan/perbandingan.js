"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Settings,
} from "lucide-react";

export default function Perbandingan() {
  const [activeComparison, setActiveComparison] = useState("overview");

  const comparisonData = {
    kruskal: {
      name: "Algoritma Kruskal",
      icon: Settings,
      color: "green",
      timeComplexity: "O(E log E)",
      spaceComplexity: "O(E + V)",
      approach: "Edge-based",
      dataStructure: "Union-Find (Disjoint Set)",
      advantages: [
        "Lebih efisien untuk sparse graph (sedikit edge)",
        "Implementasi relatif sederhana",
        "Bekerja dengan baik pada graf dengan banyak komponen",
        "Tidak memerlukan graf terhubung dari awal",
      ],
      disadvantages: [
        "Memerlukan sorting semua edge terlebih dahulu",
        "Kurang efisien untuk dense graph (banyak edge)",
        "Memerlukan struktur data Union-Find",
        "Tidak dapat berhenti di tengah jalan untuk partial MST",
      ],
      bestUse: [
        "Graf dengan jumlah edge relatif sedikit",
        "Ketika semua edge diketahui dari awal",
        "Implementasi yang sederhana diperlukan",
        "Graf yang tidak terlalu dense",
      ],
    },
    prim: {
      name: "Algoritma Prim",
      icon: Zap,
      color: "purple",
      timeComplexity: "O(V²) atau O((E + V) log V)",
      spaceComplexity: "O(E + V)",
      approach: "Vertex-based",
      dataStructure: "Priority Queue/Heap",
      advantages: [
        "Lebih efisien untuk dense graph (banyak edge)",
        "Dapat berhenti kapan saja untuk partial MST",
        "Bekerja secara incremental",
        "Lebih intuitif dalam visualisasi",
      ],
      disadvantages: [
        "Implementasi lebih kompleks dengan priority queue",
        "Memerlukan graf terhubung",
        "Kurang efisien untuk sparse graph",
        "Memerlukan starting vertex",
      ],
      bestUse: [
        "Graf dengan banyak edge (dense graph)",
        "Ketika partial MST diperlukan",
        "Graf yang sudah terhubung",
        "Visualisasi step-by-step",
      ],
    },
  };

  const performanceComparison = [
    {
      criteria: "Dense Graph (V² edges)",
      kruskal: "O(V² log V²) = O(V² log V)",
      prim: "O(V²) atau O(V² log V)",
      winner: "prim",
    },
    {
      criteria: "Sparse Graph (V edges)",
      kruskal: "O(V log V)",
      prim: "O(V²)",
      winner: "kruskal",
    },
    {
      criteria: "Memory Usage",
      kruskal: "O(V) untuk Union-Find",
      prim: "O(V) untuk Priority Queue",
      winner: "tie",
    },
    {
      criteria: "Implementation Complexity",
      kruskal: "Sedang (perlu Union-Find)",
      prim: "Kompleks (perlu Priority Queue)",
      winner: "kruskal",
    },
  ];

  const useCases = [
    {
      scenario: "Jaringan Komunikasi Antar Kota",
      description: "Menghubungkan kota-kota dengan kabel fiber optik",
      bestAlgorithm: "kruskal",
      reason:
        "Graf biasanya sparse (tidak semua kota terhubung langsung), Kruskal lebih efisien",
    },
    {
      scenario: "Jaringan Komputer dalam Gedung",
      description: "Menghubungkan komputer dalam satu gedung/lantai",
      bestAlgorithm: "prim",
      reason:
        "Graf cenderung dense (banyak kemungkinan koneksi), Prim lebih efisien",
    },
    {
      scenario: "Sistem Distribusi Listrik",
      description: "Merancang jaringan distribusi listrik optimal",
      bestAlgorithm: "kruskal",
      reason: "Infrastruktur listrik biasanya berbentuk tree, graf sparse",
    },
    {
      scenario: "Clustering Analysis",
      description: "Mengelompokkan data berdasarkan similarity",
      bestAlgorithm: "prim",
      reason:
        "Dapat berhenti di partial MST, lebih fleksibel untuk analisis bertahap",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <BarChart3 className="mx-auto h-16 w-16 text-orange-600 mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Perbandingan Algoritma Kruskal vs Prim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis mendalam tentang kelebihan, kekurangan, dan kapan
            menggunakan masing-masing algoritma
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "performance", label: "Performance", icon: Clock },
                { id: "usecases", label: "Use Cases", icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveComparison(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeComparison === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeComparison === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(comparisonData).map(([key, data]) => {
                const Icon = data.icon;
                return (
                  <div key={key} className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-3 rounded-lg bg-${data.color}-100`}>
                        <Icon className={`h-8 w-8 text-${data.color}-600`} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {data.name}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`bg-${data.color}-50 p-3 rounded`}>
                          <span className="text-sm font-medium text-gray-600">
                            Time Complexity
                          </span>
                          <p className="font-mono text-sm">
                            {data.timeComplexity}
                          </p>
                        </div>
                        <div className={`bg-${data.color}-50 p-3 rounded`}>
                          <span className="text-sm font-medium text-gray-600">
                            Space Complexity
                          </span>
                          <p className="font-mono text-sm">
                            {data.spaceComplexity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Approach
                        </span>
                        <p className="text-gray-800">{data.approach}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Data Structure
                        </span>
                        <p className="text-gray-800">{data.dataStructure}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(comparisonData).map(([key, data]) => (
                <div key={key} className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3
                      className={`text-lg font-bold mb-4 text-${data.color}-800`}
                    >
                      ✅ Kelebihan {data.name}
                    </h3>
                    <ul className="space-y-2">
                      {data.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle
                            className={`h-5 w-5 text-${data.color}-500 flex-shrink-0 mt-0.5`}
                          />
                          <span className="text-gray-700 text-sm">
                            {advantage}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 text-red-800">
                      ❌ Kekurangan {data.name}
                    </h3>
                    <ul className="space-y-2">
                      {data.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">
                            {disadvantage}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3
                      className={`text-lg font-bold mb-4 text-${data.color}-800`}
                    >
                      🎯 Kapan Menggunakan {data.name}
                    </h3>
                    <ul className="space-y-2">
                      {data.bestUse.map((use, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full bg-${data.color}-500 flex-shrink-0 mt-2`}
                          ></div>
                          <span className="text-gray-700 text-sm">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeComparison === "performance" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                Performance Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kriteria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kruskal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Winner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {performanceComparison.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.criteria}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            item.winner === "kruskal"
                              ? "text-green-800 font-semibold bg-green-50"
                              : "text-gray-600"
                          }`}
                        >
                          {item.kruskal}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            item.winner === "prim"
                              ? "text-purple-800 font-semibold bg-purple-50"
                              : "text-gray-600"
                          }`}
                        >
                          {item.prim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.winner === "kruskal" && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Kruskal
                            </span>
                          )}
                          {item.winner === "prim" && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              Prim
                            </span>
                          )}
                          {item.winner === "tie" && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              Sama
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border border-green-200">
                <h3 className="text-xl font-bold mb-4 text-green-800">
                  Kruskal Unggul Ketika:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Graf sparse (E ≈ V)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Implementasi sederhana dibutuhkan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Graf tidak perlu terhubung dari awal</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 border border-purple-200">
                <h3 className="text-xl font-bold mb-4 text-purple-800">
                  Prim Unggul Ketika:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Graf dense (E ≈ V²)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Partial MST diperlukan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Visualisasi step-by-step</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeComparison === "usecases" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Real-World Use Cases</h2>

              <div className="grid gap-6">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {useCase.scenario}
                        </h3>
                        <p className="text-gray-600">{useCase.description}</p>
                      </div>
                      <div
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                          useCase.bestAlgorithm === "kruskal"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {useCase.bestAlgorithm === "kruskal"
                          ? "Kruskal"
                          : "Prim"}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <span className="font-medium text-gray-700">
                        Alasan:{" "}
                      </span>
                      <span className="text-gray-600">{useCase.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">💡 Kesimpulan</h3>
              <div className="space-y-3 text-blue-100">
                <p>
                  <strong className="text-white">
                    Pilihan algoritma tergantung pada karakteristik graf dan
                    kebutuhan spesifik:
                  </strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    • Untuk <strong className="text-white">sparse graph</strong>{" "}
                    atau implementasi sederhana →{" "}
                    <strong className="text-white">Kruskal</strong>
                  </li>
                  <li>
                    • Untuk <strong className="text-white">dense graph</strong>{" "}
                    atau kebutuhan partial MST →{" "}
                    <strong className="text-white">Prim</strong>
                  </li>
                  <li>
                    • Kedua algoritma menghasilkan{" "}
                    <strong className="text-white">MST yang sama</strong> (jika
                    edge weights unik)
                  </li>
                  <li>
                    • Pemilihan yang tepat dapat meningkatkan{" "}
                    <strong className="text-white">efisiensi signifikan</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
