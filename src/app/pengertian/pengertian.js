"use client";

import { useState } from "react";
import { CheckCircle, XCircle, BookOpen, Lightbulb } from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";

export default function Pengertian() {
  const [activeTab, setActiveTab] = useState("definition");

  const graphNodes = [
    { id: "A", label: "A", x: 100, y: 100 },
    { id: "B", label: "B", x: 300, y: 100 },
    { id: "C", label: "C", x: 500, y: 100 },
    { id: "D", label: "D", x: 200, y: 250 },
    { id: "E", label: "E", x: 400, y: 250 },
  ];

  const graphEdges = [
    { from: "A", to: "B", weight: 4 },
    { from: "B", to: "C", weight: 3 },
    { from: "C", to: "E", weight: 6 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "D", weight: 1 },
    { from: "B", to: "E", weight: 5 },
    { from: "D", to: "E", weight: 7 },
  ];

  const mstEdges = [
    { from: "B", to: "D", weight: 1 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "E", weight: 5 },
  ];

  const characteristics = [
    {
      title: "Terhubung (Connected)",
      description: "Semua vertex dapat dijangkau dari vertex lainnya",
      icon: CheckCircle,
      example: "Dalam MST, tidak ada vertex yang terisolasi",
    },
    {
      title: "Asiklik (Acyclic)",
      description: "Tidak mengandung siklus atau cycle",
      icon: CheckCircle,
      example: "Tidak ada jalur tertutup dalam MST",
    },
    {
      title: "Jumlah Edge = V - 1",
      description: "Untuk V vertex, MST memiliki tepat V-1 edge",
      icon: CheckCircle,
      example: "Graf dengan 5 vertex memiliki 4 edge dalam MST",
    },
    {
      title: "Bobot Minimum",
      description: "Total bobot edge adalah yang terkecil",
      icon: CheckCircle,
      example: "Dari semua spanning tree, MST memiliki bobot terkecil",
    },
  ];

  const requirements = [
    {
      condition: "Graf harus berbobot",
      valid: true,
      explanation: "Setiap edge memiliki nilai bobot yang dapat dibandingkan",
    },
    {
      condition: "Graf harus terhubung",
      valid: true,
      explanation: "Semua vertex dapat dijangkau dari vertex lainnya",
    },
    {
      condition: "Graf tidak berarah (opsional)",
      valid: true,
      explanation:
        "MST umumnya diterapkan pada graf tidak berarah, tapi bisa juga pada graf berarah",
    },
    {
      condition: "Graf boleh memiliki siklus",
      valid: true,
      explanation:
        "Graf asli boleh memiliki siklus, tapi MST yang dihasilkan tidak boleh",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="mx-auto h-16 w-16 text-blue-600 mb-4 animate-bounce-gentle" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pengertian & Karakteristik MST
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Memahami konsep dasar Minimum Spanning Tree dan syarat-syarat yang
            harus dipenuhi
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "definition", label: "Pengertian", icon: BookOpen },
                {
                  id: "characteristics",
                  label: "Karakteristik",
                  icon: CheckCircle,
                },
                { id: "requirements", label: "Syarat", icon: Lightbulb },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
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
        {activeTab === "definition" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">
                Apa itu Minimum Spanning Tree?
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  <strong>Minimum Spanning Tree (MST)</strong> adalah sebuah
                  spanning tree dari graf berbobot yang memiliki total bobot
                  edge paling minimum. Spanning tree sendiri adalah subgraf yang
                  menghubungkan semua vertex dalam graf asli tanpa membentuk
                  siklus.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-2 text-blue-800">
                    Definisi Formal:
                  </h3>
                  <p className="text-blue-700">
                    Untuk graf G = (V, E) dengan bobot w(e) pada setiap edge e,
                    MST adalah spanning tree T yang meminimalkan ∑w(e) untuk
                    semua e ∈ T.
                  </p>
                </div>

                <p>
                  MST memiliki aplikasi yang sangat luas dalam kehidupan nyata,
                  seperti merancang jaringan komunikasi dengan biaya minimum,
                  sistem distribusi listrik, perencanaan transportasi, dan
                  banyak lagi.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <InteractiveGraph
                nodes={graphNodes}
                edges={graphEdges}
                title="Graf Asli"
              />
              <InteractiveGraph
                nodes={graphNodes}
                edges={mstEdges}
                highlightedEdges={mstEdges}
                title="Minimum Spanning Tree"
              />
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                💡 Contoh Sederhana
              </h3>
              <p className="text-green-700">
                Bayangkan Anda ingin menghubungkan 5 kota dengan kabel internet.
                Setiap pasang kota memiliki biaya pemasangan kabel yang berbeda.
                MST akan membantu Anda menemukan cara menghubungkan semua kota
                dengan biaya total minimum, tanpa membuat jalur yang berlebihan.
              </p>
            </div>
          </div>
        )}

        {activeTab === "characteristics" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">
                Karakteristik MST
              </h2>

              <div className="grid gap-6">
                {characteristics.map((char, index) => {
                  const Icon = char.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {char.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{char.description}</p>
                        <div className="bg-blue-100 p-3 rounded text-sm text-blue-800">
                          <strong>Contoh:</strong> {char.example}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-blue-800">
                Sifat Matematika MST
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-purple-800">
                    Cut Property
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Untuk setiap cut dalam graf, edge dengan bobot minimum yang
                    melintasi cut tersebut pasti berada dalam MST.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-orange-800">
                    Cycle Property
                  </h4>
                  <p className="text-orange-700 text-sm">
                    Untuk setiap cycle dalam graf, edge dengan bobot maksimum
                    dalam cycle tersebut tidak akan berada dalam MST.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">
                Syarat-syarat MST
              </h2>

              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {req.valid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {req.condition}
                      </h3>
                      <p className="text-gray-600 text-sm">{req.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  ✅ Graf yang Valid untuk MST
                </h3>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Graf terhubung dan berbobot</li>
                  <li>• Memiliki setidaknya 2 vertex</li>
                  <li>• Bobot edge dapat dibandingkan</li>
                  <li>• Tidak perlu planar atau sederhana</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold mb-3 text-red-800">
                  ❌ Graf yang Tidak Valid
                </h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Graf tidak terhubung</li>
                  <li>• Graf tanpa bobot</li>
                  <li>• Graf dengan 1 vertex saja</li>
                  <li>• Graf dengan bobot yang tidak dapat dibandingkan</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
