"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// const cppCode = `// Kode untuk structure Edge
// struct Edge {
//     int u, v, weight;

//     bool operator<(const Edge& other) const {
//         return weight < other.weight;
//     }
// };`;

export default function TextEditor({cppCode}) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true); // Trigger only once
        }
      },
      { threshold: 0.3 } // 30% of component visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated]);

  // Typewriter animation
  useEffect(() => {
    if (!hasAnimated || visibleLength >= cppCode.length) return;

    const timeout = setTimeout(() => {
      setVisibleLength((prev) => prev + 1);
    }, 3); // Adjust speed here

    return () => clearTimeout(timeout);
  }, [hasAnimated, visibleLength]);

  return (
    <div>
        <div className="w-full p-2 bg-gray-900 rounded-t-lg border-b border-blue-950">
            <div className="flex justify-evenly w-12">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
        </div>
        <div
        ref={containerRef}
        className="w-full p-2 rounded-b-lg bg-gray-900 overflow-auto max-h-96 h-96 scroll-smooth custom-scrollbar"
        >
        <SyntaxHighlighter
            language="cpp"
            style={vscDarkPlus}
            customStyle={{ background: "transparent" }}
        >
            {cppCode.substring(0, visibleLength)}
        </SyntaxHighlighter>
        </div>
    </div>
  );
}
