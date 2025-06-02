"use client";

export default function AlgorithmStep({ step, isActive, children }) {
  return (
    <div
      className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
        isActive
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
            isActive ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          {step}
        </div>
        <span
          className={`font-semibold ${
            isActive ? "text-blue-800" : "text-gray-700"
          }`}
        >
          Langkah {step}
        </span>
      </div>
      <div className={isActive ? "text-blue-700" : "text-gray-600"}>
        {children}
      </div>
    </div>
  );
}
