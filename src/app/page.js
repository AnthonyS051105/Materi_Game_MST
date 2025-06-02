"use client";

import { useState } from "react";
import { Download, Users, BookOpen, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import PptxGenJS from "pptxgenjs";

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);

  const handleConvertToPPT = async () => {
    setIsConverting(true);

    try {
      // Buat instance PowerPoint baru
      const pptx = new PptxGenJS();

      // Slide 1: Cover
      const slide1 = pptx.addSlide();
      slide1.addText("Minimum Spanning Tree", {
        x: 1,
        y: 2,
        w: 8,
        h: 2,
        fontSize: 36,
        fontFace: "Arial",
        color: "ffffff",
        fill: "3b82f6",
        align: "center",
      });

      slide1.addText("Website Pembelajaran MST", {
        x: 1,
        y: 4,
        w: 8,
        h: 1,
        fontSize: 20,
        fontFace: "Arial",
        color: "666666",
        align: "center",
      });

      // Slide 2: Pengertian MST
      const slide2 = pptx.addSlide();
      slide2.addText("Pengertian MST", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 32,
        fontFace: "Arial",
        color: "1e40af",
        bold: true,
      });

      slide2.addText(
        [
          { text: "Minimum Spanning Tree (MST) ", options: { bold: true } },
          {
            text: "adalah spanning tree dari graf berbobot yang memiliki total bobot edge paling minimum.",
          },
        ],
        {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 3,
          fontSize: 18,
          fontFace: "Arial",
          color: "374151",
        }
      );

      slide2.addText("Karakteristik MST:", {
        x: 0.5,
        y: 3,
        w: 9,
        h: 0.5,
        fontSize: 20,
        fontFace: "Arial",
        color: "1e40af",
        bold: true,
      });

      slide2.addText(
        [
          "• Terhubung (Connected)\n",
          "• Asiklik (Acyclic)\n",
          "• Jumlah Edge = V - 1\n",
          "• Bobot Minimum",
        ],
        {
          x: 1,
          y: 3.5,
          w: 8,
          h: 2.5,
          fontSize: 16,
          fontFace: "Arial",
          color: "374151",
          bullet: true,
        }
      );

      // Slide 3: Algoritma Kruskal
      const slide3 = pptx.addSlide();
      slide3.addText("Algoritma Kruskal", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 32,
        fontFace: "Arial",
        color: "16a34a",
        bold: true,
      });

      slide3.addText("Langkah-langkah:", {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.5,
        fontSize: 20,
        fontFace: "Arial",
        color: "16a34a",
        bold: true,
      });

      slide3.addText(
        [
          "1. Urutkan semua edge berdasarkan bobot (ascending)\n",
          "2. Inisialisasi Union-Find untuk deteksi cycle\n",
          "3. Untuk setiap edge, periksa apakah menambahkannya akan membentuk cycle\n",
          "4. Jika tidak membentuk cycle, tambahkan edge ke MST\n",
          "5. Ulangi hingga MST memiliki V-1 edge",
        ],
        {
          x: 1,
          y: 2,
          w: 8,
          h: 3,
          fontSize: 16,
          fontFace: "Arial",
          color: "374151",
        }
      );

      slide3.addText("Kompleksitas: O(E log E)", {
        x: 1,
        y: 5.5,
        w: 8,
        h: 0.5,
        fontSize: 16,
        fontFace: "Arial",
        color: "16a34a",
        bold: true,
      });

      // Slide 4: Algoritma Prim
      const slide4 = pptx.addSlide();
      slide4.addText("Algoritma Prim", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 32,
        fontFace: "Arial",
        color: "9333ea",
        bold: true,
      });

      slide4.addText("Langkah-langkah:", {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.5,
        fontSize: 20,
        fontFace: "Arial",
        color: "9333ea",
        bold: true,
      });

      slide4.addText(
        [
          "1. Pilih vertex awal (arbitrary)\n",
          "2. Masukkan vertex ke dalam MST set\n",
          "3. Temukan edge berbobot minimum yang menghubungkan MST set dengan vertex di luar\n",
          "4. Tambahkan edge dan vertex baru ke MST\n",
          "5. Ulangi hingga semua vertex termasuk dalam MST",
        ],
        {
          x: 1,
          y: 2,
          w: 8,
          h: 3,
          fontSize: 16,
          fontFace: "Arial",
          color: "374151",
        }
      );

      slide4.addText("Kompleksitas: O(V²) atau O(E log V)", {
        x: 1,
        y: 5.5,
        w: 8,
        h: 0.5,
        fontSize: 16,
        fontFace: "Arial",
        color: "9333ea",
        bold: true,
      });

      // Slide 5: Perbandingan
      const slide5 = pptx.addSlide();
      slide5.addText("Perbandingan Kruskal vs Prim", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 28,
        fontFace: "Arial",
        color: "ea580c",
        bold: true,
      });

      // Tabel perbandingan
      const tableData = [
        [
          { text: "Kriteria", options: { bold: true, fill: "f3f4f6" } },
          { text: "Kruskal", options: { bold: true, fill: "dcfce7" } },
          { text: "Prim", options: { bold: true, fill: "f3e8ff" } },
        ],
        ["Approach", "Edge-based", "Vertex-based"],
        ["Best for", "Sparse Graph", "Dense Graph"],
        ["Data Structure", "Union-Find", "Priority Queue"],
        ["Time Complexity", "O(E log E)", "O(V²) atau O(E log V)"],
      ];

      slide5.addTable(tableData, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 3,
        fontSize: 14,
        fontFace: "Arial",
        border: { pt: 1, color: "cccccc" },
      });

      // Slide 6: Implementasi Power Grid
      const slide6 = pptx.addSlide();
      slide6.addText("Implementasi: Power Grid System", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 28,
        fontFace: "Arial",
        color: "dc2626",
        bold: true,
      });

      slide6.addText("Penerapan MST dalam jaringan distribusi listrik:", {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.5,
        fontSize: 18,
        fontFace: "Arial",
        color: "374151",
      });

      slide6.addText(
        [
          "• Minimisasi biaya infrastruktur (35-50% saving)\n",
          "• Optimasi jalur distribusi\n",
          "• Redundansi terkontrol\n",
          "• Efficiency dalam maintenance\n\n",
          "Studi Kasus:\n",
          "- PLN Indonesia: Saving 2.1 triliun rupiah\n",
          "- European Grid: 40% pengurangan biaya\n",
          "- Smart Grid USA: AI-powered optimization",
        ],
        {
          x: 1,
          y: 2,
          w: 8,
          h: 4,
          fontSize: 16,
          fontFace: "Arial",
          color: "374151",
        }
      );

      // Download file
      await pptx.writeFile({ fileName: "MST_Learning_Presentation.pptx" });

      alert("PowerPoint berhasil didownload!");
    } catch (error) {
      console.error("Error generating PPT:", error);
      alert("Terjadi kesalahan saat membuat PowerPoint. Silakan coba lagi.");
    } finally {
      setIsConverting(false);
    }
  };

  const teamMembers = [
    { name: "Ahmad Rizki", npm: "2023001", role: "Project Leader" },
    { name: "Siti Nurhaliza", npm: "2023002", role: "Algorithm Specialist" },
    { name: "Budi Santoso", npm: "2023003", role: "Frontend Developer" },
    { name: "Dewi Sartika", npm: "2023004", role: "Content Writer" },
    { name: "Muhammad Fadli", npm: "2023005", role: "UI/UX Designer" },
  ];

  const topics = [
    {
      title: "Pengertian & Karakteristik MST",
      description: "Memahami konsep dasar dan syarat-syarat MST",
      href: "/pengertian",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Algoritma Kruskal",
      description: "Mempelajari algoritma Kruskal untuk mencari MST",
      href: "/kruskal",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Algoritma Prim",
      description: "Memahami cara kerja algoritma Prim",
      href: "/prim",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Perbandingan Algoritma",
      description: "Kelebihan dan kekurangan masing-masing algoritma",
      href: "/perbandingan",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Implementasi Power Grid",
      description: "Penerapan MST dalam sistem jaringan listrik",
      href: "/implementasi",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl bg-primary font-bold mb-6 animate-fade-in">
            Minimum Spanning Tree
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Jelajahi dunia algoritma graf yang menakjubkan! Pelajari konsep MST,
            algoritma Kruskal dan Prim, serta implementasinya dalam kehidupan
            nyata melalui website interaktif ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              href="/pengertian"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <BookOpen size={20} />
              <span>Mulai Belajar</span>
              <ChevronRight size={16} />
            </Link>
            <button
              onClick={handleConvertToPPT}
              disabled={isConverting}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Download size={20} />
              <span>{isConverting ? "Converting..." : "Download PPT"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pengantar Pembelajaran
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Minimum Spanning Tree (MST) adalah salah satu konsep fundamental
              dalam teori graf yang memiliki aplikasi luas dalam berbagai bidang
              seperti jaringan komputer, sistem transportasi, dan infrastruktur.
              Website ini dirancang untuk memberikan pemahaman mendalam tentang
              MST melalui pendekatan interaktif dan visualisasi yang menarik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Pembelajaran Interaktif
              </h3>
              <p className="text-gray-600">
                Materi disajikan dengan visualisasi dan animasi untuk memudahkan
                pemahaman konsep
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Implementasi Praktis
              </h3>
              <p className="text-gray-600">
                Mempelajari penerapan MST dalam dunia nyata melalui studi kasus
                power grid
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kolaboratif</h3>
              <p className="text-gray-600">
                Dikerjakan secara tim dengan pembagian tugas yang jelas dan
                terstruktur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Materi Pembelajaran
            </h2>
            <p className="text-lg text-gray-600">
              Jelajahi berbagai topik MST yang telah disusun secara sistematis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <Link key={index} href={topic.href}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div
                    className={`h-32 bg-gradient-to-r ${topic.color} flex items-center justify-center`}
                  >
                    <BookOpen className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Pelajari Sekarang</span>
                      <ChevronRight
                        size={16}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Anggota Kelompok
            </h2>
            <p className="text-lg text-gray-600">
              Tim pengembang website pembelajaran MST
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm mb-2">NPM: {member.npm}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
