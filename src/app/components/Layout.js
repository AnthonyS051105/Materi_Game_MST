"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
} from "lucide-react";

import { Pixelify_Sans } from 'next/font/google';

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Pengertian MST", href: "/pengertian" },
    { name: "Algoritma Kruskal", href: "/kruskal" },
    { name: "Algoritma Prim", href: "/prim" },
    { name: "Perbandingan", href: "/perbandingan" },
    { name: "Implementasi", href: "/implementasi" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col"> {/* Tambahkan flex flex-col agar footer selalu di bawah */}
      <nav className="bg-[#3B75A8] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="MST Logo" className="h-10 w-auto" />
                <span className={`font-bold text-xl text-white ${pixelifySans.className}`}>
                  MST Learning
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-white hover:text-[#FFCA7A] px-3 py-2 rounded-md transition-colors duration-200 ${pixelifySans.className}`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-[#FFCA7A] p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#3B75A8] border-t border-blue-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-white hover:text-[#FFCA7A] block px-3 py-2 rounded-md transition-colors duration-200 ${pixelifySans.className}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      {/* FOOTER BARU */}
      <footer className="w-full">
        <div className="flex"> {/* Menggunakan flexbox untuk memisahkan kiri dan kanan */}
          {/* Bagian Kiri (Kuning) - Sekarang mengambil 1/3 lebar */}
          {/* Tambahkan shrink-0 di sini */}
          <div className="w-1/3 bg-[#FFBC33] text-[#3B75A8] py-4 px-4 sm:px-6 lg:px-8 flex items-center shrink-0">
            <p className={`font-bold ${pixelifySans.className}`}>Kelompok MST - Teknologi Informasi</p>
          </div>

          {/* Bagian Kanan (Biru Gelap) - Sekarang mengambil 2/3 lebar */}
          {/* Tambahkan shrink-0 di sini */}
          <div className="w-2/3 bg-[#3B75A8] text-[#FFBC33] py-4 px-4 sm:px-6 lg:px-8 text-right flex items-center justify-end shrink-0">
            <p className={`text-sm ${pixelifySans.className}`}>
              &copy; 2025. Dibuat untuk Proyek ASD - DTETI FT UGM.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}