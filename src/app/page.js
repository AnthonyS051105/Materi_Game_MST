"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Users,
  BookOpen,
  Target,
  ChevronRight,
  Zap,
  Code,
  Globe,
  ChevronLeft, // Import ChevronLeft for previous button
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Pixelify_Sans, Play, Podkova } from 'next/font/google';
import Image from "next/image"; // Import Image component

const play = Play({
  subsets: ["latin"],
  weight: "700", // Assuming a bold weight for "MEET OUR TEAM"
});

const podkova = Podkova({
  subsets: ["latin"],
  weight: "400", // Assuming a regular weight for "design by"
});

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// Comprehensive PPT Creator with UI-based design
const ComprehensivePPTCreator = ({ isConverting, setIsConverting }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createComprehensivePPT = async () => {
    if (!isClient) return;
    setIsConverting(true);

    try {
      // Load PptxGenJS from multiple CDN sources
      const cdnSources = [
        "https://unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js",
        "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js",
        "https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.min.js",
      ];

      let PptxGenJS = null;

      for (const cdn of cdnSources) {
        try {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = cdn;
            script.onload = () => {
              if (window.PptxGenJS) {
                PptxGenJS = window.PptxGenJS;
                resolve();
              } else {
                reject(new Error("PptxGenJS not found"));
              }
            };
            script.onerror = () =>
              reject(new Error(`Failed to load from ${cdn}`));

            const existing = document.querySelector(`script[src="${cdn}"]`);
            if (existing) existing.remove();

            document.head.appendChild(script);
          });
          if (PptxGenJS) break;
        } catch (error) {
          continue;
        }
      }

      if (!PptxGenJS) {
        throw new Error("Failed to load PptxGenJS from all CDN sources");
      }

      console.log("Creating comprehensive MST presentation...");

      const pptx = new PptxGenJS();

      // Set proper PowerPoint layout (16:9 ratio)
      pptx.layout = "LAYOUT_16x9";
      pptx.author = "MST Learning Team";
      pptx.title = "Minimum Spanning Tree - Comprehensive Learning Guide";
      pptx.subject = "Graph Algorithm Education";

      // Define consistent color scheme matching website
      const colors = {
        primary: "2563EB", // Blue-600
        secondary: "4338CA", // Indigo-700
        success: "22C55E", // Green-500
        warning: "F59E0B", // Amber-500
        danger: "EF4444", // Red-500
        purple: "8B5CF6", // Purple-500
        gray: "6B7280", // Gray-500
        lightGray: "F9FAFB", // Gray-50
        white: "FFFFFF",
        dark: "111827", // Gray-900
      };

      // Helper function to add card with shadow effect
      const addCard = (
        slide,
        x,
        y,
        w,
        h,
        bgColor = colors.white,
        borderColor = "E5E7EB"
      ) => {
        // Shadow effect
        slide.addShape(pptx.ShapeType.rect, {
          x: x + 0.05,
          y: y + 0.05,
          w: w,
          h: h,
          fill: "00000020",
          line: { width: 0 },
        });

        // Main card
        slide.addShape(pptx.ShapeType.rect, {
          x: x,
          y: y,
          w: w,
          h: h,
          fill: bgColor,
          line: { color: borderColor, width: 1 },
        });
      };

      // ===============================
      // SLIDE 1: TITLE SLIDE
      // ===============================
      const slide1 = pptx.addSlide();
      slide1.background = { fill: colors.primary };

      // Hero title
      slide1.addText("Minimum Spanning Tree", {
        x: 0.5,
        y: 2,
        w: 12.33,
        h: 1.5,
        fontSize: 54,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Subtitle
      slide1.addText("Website Pembelajaran Interaktif", {
        x: 0.5,
        y: 3.8,
        w: 12.33,
        h: 0.8,
        fontSize: 28,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Description
      slide1.addText(
        "Jelajahi dunia algoritma graf yang menakjubkan!\nPelajari konsep MST, algoritma Kruskal dan Prim, serta implementasinya dalam kehidupan nyata",
        {
          x: 1,
          y: 5,
          w: 11.33,
          h: 1.2,
          fontSize: 18,
          color: "FFFFFFCC",
          align: "center",
          fontFace: "Segoe UI",
        }
      );

      // CTA Buttons simulation
      addCard(slide1, 4, 6.5, 2.5, 0.6, colors.white);
      slide1.addText("📚 Mulai Belajar", {
        x: 4,
        y: 6.5,
        w: 2.5,
        h: 0.6,
        fontSize: 16,
        bold: true,
        color: colors.primary,
        align: "center",
        fontFace: "Segoe UI",
      });

      slide1.addShape(pptx.ShapeType.rect, {
        x: 6.8,
        y: 6.5,
        w: 2.5,
        h: 0.6,
        fill: "transparent",
        line: { color: colors.white, width: 2 },
      });
      slide1.addText("📥 Download PPT", {
        x: 6.8,
        y: 6.5,
        w: 2.5,
        h: 0.6,
        fontSize: 16,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // ===============================
      // SLIDE 2: DAFTAR ISI
      // ===============================
      const slide2 = pptx.addSlide();
      slide2.background = { fill: colors.lightGray };

      slide2.addText("📋 Daftar Isi", {
        x: 0.5,
        y: 0.5,
        w: 12.33,
        h: 1,
        fontSize: 36,
        bold: true,
        color: colors.dark,
        align: "center",
        fontFace: "Segoe UI",
      });

      const tableOfContents = [
        "1. Pengertian Minimum Spanning Tree",
        "2. Karakteristik dan Syarat MST",
        "3. Overview Algoritma MST",
        "4. Algoritma Kruskal",
        "5. Algoritma Prim",
        "6. Perbandingan Performance",
        "7. Manfaat dan Aplikasi Real-World",
        "8. Implementasi Power Grid System",
        "9. Tim Pengembang",
        "10. Kesimpulan dan Saran",
      ];

      tableOfContents.forEach((item, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = 1 + col * 5.5;
        const y = 2 + row * 0.6;

        slide2.addText(item, {
          x: x,
          y: y,
          w: 5,
          h: 0.5,
          fontSize: 16,
          color: colors.dark,
          bullet: { type: "number" },
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 3: PENGERTIAN MST
      // ===============================
      const slide3 = pptx.addSlide();
      slide3.background = { fill: colors.white };

      // Header with icon
      addCard(slide3, 0.5, 0.3, 12.33, 1.2, colors.primary);
      slide3.addText("📚 Pengertian Minimum Spanning Tree", {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 1.2,
        fontSize: 32,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Definition card
      addCard(slide3, 1, 2, 11.33, 2);
      slide3.addText("Definisi", {
        x: 1.5,
        y: 2.2,
        w: 10.33,
        h: 0.5,
        fontSize: 20,
        bold: true,
        color: colors.primary,
        fontFace: "Segoe UI",
      });

      slide3.addText(
        "Minimum Spanning Tree (MST) adalah subgraf dari graf berbobot yang menghubungkan semua vertex dengan total bobot edge minimum, tanpa membentuk cycle (siklus).",
        {
          x: 1.5,
          y: 2.8,
          w: 10.33,
          h: 1,
          fontSize: 16,
          color: colors.dark,
          fontFace: "Segoe UI",
        }
      );

      // Key points
      addCard(slide3, 1, 4.5, 5.5, 2.5);
      slide3.addText("🎯 Karakteristik Utama", {
        x: 1.5,
        y: 4.7,
        w: 4.5,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.success,
        fontFace: "Segoe UI",
      });

      const characteristics = [
        "• Menghubungkan semua vertex",
        "• Tidak ada cycle/siklus",
        "• Jumlah edge = V - 1",
        "• Total bobot minimum",
      ];

      characteristics.forEach((char, index) => {
        slide3.addText(char, {
          x: 1.5,
          y: 5.3 + index * 0.4,
          w: 4.5,
          h: 0.3,
          fontSize: 14,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // Applications preview
      addCard(slide3, 7, 4.5, 5.33, 2.5);
      slide3.addText("🌍 Aplikasi Umum", {
        x: 7.5,
        y: 4.7,
        w: 4.33,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.warning,
        fontFace: "Segoe UI",
      });

      const applications = [
        "• Jaringan telekomunikasi",
        "• Sistem distribusi listrik",
        "• Perencanaan jalan raya",
        "• Network clustering",
      ];

      applications.forEach((app, index) => {
        slide3.addText(app, {
          x: 7.5,
          y: 5.3 + index * 0.4,
          w: 4.33,
          h: 0.3,
          fontSize: 14,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 4: ALGORITMA KRUSKAL
      // ===============================
      const slide4 = pptx.addSlide();
      slide4.background = { fill: colors.success };

      slide4.addText("🔧 Algoritma Kruskal", {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 1,
        fontSize: 36,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Steps
      addCard(slide4, 1, 1.8, 5.5, 4.5, colors.white);
      slide4.addText("📋 Langkah-langkah:", {
        x: 1.3,
        y: 2,
        w: 4.9,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.success,
        fontFace: "Segoe UI",
      });

      const kruskalSteps = [
        "1. Sort semua edge berdasarkan bobot",
        "2. Inisialisasi Union-Find structure",
        "3. Untuk setiap edge (u,v):",
        "   • Cek apakah u dan v terhubung",
        "   • Jika tidak, tambahkan edge ke MST",
        "   • Union set u dan v",
        "4. Ulangi hingga V-1 edge terpilih",
      ];

      kruskalSteps.forEach((step, index) => {
        slide4.addText(step, {
          x: 1.5,
          y: 2.6 + index * 0.4,
          w: 4.5,
          h: 0.35,
          fontSize: 12,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // Advantages
      addCard(slide4, 7, 1.8, 5.33, 4.5, colors.white);
      slide4.addText("✅ Keunggulan:", {
        x: 7.3,
        y: 2,
        w: 4.73,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.success,
        fontFace: "Segoe UI",
      });

      const kruskalAdvantages = [
        "• Mudah diimplementasikan",
        "• Efisien untuk sparse graph",
        "• Dapat handle disconnected graph",
        "• Greedy approach yang optimal",
        "• Parallelizable untuk large datasets",
      ];

      kruskalAdvantages.forEach((adv, index) => {
        slide4.addText(adv, {
          x: 7.5,
          y: 2.6 + index * 0.4,
          w: 4.33,
          h: 0.35,
          fontSize: 12,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 5: ALGORITMA PRIM
      // ===============================
      const slide5 = pptx.addSlide();
      slide5.background = { fill: colors.purple };

      slide5.addText("⚡ Algoritma Prim", {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 1,
        fontSize: 36,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Steps
      addCard(slide5, 1, 1.8, 5.5, 4.5, colors.white);
      slide5.addText("📋 Langkah-langkah:", {
        x: 1.3,
        y: 2,
        w: 4.9,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.purple,
        fontFace: "Segoe UI",
      });

      const primSteps = [
        "1. Pilih starting vertex sembarang",
        "2. Inisialisasi priority queue",
        "3. Tambahkan vertex ke MST",
        "4. Update key adjacent vertices",
        "5. Pilih vertex dengan key minimum",
        "6. Ulangi hingga semua vertex",
        "7. MST terbentuk dengan V-1 edges",
      ];

      primSteps.forEach((step, index) => {
        slide5.addText(step, {
          x: 1.5,
          y: 2.6 + index * 0.4,
          w: 4.5,
          h: 0.35,
          fontSize: 12,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // Advantages
      addCard(slide5, 7, 1.8, 5.33, 4.5, colors.white);
      slide5.addText("✅ Keunggulan:", {
        x: 7.3,
        y: 2,
        w: 4.73,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: colors.purple,
        fontFace: "Segoe UI",
      });

      const primAdvantages = [
        "• Efisien untuk dense graph",
        "• Memory efficient",
        "• Progressive MST building",
        "• Suitable untuk real-time",
        "• Better cache performance",
      ];

      primAdvantages.forEach((adv, index) => {
        slide5.addText(adv, {
          x: 7.5,
          y: 2.6 + index * 0.4,
          w: 4.33,
          h: 0.35,
          fontSize: 12,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 6: PERBANDINGAN PERFORMANCE
      // ===============================
      const slide6 = pptx.addSlide();
      slide6.background = { fill: colors.white };

      addCard(slide6, 0.5, 0.3, 12.33, 1.2, colors.warning);
      slide6.addText("📊 Perbandingan Performance Algoritma", {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 1.2,
        fontSize: 32,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Performance comparison table
      const perfData = [
        ["Aspek", "Kruskal", "Prim"],
        ["Time Complexity", "O(E log E)", "O(V²) / O(E log V)"],
        ["Space Complexity", "O(V)", "O(V)"],
        ["Best for", "Sparse Graph", "Dense Graph"],
        ["Implementation", "Union-Find", "Priority Queue"],
        ["Memory Access", "Edge-based", "Vertex-based"],
      ];

      // Table header
      perfData[0].forEach((header, colIndex) => {
        const x = 1.5 + colIndex * 3.5;
        addCard(slide6, x, 2, 3.3, 0.6, colors.primary);
        slide6.addText(header, {
          x: x,
          y: 2,
          w: 3.3,
          h: 0.6,
          fontSize: 16,
          bold: true,
          color: colors.white,
          align: "center",
          fontFace: "Segoe UI",
        });
      });

      // Table rows
      for (let row = 1; row < perfData.length; row++) {
        perfData[row].forEach((cell, colIndex) => {
          const x = 1.5 + colIndex * 3.5;
          const y = 2.6 + (row - 1) * 0.6;
          const bgColor = colIndex === 0 ? "F3F4F6" : colors.white;

          addCard(slide6, x, y, 3.3, 0.6, bgColor);
          slide6.addText(cell, {
            x: x,
            y: y,
            w: 3.3,
            h: 0.6,
            fontSize: 12,
            color: colors.dark,
            align: "center",
            fontFace: "Segoe UI",
          });
        });
      }

      // ===============================
      // SLIDE 7: IMPLEMENTASI POWER GRID
      // ===============================
      const slide7 = pptx.addSlide();
      slide7.background = { fill: colors.warning };

      slide7.addText("🏭 Implementasi Power Grid System", {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 1,
        fontSize: 32,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      slide7.addText(
        "Penerapan MST dalam sistem jaringan distribusi listrik yang efisien",
        {
          x: 0.5,
          y: 1.4,
          w: 12.33,
          h: 0.6,
          fontSize: 18,
          color: "FFFFFFCC",
          align: "center",
          fontFace: "Segoe UI",
        }
      );

      // Benefits section
      addCard(slide7, 1, 2.5, 11.33, 4, colors.white);
      slide7.addText("💰 Manfaat & Studi Kasus Global", {
        x: 1.3,
        y: 2.7,
        w: 10.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        color: colors.warning,
        align: "center",
        fontFace: "Segoe UI",
      });

      const benefits = [
        "🇮🇩 PLN Indonesia: Penghematan 2.1 triliun rupiah dengan smart grid MST",
        "🇪🇺 European Grid: 40% pengurangan biaya transmisi regional",
        "🇺🇸 US Smart Grid: AI-powered MST optimization untuk 150 juta rumah",
        "📉 Minimisasi biaya infrastruktur (35-50% saving)",
        "⚡ Optimasi jalur distribusi dengan real-time monitoring",
        "🔒 Redundansi terkontrol untuk reliability maksimal",
      ];

      benefits.forEach((benefit, index) => {
        slide7.addText(benefit, {
          x: 1.5,
          y: 3.4 + index * 0.4,
          w: 10.33,
          h: 0.35,
          fontSize: 14,
          color: colors.dark,
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 8: TIM PENGEMBANG
      // ===============================
      const slide8 = pptx.addSlide();
      slide8.background = { fill: colors.primary };

      slide8.addText("👥 Tim Pengembang Website", {
        x: 0.5,
        y: 0.5,
        w: 12.33,
        h: 1,
        fontSize: 32,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      slide8.addText(
        "Tim profesional yang berdedikasi untuk pembelajaran MST",
        {
          x: 0.5,
          y: 1.6,
          w: 12.33,
          h: 0.6,
          fontSize: 16,
          color: "FFFFFFCC",
          align: "center",
          fontFace: "Segoe UI",
        }
      );

      // Team members
      const teamMembersPPT = [
        {
          name: "Ahmad Rizki",
          npm: "2023001",
          role: "Project Leader",
          initial: "AR",
          color: colors.primary,
        },
        {
          name: "Siti Nurhaliza",
          npm: "2023002",
          role: "Algorithm Specialist",
          initial: "SN",
          color: colors.success,
        },
        {
          name: "Budi Santoso",
          npm: "2023003",
          role: "Frontend Developer",
          initial: "BS",
          color: colors.purple,
        },
        {
          name: "Dewi Sartika",
          npm: "2023004",
          role: "Content Writer",
          initial: "DS",
          color: colors.warning,
        },
        {
          name: "Muhammad Fadli",
          npm: "2023005",
          role: "UI/UX Designer",
          initial: "MF",
          color: colors.danger,
        },
      ];

      teamMembersPPT.forEach((member, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = 1.5 + col * 3.8;
        const y = 2.8 + row * 2.2;

        // Member card
        addCard(slide8, x, y, 3.3, 2, colors.white);

        // Avatar circle
        slide8.addShape(pptx.ShapeType.ellipse, {
          x: x + 1.15,
          y: y + 0.2,
          w: 1,
          h: 1,
          fill: member.color,
        });

        slide8.addText(member.initial, {
          x: x + 1.15,
          y: y + 0.2,
          w: 1,
          h: 1,
          fontSize: 20,
          bold: true,
          color: colors.white,
          align: "center",
          fontFace: "Segoe UI",
        });

        slide8.addText(member.name, {
          x: x + 0.2,
          y: y + 1.3,
          w: 2.9,
          h: 0.4,
          fontSize: 14,
          bold: true,
          color: colors.dark,
          align: "center",
          fontFace: "Segoe UI",
        });

        slide8.addText(member.npm, {
          x: x + 0.2,
          y: y + 1.6,
          w: 2.9,
          h: 0.3,
          fontSize: 11,
          color: colors.gray,
          align: "center",
          fontFace: "Segoe UI",
        });

        // Role badge
        slide8.addShape(pptx.ShapeType.rect, {
          x: x + 0.3,
          y: y + 1.95,
          w: 2.7,
          h: 0.3,
          fill: member.color + "20",
          line: { color: member.color, width: 1 },
        });

        slide8.addText(member.role, {
          x: x + 0.3,
          y: y + 1.95,
          w: 2.7,
          h: 0.3,
          fontSize: 9,
          bold: true,
          color: member.color,
          align: "center",
          fontFace: "Segoe UI",
        });
      });

      // ===============================
      // SLIDE 9: KESIMPULAN
      // ===============================
      const slide9 = pptx.addSlide();
      slide9.background = { fill: "667EEA" };

      slide9.addText("🎉 Kesimpulan & Takeaways", {
        x: 0.5,
        y: 0.5,
        w: 12.33,
        h: 1,
        fontSize: 36,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      // Key takeaways
      addCard(slide9, 1, 2, 11.33, 3.5, "FFFFFF20");
      slide9.addText("💡 Key Takeaways", {
        x: 1.5,
        y: 2.3,
        w: 10.33,
        h: 0.6,
        fontSize: 24,
        bold: true,
        color: colors.white,
        fontFace: "Segoe UI",
      });

      const takeaways = [
        "🔍 MST adalah fundamental algoritma graf dengan aplikasi luas",
        "⚙️ Kruskal & Prim masing-masing optimal untuk kondisi berbeda",
        "🌍 Implementasi real-world memberikan value ekonomi signifikan",
        "🚀 Teknologi modern membuka peluang optimasi lebih lanjut",
        "📈 Pemahaman MST essential untuk computer science & engineering",
      ];

      takeaways.forEach((takeaway, index) => {
        slide9.addText(takeaway, {
          x: 1.8,
          y: 3 + index * 0.5,
          w: 9.8,
          h: 0.4,
          fontSize: 14,
          color: colors.white,
          fontFace: "Segoe UI",
        });
      });

      // Call to action
      addCard(slide9, 3, 6, 7.33, 1, colors.white);
      slide9.addText("🌟 Keep Learning, Keep Growing! 🌟", {
        x: 3,
        y: 6,
        w: 7.33,
        h: 1,
        fontSize: 20,
        bold: true,
        color: colors.primary,
        align: "center",
        fontFace: "Segoe UI",
      });

      // ===============================
      // SLIDE 10: TERIMA KASIH
      // ===============================
      const slide10 = pptx.addSlide();
      slide10.background = { fill: colors.primary };

      slide10.addText("🙏 Terima Kasih!", {
        x: 0.5,
        y: 2.5,
        w: 12.33,
        h: 1.5,
        fontSize: 54,
        bold: true,
        color: colors.white,
        align: "center",
        fontFace: "Segoe UI",
      });

      slide10.addText(
        "Semoga presentasi ini bermanfaat untuk\npemahaman Minimum Spanning Tree yang lebih mendalam",
        {
          x: 0.5,
          y: 4.2,
          w: 12.33,
          h: 1.2,
          fontSize: 20,
          color: "FFFFFFCC",
          align: "center",
          fontFace: "Segoe UI",
        }
      );

      slide10.addText(
        "📧 Contact: mst-learning@university.edu\n🌐 Website: https://mst-learning.vercel.app",
        {
          x: 0.5,
          y: 6,
          w: 12.33,
          h: 1,
          fontSize: 14,
          color: "FFFFFF99",
          align: "center",
          fontFace: "Segoe UI",
        }
      );

      // Generate and download
      console.log("Generating comprehensive MST PowerPoint...");
      await pptx.writeFile({
        fileName: "MST_Learning_Comprehensive_Presentation.pptx",
      });

      alert(
        "🎉 PowerPoint Comprehensive berhasil didownload!\n\n📋 Berisi 10 slide lengkap:\n\n✅ Slide 1: Title dengan UI design\n✅ Slide 2: Daftar Isi\n✅ Slide 3: Pengertian MST\n✅ Slide 4: Algoritma Kruskal\n✅ Slide 5: Algoritma Prim\n✅ Slide 6: Performance Comparison\n✅ Slide 7: Power Grid Implementation\n✅ Slide 8: Tim Pengembang\n✅ Slide 9: Kesimpulan\n✅ Slide 10: Terima Kasih\n\n🎨 Design Features:\n• Layout PowerPoint standar 16:9\n• Gradient background matching website\n• Professional cards & visual elements\n• Consistent color scheme\n• Typography yang readable\n• Shadow effects untuk depth\n\n💼 Siap untuk presentasi profesional!"
      );
    } catch (error) {
      console.error("Comprehensive PPT generation error:", error);
      alert(
        `❌ Gagal membuat PowerPoint Comprehensive.\n\nError: ${error.message}\n\nSolusi:\n• Refresh halaman dan coba lagi\n• Pastikan internet connection stabil\n• Gunakan browser Chrome/Firefox terbaru\n• Disable adblockers sementara\n• Coba gunakan mode incognito`
      );
    } finally {
      setIsConverting(false);
    }
  };

  if (!isClient) {
    return <span className="text-white">Loading...</span>;
  }

  return (
    <button
      onClick={createComprehensivePPT}
      disabled={isConverting}
      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 shadow-lg"
    >
      <Download size={20} />
      <span>
        {isConverting
          ? "Generating Comprehensive PPT..."
          : "Download Comprehensive PPT"}
      </span>
    </button>
  );
};

// Dynamic import with SSR disabled
const PPTGenerator = dynamic(() => Promise.resolve(ComprehensivePPTCreator), {
  ssr: false,
  loading: () => (
    <div className="flex items-center space-x-2 text-white">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Loading PPT Generator...</span>
    </div>
  ),
});

const MeetOurTeamSection = () => {
  return (
    <section className="py-8 bg-[#F8F8F8]"> {/* Background color to match image */}
      <div className="max-w-10xl mx-auto px-8 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-[1fr_20fr] gap-4 items-center">
        {/* Text Content (Left) */}
        <div className="text-center md:text-left">
          <h2 className={`text-8xl text-gray-800 mb-2 md:mb-4 ${play.className}`}>
            MEET
            <br />
            OUR
            <br />
            TEAM
          </h2>
          <p className={`text-sm text-gray-500 mt-2 ${podkova.className}`}>
            design by - MST Group (Information Engineering)
          </p>
        </div>

        {/* Image (Right, expanded and shaped) */}
        {/* Container for the image to apply the oval/capsule shape and shadow */}
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden rounded-full shadow-xl">
          <Image
            src="/FotoKelompok.png" // Pastikan gambar ini ada di folder `public` Anda
            alt="Our Team"
            layout="fill" // Mengisi penuh kontainer parent
            objectFit="cover" // Memastikan gambar menutupi area kontainer tanpa distorsi
          />
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // New state for slider

  const teamMembers = [
    { name: "Nathanael Satya Saputra", npm: "24/534424/TK/59236", role: "Project Leader" },
    { name: "Muhammad Nafal Zakin Rustanto", npm: "24/535255/TK/59364", role: "Algorithm Specialist" },
    { name: "Yohanes Anthony Saputra", npm: "24/536237/TK/59524", role: "Frontend Developer" },
    { name: "Faiz Gymnastiar Wibawa", npm: "24/537851/TK/59634", role: "Content Writer" },
    { name: "Muhammad Fachri Akbar", npm: "24/538155/TK/59679", role: "UI/UX Designer" },
    { name: "Aston Hugo", npm: "24/538303/TK/59700", role: "Backend Developer" },
    { name: "Ahmad Maulana Ibrahim", npm: "24/539655/TK/59853", role: "Researcher" },
    { name: "Johannes De De Dimas Aryobimo", npm: "24/540351/TK/59948", role: "Researcher" },
    { name: "Muhammad Falah Aufa Anggara", npm: "24/540500/TK/59995", role: "Documentation" },
    { name: "Farand Hafiz", npm: "24/540618/TK/60027", role: "Documentation" },
    { name: "Juan Eleanor Gabriel Sihotang", npm: "24/542016/TK/60194", role: "Researcher" },
    { name: "Natanael Sebastian Simanjuntak", npm: "24/542676/TK/60273", role: "Researcher" },
    { name: "Josiah Hermes", npm: "24/543958/TK/60463", role: "Quality Assurance" },
    { name: "Juan Christopher Reinaldo Sipayung", npm: "24/544528/TK/60526", role: "Quality Assurance" },
    { name: "Bagas Adjie Pamungkas", npm: "24/544718/TK/60547", role: "Quality Assurance" },
  ];


  const topics = [
    {
      title: "Pengertian & Karakteristik MST",
      description: "Memahami konsep dasar dan syarat-syarat MST",
      href: "/pengertian",
      color: "from-blue-500 to-blue-600",
      icon: <BookOpen size={32} />,
    },
    {
      title: "Algoritma Kruskal",
      description: "Mempelajari algoritma Kruskal untuk mencari MST",
      href: "/kruskal",
      color: "from-green-500 to-green-600",
      icon: <Code size={32} />,
    },
    {
      title: "Algoritma Prim",
      description: "Memahami cara kerja algoritma Prim",
      href: "/prim",
      color: "from-purple-500 to-purple-600",
      icon: <Zap size={32} />,
    },
    {
      title: "Perbandingan Algoritma",
      description: "Kelebihan dan kekurangan masing-masing algoritma",
      href: "/perbandingan",
      color: "from-orange-500 to-orange-600",
      icon: <Target size={32} />,
    },
    {
      title: "Implementasi Power Grid",
      description: "Penerapan MST dalam sistem jaringan listrik",
      href: "/implementasi",
      color: "from-red-500 to-red-600",
      icon: <Globe size={32} />,
    },
    // Add more topics here to see the slider in action if needed
    // {
    //   title: "Advanced MST Topics",
    //   description: "Exploring more complex aspects of MST",
    //   href: "/advanced",
    //   color: "from-indigo-500 to-indigo-600",
    //   icon: <BookOpen size={32} />,
    // },
    // {
    //   title: "MST in Machine Learning",
    //   description: "How MST is used in data clustering and ML",
    //   href: "/ml-mst",
    //   color: "from-pink-500 to-pink-600",
    //   icon: <Code size={32} />,
    // },
  ];

  const topicsPerPage = 3; // Number of topics to show per slide
  const totalSlides = Math.ceil(topics.length / topicsPerPage);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, totalSlides - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startIndex = currentSlideIndex * topicsPerPage;
  const visibleTopics = topics.slice(startIndex, startIndex + topicsPerPage);


  return (
    <div className="min-h-screen">

      {/* Meet Our Team Section */}
      <MeetOurTeamSection />

      {/* Call to Action and Main Title Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold text-gray-900 mb-8 ${pixelifySans.className}`}>
            Minimum Spanning Tree
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/pengertian"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
            >
              <BookOpen size={20} />
              <span>Mulai Belajar</span>
              <ChevronRight size={16} />
            </Link>
            <PPTGenerator
              isConverting={isConverting}
              setIsConverting={setIsConverting}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg text-center border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-2">{member.npm}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section (Modified for Slider) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Materi Pembelajaran
            </h2>
            <p className="text-lg text-gray-600">
              Jelajahi berbagai topik MST yang telah disusun secara sistematis
            </p>
          </div>

          <div className="relative">
            {/* Slider Content */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
              {visibleTopics.map((topic, index) => (
                <Link
                  key={index}
                  href={topic.href}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    className={`h-32 bg-gradient-to-r ${topic.color} flex items-center justify-center text-white`}
                  >
                    {topic.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
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
                </Link>
              ))}
            </div>

            {/* Navigation Buttons */}
            {topics.length > topicsPerPage && ( // Only show buttons if there are more topics than can fit on one slide
              <>
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-75 hover:opacity-100 disabled:opacity-30 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-75 hover:opacity-100 disabled:opacity-30 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}