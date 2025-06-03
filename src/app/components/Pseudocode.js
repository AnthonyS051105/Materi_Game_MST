"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function TextEditor({ pseudoCode }) {
  return (
    <div className="border rounded-lg w-1/2 duration-150 hover:-translate-y-1 hover:shadow-2xl">
      <div className="w-full p-2 bg-gray-100 rounded-t-lg border-b border-blue-950">
        <div className="flex justify-evenly w-12">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
      <div className="w-full p-2 rounded-b-lg bg-gray-50  overflow-auto max-h-96 h-96 scroll-smooth custom-scrollbar">
        <SyntaxHighlighter
          language="text" // or "plaintext"
          customStyle={{ background: "transparent" }}
        >
          {pseudoCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}