"use client";

import { useState } from "react";
import {
  Download,
  Users,
  BookOpen,
  Target,
  ChevronRight,
  Zap,
  Code,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);

  // Fungsi untuk capture screenshot dari element
  const captureElement = async (elementId, options = {}) => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element =
        document.getElementById(elementId) || document.querySelector(elementId);

      if (!element) {
        console.warn(`Element ${elementId} not found`);
        return null;
      }

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 2, // Higher quality
        width: 1920, // Standard presentation width
        height: 1080, // Standard presentation height
        backgroundColor: "#ffffff",
        ...options,
      });

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing element:", error);
      return null;
    }
  };

  // Fungsi utama untuk convert UI ke PPT
  const handleConvertUIToPPT = async () => {
    setIsConverting(true);

    try {
      console.log("Starting UI to PPT conversion...");

      // Dynamic import libraries
      const PptxGenJS = (await import("pptxgenjs")).default;
      const html2canvas = (await import("html2canvas")).default;

      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9"; // Widescreen format
      pptx.author = "MST Learning Team";
      pptx.title = "MST Learning - UI Presentation";

      // ===============================
      // SLIDE 1: Hero Section Capture
      // ===============================
      console.log("Capturing hero section...");

      const heroElement = document.createElement("div");
      heroElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: linear-gradient(to right, #2563eb, #4338ca);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
      `;

      heroElement.innerHTML = `
        <div style="text-align: center; padding: 80px;">
          <h1 style="font-size: 72px; font-weight: bold; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            Minimum Spanning Tree
          </h1>
          <p style="font-size: 28px; margin-bottom: 60px; max-width: 1200px; line-height: 1.4; opacity: 0.9;">
            Jelajahi dunia algoritma graf yang menakjubkan! Pelajari konsep MST, 
            algoritma Kruskal dan Prim, serta implementasinya dalam kehidupan nyata 
            melalui website interaktif ini.
          </p>
          <div style="display: flex; gap: 30px; justify-content: center;">
            <div style="background: white; color: #2563eb; padding: 20px 40px; border-radius: 12px; font-weight: bold; font-size: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
              📚 Mulai Belajar
            </div>
            <div style="border: 3px solid white; color: white; padding: 20px 40px; border-radius: 12px; font-weight: bold; font-size: 20px;">
              📥 Download PPT
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(heroElement);
      const heroImage = await html2canvas(heroElement, {
        width: 1920,
        height: 1080,
        backgroundColor: null,
      });
      document.body.removeChild(heroElement);

      const slide1 = pptx.addSlide();
      slide1.addImage({
        data: heroImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 2: Introduction Section
      // ===============================
      console.log("Creating introduction slide...");

      const introElement = document.createElement("div");
      introElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: white;
        padding: 80px;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
      `;

      introElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 60px;">
          <div style="width: 80px; height: 80px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
            <span style="color: white; font-size: 32px;">🎯</span>
          </div>
          <h2 style="font-size: 48px; font-weight: bold; color: #111827; margin-bottom: 20px;">
            Pengantar Pembelajaran
          </h2>
          <p style="font-size: 20px; color: #6b7280; max-width: 1400px; margin: 0 auto; line-height: 1.6;">
            Minimum Spanning Tree (MST) adalah salah satu konsep fundamental dalam teori graf yang memiliki aplikasi luas dalam berbagai bidang seperti jaringan komputer, sistem transportasi, dan infrastruktur. Website ini dirancang untuk memberikan pemahaman mendalam tentang MST melalui pendekatan interaktif dan visualisasi yang menarik.
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1400px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px; background: #dbeafe; border-radius: 16px;">
            <div style="background: #3b82f6; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
              <span style="color: white; font-size: 32px;">📚</span>
            </div>
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #1e40af;">Pembelajaran Interaktif</h3>
            <p style="color: #1e40af; font-size: 16px; line-height: 1.5;">Materi disajikan dengan visualisasi dan simulasi yang memudahkan pemahaman konsep MST</p>
          </div>
          
          <div style="text-align: center; padding: 40px; background: #dcfce7; border-radius: 16px;">
            <div style="background: #22c55e; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
              <span style="color: white; font-size: 32px;">⚡</span>
            </div>
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #166534;">Algoritma Praktis</h3>
            <p style="color: #166534; font-size: 16px; line-height: 1.5;">Implementasi langsung algoritma Kruskal dan Prim dengan contoh kasus nyata</p>
          </div>
          
          <div style="text-align: center; padding: 40px; background: #fef3c7; border-radius: 16px;">
            <div style="background: #f59e0b; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
              <span style="color: white; font-size: 32px;">🌍</span>
            </div>
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #92400e;">Aplikasi Real-World</h3>
            <p style="color: #92400e; font-size: 16px; line-height: 1.5;">Studi kasus implementasi MST dalam sistem power grid dan infrastruktur</p>
          </div>
        </div>
      `;

      document.body.appendChild(introElement);
      const introImage = await html2canvas(introElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(introElement);

      const slide2 = pptx.addSlide();
      slide2.addImage({
        data: introImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 3: Topics Section UI
      // ===============================
      console.log("Creating topics slide...");

      const topicsElement = document.createElement("div");
      topicsElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: #f9fafb;
        padding: 80px;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
      `;

      topicsElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 48px; font-weight: bold; color: #111827; margin-bottom: 20px;">
            Materi Pembelajaran
          </h2>
          <p style="font-size: 24px; color: #6b7280;">
            Jelajahi berbagai topik MST yang telah disusun secara sistematis
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1600px; margin: 0 auto;">
          <div style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.3s;">
            <div style="height: 120px; background: linear-gradient(to right, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 48px;">📚</div>
            </div>
            <div style="padding: 30px;">
              <h3 style="font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 15px;">Pengertian & Karakteristik MST</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Memahami konsep dasar dan syarat-syarat MST</p>
            </div>
          </div>
          
          <div style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="height: 120px; background: linear-gradient(to right, #10b981, #059669); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 48px;">⚙️</div>
            </div>
            <div style="padding: 30px;">
              <h3 style="font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 15px;">Algoritma Kruskal</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Mempelajari algoritma Kruskal untuk mencari MST</p>
            </div>
          </div>
          
          <div style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="height: 120px; background: linear-gradient(to right, #8b5cf6, #7c3aed); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 48px;">⚡</div>
            </div>
            <div style="padding: 30px;">
              <h3 style="font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 15px;">Algoritma Prim</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Memahami cara kerja algoritma Prim</p>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; max-width: 1200px; margin: 40px auto 0;">
          <div style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="height: 120px; background: linear-gradient(to right, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 48px;">📊</div>
            </div>
            <div style="padding: 30px;">
              <h3 style="font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 15px;">Perbandingan Algoritma</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Kelebihan dan kekurangan masing-masing algoritma</p>
            </div>
          </div>
          
          <div style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="height: 120px; background: linear-gradient(to right, #dc2626, #b91c1c); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 48px;">🏭</div>
            </div>
            <div style="padding: 30px;">
              <h3 style="font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 15px;">Implementasi Power Grid</h3>
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Penerapan MST dalam sistem jaringan listrik</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(topicsElement);
      const topicsImage = await html2canvas(topicsElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(topicsElement);

      const slide3 = pptx.addSlide();
      slide3.addImage({
        data: topicsImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 4: Algorithm Comparison UI
      // ===============================
      console.log("Creating comparison slide...");

      const comparisonElement = document.createElement("div");
      comparisonElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: white;
        padding: 80px;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
      `;

      comparisonElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 48px; font-weight: bold; color: #ea580c; margin-bottom: 20px;">
            Perbandingan Algoritma
          </h2>
          <p style="font-size: 24px; color: #6b7280;">
            Kruskal vs Prim - Pilih yang tepat untuk kebutuhan Anda
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; max-width: 1600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); padding: 50px; border-radius: 20px; border-left: 8px solid #22c55e;">
            <div style="display: flex; align-items: center; margin-bottom: 30px;">
              <div style="width: 70px; height: 70px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 25px;">
                <span style="color: white; font-size: 28px; font-weight: bold;">K</span>
              </div>
              <h3 style="font-size: 36px; font-weight: bold; color: #166534;">Algoritma Kruskal</h3>
            </div>
            <ul style="list-style: none; padding: 0; font-size: 20px; color: #166534; line-height: 2.2;">
              <li style="margin-bottom: 18px;">✅ Edge-based approach</li>
              <li style="margin-bottom: 18px;">✅ Baik untuk Sparse Graph</li>
              <li style="margin-bottom: 18px;">✅ Menggunakan Union-Find</li>
              <li style="margin-bottom: 18px;">✅ Kompleksitas: O(E log E)</li>
              <li style="margin-bottom: 18px;">✅ Implementasi sederhana</li>
              <li style="margin-bottom: 18px;">✅ Cocok untuk graf tidak terhubung</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #f3e8ff, #e9d5ff); padding: 50px; border-radius: 20px; border-left: 8px solid #a855f7;">
            <div style="display: flex; align-items: center; margin-bottom: 30px;">
              <div style="width: 70px; height: 70px; background: #a855f7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 25px;">
                <span style="color: white; font-size: 28px; font-weight: bold;">P</span>
              </div>
              <h3 style="font-size: 36px; font-weight: bold; color: #7c2d12;">Algoritma Prim</h3>
            </div>
            <ul style="list-style: none; padding: 0; font-size: 20px; color: #7c2d12; line-height: 2.2;">
              <li style="margin-bottom: 18px;">✅ Vertex-based approach</li>
              <li style="margin-bottom: 18px;">✅ Baik untuk Dense Graph</li>
              <li style="margin-bottom: 18px;">✅ Menggunakan Priority Queue</li>
              <li style="margin-bottom: 18px;">✅ Kompleksitas: O(V²) atau O(E log V)</li>
              <li style="margin-bottom: 18px;">✅ Partial MST support</li>
              <li style="margin-bottom: 18px;">✅ Memory efficient</li>
            </ul>
          </div>
        </div>
      `;

      document.body.appendChild(comparisonElement);
      const comparisonImage = await html2canvas(comparisonElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(comparisonElement);

      const slide4 = pptx.addSlide();
      slide4.addImage({
        data: comparisonImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 5: Power Grid Implementation UI
      // ===============================
      console.log("Creating implementation slide...");

      const implementationElement = document.createElement("div");
      implementationElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        padding: 80px;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
      `;

      implementationElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 60px;">
          <div style="font-size: 72px; margin-bottom: 20px;">🏭</div>
          <h2 style="font-size: 48px; font-weight: bold; color: #dc2626; margin-bottom: 20px;">
            Implementasi: Power Grid System
          </h2>
          <p style="font-size: 24px; color: #7c2d12;">
            Penerapan MST dalam sistem jaringan distribusi listrik yang efisien
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; max-width: 1600px; margin: 0 auto;">
          <div style="background: white; padding: 45px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
            <h3 style="font-size: 32px; font-weight: bold; color: #dc2626; margin-bottom: 30px; display: flex; align-items: center;">
              <span style="margin-right: 15px;">💰</span> Manfaat Ekonomi
            </h3>
            <ul style="list-style: none; padding: 0; font-size: 20px; color: #374151; line-height: 1.8;">
              <li style="margin-bottom: 18px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">📉</span> Minimisasi biaya infrastruktur (35-50% saving)
              </li>
              <li style="margin-bottom: 18px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">⚡</span> Optimasi jalur distribusi
              </li>
              <li style="margin-bottom: 18px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">🔒</span> Redundansi terkontrol
              </li>
              <li style="margin-bottom: 18px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">🔧</span> Efisiensi maintenance
              </li>
              <li style="margin-bottom: 18px; display: flex; align-items: center;">
                <span style="margin-right: 12px;">📊</span> Real-time monitoring
              </li>
            </ul>
          </div>
          
          <div style="background: white; padding: 45px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
            <h3 style="font-size: 32px; font-weight: bold; color: #dc2626; margin-bottom: 30px; display: flex; align-items: center;">
              <span style="margin-right: 15px;">🌍</span> Studi Kasus Global
            </h3>
            <div style="font-size: 18px; color: #374151; line-height: 1.8;">
              <div style="background: #f0f9ff; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 5px solid #0ea5e9;">
                <strong style="font-size: 20px;">🇮🇩 PLN Indonesia:</strong><br>
                <span style="color: #0369a1;">Penghematan 2.1 triliun rupiah dengan implementasi MST smart grid</span>
              </div>
              <div style="background: #f0fdf4; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 5px solid #22c55e;">
                <strong style="font-size: 20px;">🇪🇺 European Grid:</strong><br>
                <span style="color: #166534;">40% pengurangan biaya transmisi regional</span>
              </div>
              <div style="background: #fefce8; padding: 25px; border-radius: 15px; border-left: 5px solid #eab308;">
                <strong style="font-size: 20px;">🇺🇸 Smart Grid USA:</strong><br>
                <span style="color: #a16207;">AI-powered MST optimization untuk 50 juta rumah</span>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(implementationElement);
      const implementationImage = await html2canvas(implementationElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(implementationElement);

      const slide5 = pptx.addSlide();
      slide5.addImage({
        data: implementationImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 6: Team Section UI
      // ===============================
      console.log("Creating team slide...");

      const teamElement = document.createElement("div");
      teamElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: white;
        padding: 80px;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        box-sizing: border-box;
      `;

      teamElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 60px;">
          <div style="font-size: 72px; margin-bottom: 20px;">👥</div>
          <h2 style="font-size: 48px; font-weight: bold; color: #2563eb; margin-bottom: 20px;">
            Anggota Kelompok
          </h2>
          <p style="font-size: 24px; color: #6b7280;">
            Tim pengembang website pembelajaran MST
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1400px; margin: 0 auto 40px;">
          <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 36px; font-weight: bold;">AR</div>
            <h3 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 10px;">Ahmad Rizki</h3>
            <p style="color: #6b7280; margin-bottom: 15px; font-size: 16px;">NPM: 2023001</p>
            <span style="background: #dbeafe; color: #1e40af; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">Project Leader</span>
          </div>
          
          <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 36px; font-weight: bold;">SN</div>
            <h3 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 10px;">Siti Nurhaliza</h3>
            <p style="color: #6b7280; margin-bottom: 15px; font-size: 16px;">NPM: 2023002</p>
            <span style="background: #dcfce7; color: #166534; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">Algorithm Specialist</span>
          </div>
          
          <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #a855f7, #9333ea); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 36px; font-weight: bold;">BS</div>
            <h3 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 10px;">Budi Santoso</h3>
            <p style="color: #6b7280; margin-bottom: 15px; font-size: 16px;">NPM: 2023003</p>
            <span style="background: #f3e8ff; color: #7c3aed; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">Frontend Developer</span>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; max-width: 900px; margin: 0 auto 40px;">
          <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 36px; font-weight: bold;">DS</div>
            <h3 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 10px;">Dewi Sartika</h3>
            <p style="color: #6b7280; margin-bottom: 15px; font-size: 16px;">NPM: 2023004</p>
            <span style="background: #fef3c7; color: #92400e; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">Content Writer</span>
          </div>
          
          <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 36px; font-weight: bold;">MF</div>
            <h3 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 10px;">Muhammad Fadli</h3>
            <p style="color: #6b7280; margin-bottom: 15px; font-size: 16px;">NPM: 2023005</p>
            <span style="background: #fee2e2; color: #dc2626; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold;">UI/UX Designer</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 40px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 20px;">
          <p style="font-size: 20px; color: #0369a1; font-weight: 500;">
            🎓 Dibuat dengan dedikasi untuk pembelajaran Minimum Spanning Tree
          </p>
        </div>
      `;

      document.body.appendChild(teamElement);
      const teamImage = await html2canvas(teamElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(teamElement);

      const slide6 = pptx.addSlide();
      slide6.addImage({
        data: teamImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // ===============================
      // SLIDE 7: Conclusion/Thank You Slide
      // ===============================
      console.log("Creating conclusion slide...");

      const conclusionElement = document.createElement("div");
      conclusionElement.style.cssText = `
        width: 1920px;
        height: 1080px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        position: absolute;
        top: -9999px;
        left: -9999px;
        text-align: center;
        padding: 80px;
        box-sizing: border-box;
      `;

      conclusionElement.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 30px;">🎉</div>
        <h1 style="font-size: 64px; font-weight: bold; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          Terima Kasih!
        </h1>
        <p style="font-size: 28px; margin-bottom: 50px; max-width: 1200px; line-height: 1.4; opacity: 0.9;">
          Semoga website pembelajaran MST ini bermanfaat untuk pemahaman algoritma graf yang lebih mendalam
        </p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); margin-bottom: 40px;">
          <h3 style="font-size: 32px; font-weight: bold; margin-bottom: 25px;">💡 Key Takeaways</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; font-size: 18px;">
            <div>
              <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
              <p>Pemahaman konsep MST</p>
            </div>
            <div>
              <div style="font-size: 24px; margin-bottom: 10px;">⚙️</div>
              <p>Algoritma Kruskal & Prim</p>
            </div>
            <div>
              <div style="font-size: 24px; margin-bottom: 10px;">🌐</div>
              <p>Aplikasi Real-World</p>
            </div>
          </div>
        </div>
        
        <div style="font-size: 20px; opacity: 0.8;">
          🌟 Keep Learning, Keep Growing! 🌟
        </div>
      `;

      document.body.appendChild(conclusionElement);
      const conclusionImage = await html2canvas(conclusionElement, {
        width: 1920,
        height: 1080,
      });
      document.body.removeChild(conclusionElement);

      const slide7 = pptx.addSlide();
      slide7.addImage({
        data: conclusionImage.toDataURL(),
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
      });

      // Generate PPT file
      console.log("Generating UI-based PowerPoint...");
      await pptx.writeFile({ fileName: "MST_Learning_UI_Design.pptx" });

      console.log("UI PowerPoint generated successfully!");
      alert(
        "🎉 PowerPoint dengan desain UI website berhasil didownload!\n\nFile berisi 7 slide:\n• Hero section dengan gradient\n• Introduction dengan feature cards\n• Learning topics layout\n• Algorithm comparison\n• Power grid implementation\n• Team member showcase\n• Conclusion slide\n\nDesain sesuai dengan UI website Anda!"
      );
    } catch (error) {
      console.error("UI PPT conversion error:", error);
      alert(
        "❌ Gagal membuat PPT dengan UI design.\n\nKemungkinan penyebab:\n• Browser tidak support html2canvas\n• Memory insufficient\n• Library tidak terinstall\n\nPastikan:\n• npm install html2canvas pptxgenjs\n• Gunakan browser Chrome/Edge\n• Refresh halaman dan coba lagi"
      );
    } finally {
      setIsConverting(false);
    }
  };

  // Data untuk komponen
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
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
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
              onClick={handleConvertUIToPPT}
              disabled={isConverting}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Download size={20} />
              <span>
                {isConverting ? "Generating UI PPT..." : "Download UI PPT"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="intro-section" className="py-16 bg-white">
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
                Materi disajikan dengan visualisasi dan simulasi yang memudahkan
                pemahaman konsep MST
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Algoritma Praktis</h3>
              <p className="text-gray-600">
                Implementasi langsung algoritma Kruskal dan Prim dengan contoh
                kasus nyata
              </p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Aplikasi Real-World
              </h3>
              <p className="text-gray-600">
                Studi kasus implementasi MST dalam sistem power grid dan
                infrastruktur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics-section" className="py-16 bg-gray-50">
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
        </div>
      </section>

      {/* Team Section */}
      <section id="team-section" className="py-16 bg-white">
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
                className="bg-gray-50 p-6 rounded-lg text-center border-2 border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-2">{member.npm}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-lg text-blue-700 font-medium">
              🎓 Dibuat dengan dedikasi untuk pembelajaran Minimum Spanning Tree
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
