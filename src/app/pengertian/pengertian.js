"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Globe, // For communication networks
  Building, // For building internet
  Zap, // For electrical networks
  LayoutGrid, // For clustering analysis
  Droplet, // For water/gas pipes
  Cable, // For fiber optics
  Map, // Replaced Road with Map for road networks/routes
} from "lucide-react";
import InteractiveGraph from "../components/InteractiveGraph";

export default function Pengertian() {
  const [activeTab, setActiveTab] = useState("definition");

  // Data Graf Default (untuk tab Pengertian) - tetap sama
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

  // Data Karakteristik MST
  const characteristics = [
    {
      title: "Terhubung (Connected)",
      description: "Semua vertex dapat dijangkau dari vertex lainnya",
      example: "Dalam MST, tidak ada vertex yang terisolasi",
    },
    {
      title: "Asiklik (Acyclic)",
      description: "Tidak mengandung siklus atau cycle",
      example: "Tidak ada jalur tertutup dalam MST",
    },
    {
      title: "Jumlah Edge = V - 1",
      description: "Untuk V vertex, MST memiliki tepat V-1 edge",
      example: "Graf dengan 5 vertex memiliki 4 edge dalam MST",
    },
    {
      title: "Bobot Minimum",
      description: "Total bobot edge adalah yang terkecil",
      example: "Dari semua spanning tree, MST memiliki bobot terkecil",
    },
  ];

  // Data Syarat MST - Diubah agar sesuai styling karakteristik
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

  // Contoh Graf ke MST
  const mstExamples = [
    {
      type: "correct",
      title: "Contoh MST yang Benar",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 250, y: 50 },
          { id: "C", label: "C", x: 400, y: 100 },
          { id: "D", label: "D", x: 250, y: 200 },
        ],
        edges: [
          { from: "A", to: "B", weight: 3 },
          { from: "B", to: "C", weight: 2 },
          { from: "C", to: "D", weight: 4 },
          { from: "D", to: "A", weight: 5 },
          { from: "B", to: "D", weight: 1 },
        ],
      },
      mst: {
        edges: [
          { from: "B", to: "D", weight: 1, color: "red", label: "1" },
          { from: "B", to: "C", weight: 2, color: "red", label: "2" },
          { from: "A", to: "B", weight: 3, color: "red", label: "3" },
        ],
      },
      reason:
        "Ini adalah MST yang benar karena terhubung, tidak memiliki siklus, memiliki V-1 (4-1=3) edge, dan total bobotnya (1+2+3=6) adalah yang minimum.",
    },
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Siklus)",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 250, y: 50 },
          { id: "C", label: "C", x: 400, y: 100 },
          { id: "D", label: "D", x: 250, y: 200 },
        ],
        edges: [
          { from: "A", to: "B", weight: 3 },
          { from: "B", to: "C", weight: 2 },
          { from: "C", to: "D", weight: 4 },
          { from: "D", to: "A", weight: 5 },
          { from: "B", to: "D", weight: 1 },
        ],
      },
      mst: {
        edges: [
          { from: "A", to: "B", weight: 3, color: "red", label: "3" },
          { from: "B", to: "C", weight: 2, color: "red", label: "2" },
          { from: "C", to: "D", weight: 4, color: "red", label: "4" },
          { from: "D", to: "A", weight: 5, color: "red", label: "5" }, // Creates a cycle
        ],
      },
      reason:
        "Ini salah karena membentuk siklus (A-B-C-D-A). MST tidak boleh mengandung siklus.",
    },
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Tidak Terhubung)",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 200, y: 100 },
          { id: "C", label: "C", x: 300, y: 100 },
          { id: "D", label: "D", x: 400, y: 100 },
        ],
        edges: [
          { from: "A", to: "B", weight: 1 },
          { from: "C", to: "D", weight: 2 },
        ],
      },
      mst: {
        edges: [
          { from: "A", to: "B", weight: 1, color: "red", label: "1" },
          { from: "C", to: "D", weight: 2, color: "red", label: "2" },
        ],
      },
      reason:
        "Ini salah karena tidak menghubungkan semua vertex. Vertex B tidak terhubung ke C atau D, dan vice versa.",
    },
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Jumlah Edge Salah)",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 250, y: 50 },
          { id: "C", label: "C", x: 400, y: 100 },
          { id: "D", label: "D", x: 250, y: 200 },
        ],
        edges: [
          { from: "A", to: "B", weight: 3 },
          { from: "B", to: "C", weight: 2 },
          { from: "C", to: "D", weight: 4 },
          { from: "D", to: "A", weight: 5 },
          { from: "B", to: "D", weight: 1 },
        ],
      },
      mst: {
        edges: [
          { from: "B", to: "D", weight: 1, color: "red", label: "1" },
          { from: "B", to: "C", weight: 2, color: "red", label: "2" },
        ],
      },
      reason:
        "Ini salah karena jumlah edge tidak V-1. Ada 4 vertex, seharusnya ada 3 edge, namun hanya ada 2 edge yang dipilih. Akibatnya, vertex A terisolasi.",
    },
    // EXAMPLES FOR INCORRECT WEIGHTS
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Bukan Bobot Minimum)",
      graph: {
        nodes: [
          { id: "X", label: "X", x: 100, y: 100 },
          { id: "Y", label: "Y", x: 300, y: 100 },
          { id: "Z", label: "Z", x: 200, y: 250 },
        ],
        edges: [
          { from: "X", to: "Y", weight: 10 },
          { from: "Y", to: "Z", weight: 2 },
          { from: "Z", to: "X", weight: 3 },
        ],
      },
      mst: {
        // This forms a spanning tree but not the minimum one
        edges: [
          { from: "X", to: "Y", weight: 10, color: "red", label: "10" },
          { from: "Y", to: "Z", weight: 2, color: "red", label: "2" },
        ],
      },
      reason:
        "Ini salah karena bukan MST dengan bobot minimum. Meskipun terhubung dan asiklik, total bobotnya (10+2=12) lebih besar dari MST yang sebenarnya (2+3=5, yaitu Y-Z dan Z-X).",
    },
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Memilih Edge Mahal)",
      graph: {
        nodes: [
          { id: "1", label: "1", x: 100, y: 100 },
          { id: "2", label: "2", x: 300, y: 100 },
          { id: "3", label: "3", x: 100, y: 250 },
          { id: "4", label: "4", x: 300, y: 250 },
        ],
        edges: [
          { from: "1", to: "2", weight: 5 },
          { from: "1", to: "3", weight: 1 },
          { from: "2", to: "4", weight: 2 },
          { from: "3", to: "4", weight: 6 },
          { from: "2", to: "3", weight: 7 }, // Expensive edge
        ],
      },
      mst: {
        // This creates a spanning tree but misses cheaper options
        edges: [
          { from: "1", to: "2", weight: 5, color: "red", label: "5" },
          { from: "2", to: "3", weight: 7, color: "red", label: "7" },
          { from: "3", to: "4", weight: 6, color: "red", label: "6" },
        ],
      },
      reason:
        "Meskipun ini spanning tree yang valid (terhubung, asiklik, V-1 edge), total bobotnya (5+7+6=18) bukan yang paling minimum. Seharusnya memilih edge 1-3 (bobot 1) daripada 1-2 (bobot 5), dan 2-4 (bobot 2) daripada 2-3 (bobot 7) atau 3-4 (bobot 6). MST yang benar bisa 1-3 (1), 2-4 (2), 1-2 (5) dengan total 8. (atau 1-3, 3-4, 2-4)",
    },
    {
      type: "incorrect",
      title: "Contoh MST yang Salah (Mengabaikan Bobot Lebih Kecil)",
      graph: {
        nodes: [
          { id: "P", label: "P", x: 100, y: 100 },
          { id: "Q", label: "Q", x: 300, y: 100 },
          { id: "R", label: "R", x: 200, y: 200 },
          { id: "S", label: "S", x: 400, y: 200 },
        ],
        edges: [
          { from: "P", to: "Q", weight: 5 },
          { from: "P", to: "R", weight: 1 },
          { from: "Q", to: "R", weight: 6 },
          { from: "Q", to: "S", weight: 2 },
          { from: "R", to: "S", weight: 7 },
        ],
      },
      mst: {
        edges: [
          { from: "P", to: "Q", weight: 5, color: "red", label: "5" },
          { from: "Q", to: "R", weight: 6, color: "red", label: "6" },
          { from: "Q", to: "S", weight: 2, color: "red", label: "2" },
        ],
      },
      reason:
        "Ini bukan MST dengan bobot minimum. Edge P-R (bobot 1) diabaikan, padahal itu edge termurah yang bisa menghubungkan P ke R tanpa membentuk siklus. Total bobot yang dipilih (5+6+2=13) lebih besar dari MST sebenarnya (P-R (1), Q-S (2), P-Q (5) -> total 8).",
    },
  ];

  // NEW: Example graphs for "Syarat-syarat MST"
  const requirementExamples = [
    {
      type: "valid",
      title: "Graf Valid",
      reason: "Graf ini terhubung dan setiap edge memiliki bobot. Ini adalah graf yang dapat memiliki MST.",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 250, y: 50 },
          { id: "C", label: "C", x: 400, y: 100 },
          { id: "D", label: "D", x: 250, y: 200 },
        ],
        edges: [
          { from: "A", to: "B", weight: 3 },
          { from: "B", to: "C", weight: 2 },
          { from: "C", to: "D", weight: 4 },
          { from: "D", to: "A", weight: 5 },
          { from: "B", to: "D", weight: 1 },
        ],
      },
    },
    {
      type: "invalid",
      title: "Graf Tidak Terhubung",
      reason: "MST tidak dapat dibentuk karena tidak semua vertex terhubung. Vertex 'C' dan 'D' terisolasi dari 'A' dan 'B'.",
      graph: {
        nodes: [
          { id: "A", label: "A", x: 100, y: 100 },
          { id: "B", label: "B", x: 200, y: 100 },
          { id: "C", label: "C", x: 300, y: 100 },
          { id: "D", label: "D", x: 400, y: 100 },
        ],
        edges: [
          { from: "A", to: "B", weight: 1 },
          { from: "C", to: "D", weight: 2 },
        ],
      },
    },
    {
      type: "invalid",
      title: "Graf Tanpa Bobot",
      reason: "MST membutuhkan graf berbobot untuk menentukan 'minimum'. Tanpa bobot, tidak ada kriteria untuk pemilihan edge.",
      graph: {
        nodes: [
          { id: "X", label: "X", x: 100, y: 100 },
          { id: "Y", label: "Y", x: 250, y: 100 },
          { id: "Z", label: "Z", x: 175, y: 200 },
        ],
        edges: [
          { from: "X", to: "Y", weight: null, label: "" }, // No explicit weight means unweighted
          { from: "Y", to: "Z", weight: null, label: "" },
          { from: "Z", to: "X", weight: null, label: "" },
        ],
      },
    },
    {
      type: "invalid",
      title: "Graf Satu Vertex",
      reason: "MST bertujuan menghubungkan beberapa vertex. Satu vertex tidak memerlukan koneksi, sehingga MST tidak berlaku.",
      graph: {
        nodes: [
          { id: "S", label: "S", x: 200, y: 150 },
        ],
        edges: [],
      },
    },
  ];

  // NEW: Real-world applications of MST
  const realUseCases = [
    {
      title: "Jaringan Internet Gedung",
      description: "Menyusun tata letak kabel jaringan (LAN) di dalam gedung untuk menghubungkan semua komputer dan perangkat dengan panjang kabel seminimal mungkin.",
      icon: Building,
    },
    {
      title: "Jaringan Distribusi Listrik",
      description: "Mendesain jalur transmisi dan distribusi listrik agar semua rumah atau area terlayani dengan biaya pembangunan infrastruktur yang paling efisien.",
      icon: Zap,
    },
    {
      title: "Clustering Analysis",
      description: "Dalam data science, MST dapat digunakan untuk mengidentifikasi cluster dalam kumpulan data dengan menghubungkan titik-titik data terdekat dan kemudian memutuskan edge terpanjang untuk memisahkan cluster.",
      icon: LayoutGrid,
    },
    {
      title: "Sistem Pipa Air dan Gas",
      description: "Merencanakan jaringan pipa untuk distribusi air atau gas ke berbagai lokasi dengan meminimalkan total panjang pipa atau biaya konstruksi.",
      icon: Droplet,
    },
    {
      title: "Jaringan Fiber Optik",
      description: "Mengoptimalkan penempatan kabel fiber optik untuk menghubungkan berbagai titik data dengan biaya terkecil, memastikan konektivitas berkecepatan tinggi.",
      icon: Cable,
    },
    {
      title: "Perencanaan Jaringan Jalan/Rute",
      description: "Mendesain jaringan jalan atau rute transportasi yang menghubungkan semua lokasi penting dengan total panjang jalan atau waktu tempuh yang minimal.",
      icon: Map, // Changed from Road to Map
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Utama Halaman (tetap sama) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pengertian & Karakteristik MST
          </h1>
        </div>

        {/* Bagian Tabs Navigasi (tetap sama) */}
        <div className="mb-8">
          <div className="border-b border-gray-400">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "definition", label: "Pengertian" },
                { id: "characteristics", label: "Karakteristik" },
                { id: "requirements", label: "Syarat" },
                { id: "real-use", label: "Real-Use" },
              ].map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-3 px-4 rounded-t-lg font-medium text-base transition-all duration-200 ease-in-out
                      ${
                        activeTab === tab.id
                          ? "bg-[#3B75A8] text-white shadow-md border-b-2 border-[#3B75A8]"
                          : "text-gray-600 hover:text-[#3B75A8]-50"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Konten Tab: Pengertian (Diubah: hapus styling box utama, ubah styling judul) */}
        {activeTab === "definition" && (
          <div className="space-y-8 animate-fade-in">
            {/* Judul utama Pengertian */}
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
              Apa itu Minimum Spanning Tree?
            </h2>

            {/* Konten deskripsi MST */}
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

            <div className="grid md:grid-cols-2 gap-8">
              <InteractiveGraph
                nodes={graphNodes}
                edges={graphEdges}
                title="Graf Asli"
              />
              <InteractiveGraph
                nodes={graphNodes}
                edges={mstEdges}
                title="Minimum Spanning Tree"
              />
            </div>
          </div>
        )}

        {/* Konten Tab: Karakteristik - DIUBAH */}
        {activeTab === "characteristics" && (
          <div className="space-y-8 animate-fade-in">
            {/* Judul Utama Bagian Karakteristik */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Karakteristik MST
            </h2>

            {/* Kontainer untuk 4 Box Karakteristik */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {" "}
              {/* Mengubah menjadi grid 2 atau 4 kolom */}
              {characteristics.map((char, index) => {
                return (
                  <div
                    key={index}
                    // Box Karakteristik Sederhana
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200" // Menambahkan hover effect
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {char.title}
                    </h3>
                    <p className="text-gray-700 text-base">
                      {char.description}. {char.example}{" "}
                      {/* Gabungkan deskripsi dan contoh */}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bagian Sifat Matematika MST (diubah: hapus styling box luar, tambahkan styling judul dan styling box dalam) */}
            <div className="mt-8">
              <h3 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                Sifat Matematika MST
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cut Property Box */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Cut Property
                  </h3>
                  <p className="text-gray-700 text-base">
                    Untuk setiap cut dalam graf, edge dengan bobot minimum yang
                    melintasi cut tersebut pasti berada dalam MST.
                  </p>
                </div>
                {/* Cycle Property Box */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Cycle Property
                  </h3>
                  <p className="text-gray-700 text-base">
                    Untuk setiap cycle dalam graf, edge dengan bobot maksimum
                    dalam cycle tersebut tidak akan berada dalam MST.
                  </p>
                </div>
              </div>
            </div>

            {/* Contoh Graf ke MST (Benar dan Salah) */}
            <div className="mt-8">
              <h3 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                Contoh Penerapan MST (Benar vs. Salah)
              </h3>
              <div className="space-y-10">
                {mstExamples.map((example, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 ${
                      example.type === "correct"
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                    }`}
                  >
                    <h4
                      className={`text-xl font-semibold mb-4 flex items-center ${
                        example.type === "correct"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {example.type === "correct" ? (
                        <CheckCircle className="h-6 w-6 mr-2" />
                      ) : (
                        <XCircle className="h-6 w-6 mr-2" />
                      )}
                      {example.title}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InteractiveGraph
                        nodes={example.graph.nodes}
                        edges={example.graph.edges}
                        title="Graf Asli"
                      />
                      <InteractiveGraph
                        nodes={example.graph.nodes}
                        edges={example.mst.edges}
                        title="Proposed MST"
                        highlightedEdges={example.mst.edges.map((edge) => ({
                          from: edge.from,
                          to: edge.to,
                          color: "red", // Highlight selected edges in red
                        }))}
                      />
                    </div>
                    <div
                      className={`mt-4 p-4 rounded-md ${
                        example.type === "correct"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <h5 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Alasan:
                      </h5>
                      <p>{example.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Konten Tab: Syarat (Diubah: styling box utama dihapus, styling box dalam diubah, ditambah contoh graf) */}
        {activeTab === "requirements" && (
          <div className="space-y-8 animate-fade-in">
            {/* Judul Utama Bagian Syarat */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Syarat-syarat MST
            </h2>

            {/* Kontainer untuk Syarat-syarat individual */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="mb-2">
                    {" "}
                    {/* Added margin bottom for icon */}
                    {req.valid ? (
                      <CheckCircle className="h-8 w-8 text-green-500" /> /* Larger icon */
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" /> /* Larger icon */
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {" "}
                    {/* Matched heading style */}
                    {req.condition}
                  </h3>
                  <p className="text-gray-700 text-base">{req.explanation}</p>{" "}
                  {/* Matched paragraph style */}
                </div>
              ))}
            </div>

            {/* Bagian Graf Valid dan Tidak Valid (tetap sama strukturnya) */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
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

            {/* NEW: Contoh Graf Berdasarkan Syarat */}
            <div className="mt-8">
              <h3 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                Contoh Graf Berdasarkan Syarat MST
              </h3>
              <div className="space-y-10">
                {requirementExamples.map((example, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 ${
                      example.type === "valid"
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                    }`}
                  >
                    <h4
                      className={`text-xl font-semibold mb-4 flex items-center ${
                        example.type === "valid"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {example.type === "valid" ? (
                        <CheckCircle className="h-6 w-6 mr-2" />
                      ) : (
                        <XCircle className="h-6 w-6 mr-2" />
                      )}
                      {example.title}
                    </h4>
                    <div className="flex justify-center mb-4">
                      {" "}
                      {/* Center the graph */}
                      <InteractiveGraph
                        nodes={example.graph.nodes}
                        edges={example.graph.edges}
                        title="" // Title is in h4 above
                        height="200px" // Smaller height for examples
                      />
                    </div>
                    <div
                      className={`mt-4 p-4 rounded-md ${
                        example.type === "valid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <h5 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Alasan:
                      </h5>
                      <p>{example.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NEW: Konten Tab: Real-Use */}
        {activeTab === "real-use" && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Penggunaan MST di Dunia Nyata
            </h2>
            {/* Added flex and justify-center to the grid container */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
              {realUseCases.map((useCase, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex-shrink-0">
                    <useCase.icon className="h-10 w-10 text-[#3B75A8]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-700 text-base">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}