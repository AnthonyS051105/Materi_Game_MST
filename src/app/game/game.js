"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ImprovedGamePage() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [trafoCount, setTrafoCount] = useState(5);
  const [trafos, setTrafos] = useState([]);
  const [cables, setCables] = useState([]);
  const [selectedCables, setSelectedCables] = useState([]);
  const [mst, setMst] = useState([]);
  const [mstWeight, setMstWeight] = useState(0);
  const [playerWeight, setPlayerWeight] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const canvasRef = useRef(null);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Transition effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Map boundaries for trafo placement with better spacing - MUCH LARGER
  const mapBounds = {
    x: 120,
    y: 120,
    width: 1160,
    height: 760,
  };

  // Improved trafo generation with minimum distance constraint - MUCH LARGER SPACING
  const generateTrafos = (count) => {
    const newTrafos = [];
    const minDistance = 200; // Much larger minimum distance for better spacing
    const maxAttempts = 2000; // More attempts for better placement

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let validPosition = false;
      let newTrafo;

      while (!validPosition && attempts < maxAttempts) {
        const x = mapBounds.x + Math.random() * (mapBounds.width - 100);
        const y = mapBounds.y + Math.random() * (mapBounds.height - 100);

        newTrafo = {
          id: String.fromCharCode(65 + i),
          x: x,
          y: y,
          selected: false,
        };

        // Check distance from all existing trafos
        validPosition = true;
        for (const existingTrafo of newTrafos) {
          const distance = Math.sqrt(
            Math.pow(newTrafo.x - existingTrafo.x, 2) +
              Math.pow(newTrafo.y - existingTrafo.y, 2)
          );
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }

      if (validPosition) {
        newTrafos.push(newTrafo);
      } else {
        // Fallback: place in grid if random placement fails
        const gridSize = Math.ceil(Math.sqrt(count));
        const cellWidth = mapBounds.width / gridSize;
        const cellHeight = mapBounds.height / gridSize;
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        newTrafos.push({
          id: String.fromCharCode(65 + i),
          x: mapBounds.x + col * cellWidth + cellWidth / 2,
          y: mapBounds.y + row * cellHeight + cellHeight / 2,
          selected: false,
        });
      }
    }
    return newTrafos;
  };

  // Better weight calculation to reduce extreme values
  const generateCables = (trafos) => {
    const newCables = [];
    for (let i = 0; i < trafos.length; i++) {
      for (let j = i + 1; j < trafos.length; j++) {
        const distance = Math.sqrt(
          Math.pow(trafos[i].x - trafos[j].x, 2) +
            Math.pow(trafos[i].y - trafos[j].y, 2)
        );
        // Improved weight calculation with better scaling and reasonable range
        const baseWeight = Math.floor(distance / 30) + 1;
        const randomComponent = Math.floor(Math.random() * 6) + 1; // 1-6
        const weight = Math.min(baseWeight + randomComponent, 25); // Cap at 25

        newCables.push({
          from: trafos[i].id,
          to: trafos[j].id,
          weight: weight,
          selected: false,
        });
      }
    }
    return newCables;
  };

  // Kruskal algorithm for MST
  const findMSTKruskal = (vertices, edges) => {
    const parent = {};
    const rank = {};

    vertices.forEach((v) => {
      parent[v.id] = v.id;
      rank[v.id] = 0;
    });

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x, y) => {
      const px = find(x);
      const py = find(y);

      if (px === py) return false;

      if (rank[px] < rank[py]) {
        parent[px] = py;
      } else if (rank[px] > rank[py]) {
        parent[py] = px;
      } else {
        parent[py] = px;
        rank[px]++;
      }
      return true;
    };

    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const mstEdges = [];
    let totalWeight = 0;

    for (const edge of sortedEdges) {
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge);
        totalWeight += edge.weight;
        if (mstEdges.length === vertices.length - 1) break;
      }
    }

    return { mstEdges, totalWeight };
  };

  const startGame = () => {
    const newTrafos = generateTrafos(trafoCount);
    const newCables = generateCables(newTrafos);
    const { mstEdges, totalWeight } = findMSTKruskal(newTrafos, newCables);

    setTrafos(newTrafos);
    setCables(newCables);
    setMst(mstEdges);
    setMstWeight(totalWeight);
    setSelectedCables([]);
    setPlayerWeight(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  // Improved cable click detection
  const handleCableClick = (cable) => {
    if (gameFinished) return;

    const isSelected = selectedCables.some(
      (c) =>
        (c.from === cable.from && c.to === cable.to) ||
        (c.from === cable.to && c.to === cable.from)
    );

    if (isSelected) {
      setSelectedCables(
        selectedCables.filter(
          (c) =>
            !(
              (c.from === cable.from && c.to === cable.to) ||
              (c.from === cable.to && c.to === cable.from)
            )
        )
      );
      setPlayerWeight(playerWeight - cable.weight);
    } else {
      setSelectedCables([...selectedCables, cable]);
      setPlayerWeight(playerWeight + cable.weight);
    }
  };

  const submitAnswer = () => {
    setGameFinished(true);
    const isCorrect =
      playerWeight === mstWeight && selectedCables.length === trafoCount - 1;

    sessionStorage.setItem(
      "gameData",
      JSON.stringify({
        trafos,
        cables,
        selectedCables,
        mst,
        mstWeight,
        playerWeight,
        isCorrect,
      })
    );

    router.push("/game/solution");
  };

  const surrenderGame = () => {
    sessionStorage.setItem(
      "gameData",
      JSON.stringify({
        trafos,
        cables,
        selectedCables: [],
        mst,
        mstWeight,
        playerWeight: 0,
        isCorrect: false,
        surrendered: true,
      })
    );

    router.push("/game/solution");
  };

  // Enhanced canvas drawing with better edge detection zones
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map background
    const mapImg = new Image();
    mapImg.onload = () => {
      ctx.drawImage(
        mapImg,
        mapBounds.x,
        mapBounds.y,
        mapBounds.width,
        mapBounds.height
      );

      // Draw grid overlay with proper spacing for larger map
      ctx.strokeStyle = "#ffffff30";
      ctx.lineWidth = 1;
      for (let i = mapBounds.x; i <= mapBounds.x + mapBounds.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, mapBounds.y);
        ctx.lineTo(i, mapBounds.y + mapBounds.height);
        ctx.stroke();
      }
      for (let i = mapBounds.y; i <= mapBounds.y + mapBounds.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(mapBounds.x, i);
        ctx.lineTo(mapBounds.x + mapBounds.width, i);
        ctx.stroke();
      }

      // Draw title - LARGER FOR BIGGER MAP
      ctx.fillStyle = "#FFD700";
      ctx.font = 'bold 32px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("POWER GRID NETWORK", canvas.width / 2, 60);

      // Draw cables with improved visibility and darker colors
      cables.forEach((cable) => {
        const fromTrafo = trafos.find((t) => t.id === cable.from);
        const toTrafo = trafos.find((t) => t.id === cable.to);

        if (!fromTrafo || !toTrafo) return;

        const isSelected = selectedCables.some(
          (c) =>
            (c.from === cable.from && c.to === cable.to) ||
            (c.from === cable.to && c.to === cable.from)
        );

        // Draw cable shadow for better visibility - THICKER FOR LARGER SCREEN
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = isSelected ? 10 : 8;
        ctx.beginPath();
        ctx.moveTo(fromTrafo.x + 40, fromTrafo.y + 40);
        ctx.lineTo(toTrafo.x + 40, toTrafo.y + 40);
        ctx.stroke();

        // Draw main cable with much darker and thicker lines - THICKER
        ctx.strokeStyle = isSelected ? "#CC0000" : "#1a1a1a"; // Dark red for selected, very dark gray for unselected
        ctx.lineWidth = isSelected ? 8 : 6;
        ctx.setLineDash(isSelected ? [] : [16, 8]); // Longer dashes for better visibility on larger screen

        ctx.beginPath();
        ctx.moveTo(fromTrafo.x + 40, fromTrafo.y + 40);
        ctx.lineTo(toTrafo.x + 40, toTrafo.y + 40);
        ctx.stroke();

        // Draw weight label with intelligent positioning to avoid trafo overlap
        const midX = (fromTrafo.x + toTrafo.x) / 2 + 40;
        const midY = (fromTrafo.y + toTrafo.y) / 2 + 40;

        // Calculate label offset to avoid trafo overlap
        let labelX = midX;
        let labelY = midY;

        // Check if label position conflicts with any trafo and adjust if needed
        let labelAdjusted = false;
        for (const trafo of trafos) {
          const trafoX = trafo.x + 40; // Center of trafo
          const trafoY = trafo.y + 40;
          const distToTrafo = Math.sqrt(
            Math.pow(labelX - trafoX, 2) + Math.pow(labelY - trafoY, 2)
          );

          // If label is too close to a trafo (within 60px), move it
          if (distToTrafo < 60) {
            // Calculate perpendicular offset from line
            const lineVecX = toTrafo.x - fromTrafo.x;
            const lineVecY = toTrafo.y - fromTrafo.y;
            const lineLength = Math.sqrt(
              lineVecX * lineVecX + lineVecY * lineVecY
            );

            if (lineLength > 0) {
              // Perpendicular vector (rotated 90 degrees)
              const perpX = -lineVecY / lineLength;
              const perpY = lineVecX / lineLength;

              // Try both directions and pick the one further from trafos
              const offset = 35;
              const option1X = midX + perpX * offset;
              const option1Y = midY + perpY * offset;
              const option2X = midX - perpX * offset;
              const option2Y = midY - perpY * offset;

              // Calculate distances to all trafos for both options
              let option1MinDist = Infinity;
              let option2MinDist = Infinity;

              for (const t of trafos) {
                const tX = t.x + 40;
                const tY = t.y + 40;
                const dist1 = Math.sqrt(
                  Math.pow(option1X - tX, 2) + Math.pow(option1Y - tY, 2)
                );
                const dist2 = Math.sqrt(
                  Math.pow(option2X - tX, 2) + Math.pow(option2Y - tY, 2)
                );
                option1MinDist = Math.min(option1MinDist, dist1);
                option2MinDist = Math.min(option2MinDist, dist2);
              }

              // Choose the option with greater minimum distance to trafos
              if (option1MinDist > option2MinDist) {
                labelX = option1X;
                labelY = option1Y;
              } else {
                labelX = option2X;
                labelY = option2Y;
              }

              labelAdjusted = true;
              break;
            }
          }
        }

        // Additional check: ensure label stays within canvas bounds
        const labelWidth = 50;
        const labelHeight = 36;
        labelX = Math.max(
          labelWidth / 2,
          Math.min(canvas.width - labelWidth / 2, labelX)
        );
        labelY = Math.max(
          labelHeight / 2,
          Math.min(canvas.height - labelHeight / 2, labelY)
        );

        // Draw label background with dark background for better contrast - LARGER
        ctx.fillStyle = isSelected ? "#CC0000" : "#000000";
        ctx.fillRect(labelX - 25, labelY - 18, 50, 36);

        // Draw label border - THICKER
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(labelX - 25, labelY - 18, 50, 36);

        // Draw connection line from label to edge midpoint if label was moved
        if (labelAdjusted) {
          ctx.strokeStyle = isSelected ? "#CC0000" : "#666666";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(labelX, labelY);
          ctx.lineTo(midX, midY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw weight text with larger font - LARGER TEXT
        ctx.fillStyle = "#FFFFFF";
        ctx.font = 'bold 18px "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.fillText(cable.weight.toString(), labelX, labelY + 6);
      });

      // Draw trafos using image asset - LARGER TRAFOS
      const trafoImg = new Image();
      trafoImg.onload = () => {
        trafos.forEach((trafo) => {
          // Draw trafo shadow - LARGER
          ctx.fillStyle = "#00000040";
          ctx.fillRect(trafo.x + 3, trafo.y + 3, 80, 80);

          // Draw trafo image - LARGER (80x80 instead of 60x60)
          ctx.drawImage(trafoImg, trafo.x, trafo.y, 80, 80);

          // Draw trafo border - THICKER
          ctx.strokeStyle = "#FFD700";
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          ctx.strokeRect(trafo.x, trafo.y, 80, 80);

          // Draw label background - LARGER
          ctx.fillStyle = "#000000CC";
          ctx.fillRect(trafo.x + 5, trafo.y + 60, 70, 25);

          // Draw label - LARGER TEXT
          ctx.fillStyle = "#FFD700";
          ctx.font = 'bold 18px "Press Start 2P", monospace';
          ctx.textAlign = "center";
          ctx.fillText(trafo.id, trafo.x + 40, trafo.y + 78);
        });
      };
      trafoImg.src = "/TrafoAset.png";
    };
    mapImg.src = "/MapAset.jpg";

    ctx.setLineDash([]);
  }, [trafos, cables, selectedCables, gameStarted]);

  // Much improved cable click detection with better algorithm
  const handleCanvasClick = (event) => {
    if (!gameStarted || gameFinished) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to match canvas internal coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Enhanced cable detection algorithm
    let candidateCables = [];

    for (const cable of cables) {
      const fromTrafo = trafos.find((t) => t.id === cable.from);
      const toTrafo = trafos.find((t) => t.id === cable.to);

      if (!fromTrafo || !toTrafo) continue;

      const dist = pointToLineDistance(
        scaledX,
        scaledY,
        fromTrafo.x + 40,
        fromTrafo.y + 40,
        toTrafo.x + 40,
        toTrafo.y + 40
      );

      // Collect all cables within hit zone
      if (dist < 30) {
        candidateCables.push({
          cable: cable,
          distance: dist,
          lineLength: Math.sqrt(
            Math.pow(toTrafo.x - fromTrafo.x, 2) +
              Math.pow(toTrafo.y - fromTrafo.y, 2)
          ),
        });
      }
    }

    if (candidateCables.length === 0) return;

    // Sort by distance first, then by line length (prefer shorter lines for overlapping cases)
    candidateCables.sort((a, b) => {
      const distDiff = a.distance - b.distance;
      if (Math.abs(distDiff) < 5) {
        // If distances are very close (within 5px)
        return a.lineLength - b.lineLength; // Prefer shorter line
      }
      return distDiff; // Otherwise prefer closer distance
    });

    // If we have multiple very close candidates, prefer the one with weight closer to a "typical" range
    if (candidateCables.length > 1) {
      const closestDistance = candidateCables[0].distance;
      const veryCloseCandidates = candidateCables.filter(
        (c) => Math.abs(c.distance - closestDistance) < 3
      );

      if (veryCloseCandidates.length > 1) {
        // Among very close candidates, prefer cables with weights in normal range (1-20)
        const normalRangeCandidates = veryCloseCandidates.filter(
          (c) => c.cable.weight >= 1 && c.cable.weight <= 20
        );

        if (normalRangeCandidates.length > 0) {
          handleCableClick(normalRangeCandidates[0].cable);
          return;
        }
      }
    }

    handleCableClick(candidateCables[0].cable);
  };

  const pointToLineDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Custom octagon button component with more rectangular shape and darker color - LARGER
  const GameButton = ({ onClick, disabled, children, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 flex items-center justify-center font-semibold text-white text-xs cursor-pointer select-none transition-all duration-300 border-none ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-400"
          : "bg-[#d4b73a] hover:bg-[#b8a232] focus:outline-none focus:shadow-[0_0_0_3px_#f2eaa3]"
      } ${className}`}
      style={{
        clipPath:
          "polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)",
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {children}
    </button>
  );

  // Transition screen
  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-8xl mb-8 animate-pulse">⚡</div>
          <div
            className="text-white text-4xl mb-6 animate-bounce"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            ENTERING POWER GRID...
          </div>
          <div className="flex space-x-3 justify-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      {/* Main content */}
      <main className="flex flex-col xl:flex-row justify-center items-start gap-8 p-4 md:p-6 lg:p-8">
        {!gameStarted ? (
          // Game Setup - ENLARGED
          <div className="w-full max-w-lg mx-auto">
            <div className="rounded-lg border-8 border-[#f9b233] p-8 bg-white">
              <h2 className="text-3xl mb-8 text-center text-[#3b6ea5]">
                GAME SETUP
              </h2>

              <div className="mb-8">
                <label className="block text-[#3b6ea5] mb-4 text-base">
                  Number of Transformers:
                </label>
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={() => setTrafoCount(Math.max(3, trafoCount - 1))}
                    className="text-black font-bold text-xl select-none border-4 border-black bg-[#f9b233] w-12 h-12 rounded"
                  >
                    -
                  </button>
                  <span className="text-3xl text-[#3b6ea5] w-20 text-center font-bold">
                    {trafoCount}
                  </span>
                  <button
                    onClick={() => setTrafoCount(Math.min(10, trafoCount + 1))}
                    className="text-black font-bold text-xl select-none border-4 border-black bg-[#f9b233] w-12 h-12 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <GameButton onClick={startGame} className="w-full">
                START GAME
              </GameButton>
            </div>
          </div>
        ) : (
          <>
            {/* Left: Game Canvas - MAXIMUM SIZE */}
            <div className="rounded-lg border-8 border-[#f9b233] w-full max-w-[1400px]">
              <canvas
                ref={canvasRef}
                width={1400}
                height={1000}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                onClick={handleCanvasClick}
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Right: Controls - ENLARGED */}
            <section className="flex flex-col items-center space-y-6 min-w-[280px] w-full max-w-[300px]">
              {/* Transformer Icon - LARGER */}
              <div className="rounded-lg border-4 border-[#f9b233] p-4 bg-black flex justify-center items-center w-28 h-28">
                <img
                  alt="Transformer icon"
                  className="w-20 h-20"
                  src="/TrafoAset.png"
                />
              </div>

              {/* Score Display - LARGER */}
              <div className="w-full text-center">
                <div className="text-[#3b6ea5] text-base mb-3">YOUR COST:</div>
                <div className="border-4 border-black rounded-md h-14 px-4 text-center text-black font-bold text-lg bg-white flex items-center justify-center">
                  {playerWeight}
                </div>
              </div>

              <GameButton
                onClick={submitAnswer}
                disabled={
                  gameFinished || selectedCables.length !== trafoCount - 1
                }
                className="w-full h-14 text-sm"
              >
                Submit
              </GameButton>

              <GameButton
                onClick={surrenderGame}
                className="w-full h-14 text-sm"
              >
                Give Up!
              </GameButton>

              <GameButton onClick={startGame} className="w-full h-14 text-sm">
                New Game
              </GameButton>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
