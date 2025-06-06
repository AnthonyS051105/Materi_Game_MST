// FILE: src/app/implementasi/page.js
"use client";

import { useState } from "react";
import {
  Lightbulb,
  Zap,
  MapPin,
  Settings,
  Play,
  RotateCcw,
} from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";

export default function Implementasi() {
  const [activeSection, setActiveSection] = useState("overview");
  const [simulationStep, setSimulationStep] = useState(0);

  // Power Grid Network Data
  const powerStations = [
    { id: "PS1", label: "Central Plant", x: 300, y: 100, type: "main" },
    { id: "PS2", label: "North Sub", x: 200, y: 150, type: "sub" },
    { id: "PS3", label: "South Sub", x: 400, y: 150, type: "sub" },
    { id: "PS4", label: "East Sub", x: 500, y: 200, type: "sub" },
    { id: "PS5", label: "West Sub", x: 150, y: 250, type: "sub" },
    { id: "PS6", label: "Industrial", x: 350, y: 300, type: "industrial" },
  ];

  const powerLines = [
    { from: "PS1", to: "PS2", weight: 45, cost: "45M", distance: "12km" },
    { from: "PS1", to: "PS3", weight: 38, cost: "38M", distance: "10km" },
    { from: "PS2", to: "PS4", weight: 52, cost: "52M", distance: "15km" },
    { from: "PS2", to: "PS5", weight: 28, cost: "28M", distance: "8km" },
    { from: "PS3", to: "PS4", weight: 31, cost: "31M", distance: "9km" },
    { from: "PS3", to: "PS6", weight: 42, cost: "42M", distance: "11km" },
    { from: "PS4", to: "PS6", weight: 35, cost: "35M", distance: "10km" },
    { from: "PS5", to: "PS6", weight: 48, cost: "48M", distance: "13km" },
  ];

  const mstSolution = [
    { from: "PS2", to: "PS5", weight: 28, cost: "28M" },
    { from: "PS3", to: "PS4", weight: 31, cost: "31M" },
    { from: "PS4", to: "PS6", weight: 35, cost: "35M" },
    { from: "PS1", to: "PS3", weight: 38, cost: "38M" },
    { from: "PS1", to: "PS2", weight: 45, cost: "45M" },
  ];

  // CORRECTED: Benefits with Academic References
  const benefits = [
    {
      title: "Optimasi Biaya Infrastruktur",
      description:
        "MST membantu meminimalkan total biaya pembangunan dengan memilih jalur transmisi yang paling efisien",
      icon: "💰",
      evidence:
        "Penelitian UPPCL India (Nature, 2024): 7-9% cost reduction per line",
    },
    {
      title: "Return on Investment",
      description:
        "Setiap investasi $1 pada transmission dapat menghemat $1.60-$1.80 dalam system costs",
      icon: "⚡",
      evidence: "DOE National Transmission Planning Study (2024)",
    },
    {
      title: "Peningkatan Reliabilitas",
      description:
        "Struktur tree yang optimal dapat mendukung grid reliability hingga 99.95%",
      icon: "🔒",
      evidence: "NREL Grid Reliability Study (2024)",
    },
    {
      title: "Efisiensi Operational",
      description:
        "Struktur sederhana memudahkan monitoring, maintenance dan grid management",
      icon: "🔧",
      evidence: "Grid modernization research menunjukkan improved efficiency",
    },
  ];

  const implementationSteps = [
    "Identifikasi semua titik pembangkit dan distribusi listrik",
    "Hitung biaya pembangunan kabel antar titik (jarak × biaya per km)",
    "Terapkan algoritma MST (Kruskal/Prim) untuk mencari konfigurasi minimum",
    "Verifikasi bahwa semua titik terhubung dan tidak ada loop",
    "Implementasi fisik sesuai hasil MST",
  ];

  const challenges = [
    {
      challenge: "Keterbatasan Geografis",
      solution:
        "Modifikasi bobot edge berdasarkan topografi dan rintangan geografis",
      impact: "Medium",
    },
    {
      challenge: "Kapasitas Transmisi",
      solution:
        "Tambahkan constraint kapasitas pada setiap edge dalam algoritma",
      impact: "High",
    },
    {
      challenge: "Regulasi dan Perizinan",
      solution: "Integrasikan zona terlarang sebagai infinite weight edges",
      impact: "Medium",
    },
    {
      challenge: "Fault Tolerance",
      solution: "Implementasi multiple MST atau tambahan redundant paths",
      impact: "High",
    },
  ];

  const handleSimulationStep = () => {
    if (simulationStep < mstSolution.length) {
      setSimulationStep(simulationStep + 1);
    }
  };

  const resetSimulation = () => {
    setSimulationStep(0);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Lightbulb className="mx-auto h-16 w-16 text-yellow-600 mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Implementasi MST: Power Grid System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Penerapan Minimum Spanning Tree dalam merancang sistem jaringan
            distribusi listrik yang efisien dan ekonomis
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: Lightbulb },
                { id: "simulation", label: "Simulasi", icon: Zap },
                { id: "benefits", label: "Manfaat", icon: Settings },
                { id: "challenges", label: "Tantangan", icon: MapPin },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeSection === tab.id
                        ? "border-yellow-500 text-yellow-600"
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
        {activeSection === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-yellow-800">
                Mengapa MST untuk Power Grid?
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Sistem distribusi listrik memerlukan jaringan yang
                  menghubungkan semua titik konsumsi dengan biaya infrastruktur
                  minimum. MST menjadi solusi ideal karena:
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-blue-800">
                      Karakteristik Power Grid
                    </h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>• Harus menghubungkan semua titik distribusi</li>
                      <li>• Tidak boleh ada loop (circuit) listrik</li>
                      <li>• Biaya pembangunan sangat tinggi</li>
                      <li>• Memerlukan optimasi jarak dan biaya</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-green-800">
                      Solusi MST
                    </h3>
                    <ul className="space-y-2 text-green-700 text-sm">
                      <li>• Menghubungkan semua vertex (stations)</li>
                      <li>• Tidak ada cycle (tree structure)</li>
                      <li>• Meminimalkan total bobot (cost)</li>
                      <li>• Optimal untuk struktur distribusi</li>
                    </ul>
                  </div>
                </div>

                <p>
                  Dalam konteks power grid, setiap vertex merepresentasikan
                  pembangkit listrik, gardu induk, atau titik distribusi. Edge
                  merepresentasikan jalur transmisi dengan bobot berupa biaya
                  pembangunan kabel dan tower.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">
                Langkah Implementasi
              </h3>
              <div className="space-y-4">
                {implementationSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CORRECTED: Research-based Examples */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                🔬 Penelitian & Implementasi MST
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Academic Research</h4>
                  <p className="text-yellow-100 text-sm">
                    IEEE papers menunjukkan efektivitas algoritma Kruskal untuk
                    power system restoration dalam distribution networks
                    (2019-2024).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">India Power Grid</h4>
                  <p className="text-yellow-100 text-sm">
                    UPPCL mengoptimasi 400kV transmission lines dengan prinsip
                    MST, mencapai cost reduction 7-9% per line (Nature, 2024).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">US Grid Studies</h4>
                  <p className="text-yellow-100 text-sm">
                    DOE National Transmission Planning Study menunjukkan ROI
                    $1.60-$1.80 per dollar investasi transmission (PNNL/NREL,
                    2024).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "simulation" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-yellow-800">
                Simulasi Power Grid MST
              </h2>

              {/* Disclaimer untuk simulasi */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>📋 Catatan:</strong> Simulasi berikut menggunakan data
                  ilustratif untuk mendemonstrasikan konsep MST dalam power
                  grid. Nilai-nilai actual akan bervariasi berdasarkan kondisi
                  geografis dan teknis.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <InteractiveGraph
                    nodes={powerStations}
                    edges={powerLines}
                    highlightedEdges={mstSolution.slice(0, simulationStep)}
                    title="Power Grid Network"
                  />

                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={handleSimulationStep}
                      disabled={simulationStep >= mstSolution.length}
                      className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                      <Play size={16} />
                      <span>Add Connection</span>
                    </button>

                    <button
                      onClick={resetSimulation}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      <RotateCcw size={16} />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Statistik Jaringan</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Stations:</span>
                        <span className="ml-2 font-bold">
                          {powerStations.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Connections Built:
                        </span>
                        <span className="ml-2 font-bold">
                          {simulationStep}/{mstSolution.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Cost:</span>
                        <span className="ml-2 font-bold text-green-600">
                          $
                          {mstSolution
                            .slice(0, simulationStep)
                            .reduce((sum, edge) => sum + edge.weight, 0)}
                          M
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total MST Cost:</span>
                        <span className="ml-2 font-bold">
                          $
                          {mstSolution.reduce(
                            (sum, edge) => sum + edge.weight,
                            0
                          )}
                          M
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">
                    Construction Progress
                  </h3>
                  <div className="space-y-3">
                    {mstSolution.map((edge, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          index < simulationStep
                            ? "bg-green-50 border-green-200"
                            : index === simulationStep
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {edge.from} ↔ {edge.to}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {edge.cost}
                          </span>
                        </div>
                        {index < simulationStep && (
                          <div className="text-xs text-green-600 mt-1">
                            ✅ Completed
                          </div>
                        )}
                        {index === simulationStep && (
                          <div className="text-xs text-yellow-600 mt-1">
                            🚧 Next to build
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {simulationStep === mstSolution.length && (
                    <div className="mt-6 bg-green-100 border border-green-300 p-4 rounded-lg">
                      <h4 className="font-bold text-green-800 mb-2">
                        🎉 Grid Complete!
                      </h4>
                      <p className="text-green-700 text-sm">
                        All power stations are now connected with minimum cost
                        infrastructure. Total savings compared to full mesh: $
                        {powerLines.reduce(
                          (sum, edge) => sum + edge.weight,
                          0
                        ) -
                          mstSolution.reduce(
                            (sum, edge) => sum + edge.weight,
                            0
                          )}
                        M
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Power Lines Comparison</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Connection</th>
                      <th className="px-4 py-2 text-left">Distance</th>
                      <th className="px-4 py-2 text-left">Cost</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {powerLines.map((line, index) => {
                      const inMST = mstSolution.some(
                        (mstEdge) =>
                          (mstEdge.from === line.from &&
                            mstEdge.to === line.to) ||
                          (mstEdge.from === line.to && mstEdge.to === line.from)
                      );

                      return (
                        <tr
                          key={index}
                          className={inMST ? "bg-green-50" : "bg-red-50"}
                        >
                          <td className="px-4 py-2">
                            {line.from} - {line.to}
                          </td>
                          <td className="px-4 py-2">{line.distance}</td>
                          <td className="px-4 py-2">{line.cost}</td>
                          <td className="px-4 py-2">
                            {inMST ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                ✅ In MST
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                ❌ Not needed
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
        )}

        {activeSection === "benefits" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{benefit.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {benefit.description}
                      </p>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs">
                        {benefit.evidence}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CORRECTED: Economic Impact Analysis with Academic References */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">
                Dampak Ekonomis MST dalam Power Grid
              </h3>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-yellow-800 mb-2">
                  ⚠️ Catatan Penting
                </h4>
                <p className="text-yellow-700 text-sm">
                  Analisis berikut berdasarkan penelitian akademis dan studi
                  empiris. Nilai spesifik akan bervariasi tergantung kondisi
                  geografis, regulasi, dan implementasi.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    $1.60-$1.80
                  </div>
                  <div className="text-blue-800 font-medium">
                    Return per $1 Investment
                  </div>
                  <div className="text-blue-600 text-sm">
                    DOE National Transmission Study
                  </div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    7-9%
                  </div>
                  <div className="text-green-800 font-medium">
                    Cost Reduction per Line
                  </div>
                  <div className="text-green-600 text-sm">
                    UPPCL India Case Study
                  </div>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    99.95%
                  </div>
                  <div className="text-purple-800 font-medium">
                    US Grid Reliability
                  </div>
                  <div className="text-purple-600 text-sm">
                    NREL Grid Reliability Study
                  </div>
                </div>
              </div>

              {/* Academic Sources */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">
                  📚 Referensi Akademis
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>
                      • National Transmission Planning Study (2024):
                    </strong>
                    &ldquo;For every one dollar spent on new transmission, the
                    researchers found, $1.60–$1.80 would be saved in system
                    costs&rdquo; - DOE/PNNL/NREL
                  </p>
                  <p>
                    <strong>• UPPCL India Case Study (2024):</strong>
                    &ldquo;UPPCL reports that the optimization reduces the line
                    cost by 7–9% for every line&rdquo; - Nature Scientific
                    Reports
                  </p>
                  <p>
                    <strong>• US Grid Reliability (2024):</strong>
                    &quot;The average U.S. customer loses power less than two
                    times per year for a total of less than five hours, which
                    represents 99.95% reliability&quot; - NREL
                  </p>
                  <p>
                    <strong>• Economic Impact:</strong>
                    &quot;Grid outages cost American businesses $150 billion per
                    year&quot; - US Joint Economic Committee
                  </p>
                </div>
              </div>

              {/* Theoretical vs Practical Considerations */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-green-800">
                    ✅ Manfaat Teoritis MST
                  </h4>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>
                      • Minimisasi total biaya infrastruktur (proven
                      mathematically)
                    </li>
                    <li>• Struktur acyclic mencegah power loops</li>
                    <li>• Optimal connectivity dengan minimal edges</li>
                    <li>• Kemudahan dalam monitoring dan control</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-orange-800">
                    ⚠️ Pertimbangan Praktis
                  </h4>
                  <ul className="space-y-2 text-orange-700 text-sm">
                    <li>• Reliability memerlukan redundancy (trade-off)</li>
                    <li>
                      • Capacity constraints tidak dipertimbangkan MST murni
                    </li>
                    <li>• Geographic dan regulatory limitations</li>
                    <li>• Dynamic load patterns memerlukan adaptasi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "challenges" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-yellow-800">
                Tantangan dan Solusi
              </h2>

              <div className="space-y-6">
                {challenges.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.challenge}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.impact === "High"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.impact} Impact
                      </span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-800 mb-2">
                        💡 Solution:
                      </h4>
                      <p className="text-blue-700 text-sm">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-red-800">
                  ⚠️ Limitations of MST
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      Tidak mempertimbangkan redundancy untuk reliability
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Asumsi static load yang tidak realistis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Tidak mengakomodasi kapasitas transmisi</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Sensitif terhadap perubahan demand pattern</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-green-800">
                  ✅ Enhanced Solutions
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      Multi-objective MST dengan reliability constraints
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Dynamic MST yang adaptif terhadap load changes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Capacitated MST dengan flow constraints</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Hybrid approach dengan backup connections</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                🔮 Future Developments
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">AI-Enhanced MST</h4>
                  <p className="text-purple-100 text-sm">
                    Machine learning untuk prediksi demand dan optimasi
                    real-time MST configuration.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quantum Computing</h4>
                  <p className="text-purple-100 text-sm">
                    Quantum algorithms untuk MST pada massive scale power grids
                    dengan millions of nodes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">IoT Integration</h4>
                  <p className="text-purple-100 text-sm">
                    Smart sensors dan IoT devices untuk dynamic weight
                    adjustment dalam MST algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Academic Disclaimer */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                📋 Disclaimer & Referensi Lengkap
              </h3>
              <div className="text-blue-700 space-y-3">
                <div>
                  <p className="text-sm font-medium">
                    <strong>Data Numerik:</strong> Angka-angka dalam simulasi di
                    atas adalah ilustrasi untuk tujuan pembelajaran, bukan data
                    riil dari proyek spesifik.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">
                    <strong>Referensi Akademik Utama:</strong>
                  </p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>
                      • Mohamad, H. et al. (2019). &quot;Power system
                      restoration in distribution network using minimum spanning
                      tree - Kruskal&apos;s algorithm.&quot; Indonesian Journal
                      of Electrical Engineering and Computer Science.
                    </li>
                    <li>
                      • Liao, N. et al. (2020). &quot;Application of
                      neutrosophic minimum spanning tree in electrical power
                      distribution network.&quot; CAAI Transactions on
                      Intelligence Technology.
                    </li>
                    <li>
                      • PNNL/NREL (2024). &quot;National Transmission Planning
                      Study.&quot; U.S. Department of Energy.
                    </li>
                    <li>
                      • Nature Scientific Reports (2024). &quot;Improving the
                      efficiency and reliability of India&apos;s power grid
                      through targeted EHV transmission line investments: a case
                      of UPPCL.&quot;
                    </li>
                    <li>
                      • NREL (2024). &quot;Top 10 Things To Know About Power
                      Grid Reliability.&quot;
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm">
                    <strong>Implementasi Nyata:</strong> Prinsip MST memang
                    digunakan dalam perencanaan grid, namun dengan kompleksitas
                    tambahan seperti capacity constraints, reliability factors,
                    dan regulatory compliance.
                  </p>
                </div>

                <div>
                  <p className="text-sm">
                    <strong>Konteks Pembelajaran:</strong> Website ini dibuat
                    untuk tujuan edukasi algoritma MST. Untuk implementasi
                    actual power grid, diperlukan analisis engineering yang
                    komprehensif dengan pertimbangan teknis, ekonomis, dan
                    regulasi yang lebih detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
