import { useEffect, useRef, useState } from "react";

export default function CyberCircuitBg() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth) * 2 - 1;
      targetY = (e.clientY / innerHeight) * 2 - 1;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMouse({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden bg-void select-none"
      aria-hidden="true"
    >
      {/* 1. Atmospheric Ambient Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(0,229,204,0.14)_0%,rgba(0,100,220,0.06)_42%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_30%,rgba(0,229,204,0.08)_0%,transparent_38%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_28%,rgba(0,140,255,0.09)_0%,transparent_42%)]" />

      {/* 2. Deep Parallax Layer (Backdrop Circuit Tracks & Microchips) */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${mouse.x * -10}px, ${mouse.y * -6}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full opacity-60"
        >
          <defs>
            <filter id="deepBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deep Left Background Traces */}
          <g stroke="#03558c" strokeWidth="1.5" fill="none" opacity="0.55" filter="url(#deepBlueGlow)">
            <path d="M 680,260 L 520,260 L 400,140 L 220,140 L 80,140" />
            <path d="M 650,300 L 540,300 L 440,200 L 300,200" />
            <path d="M 700,640 L 580,640 L 460,760 L 260,760 L 100,760" />
            <path d="M 660,680 L 560,680 L 480,760" />
            <path d="M 440,60 L 440,160 L 360,240 L 200,240" />
          </g>

          {/* Deep Right Background Traces */}
          <g stroke="#03558c" strokeWidth="1.5" fill="none" opacity="0.55" filter="url(#deepBlueGlow)">
            <path d="M 1240,260 L 1400,260 L 1520,140 L 1700,140 L 1840,140" />
            <path d="M 1270,300 L 1380,300 L 1480,200 L 1620,200" />
            <path d="M 1220,640 L 1340,640 L 1460,760 L 1660,760 L 1820,760" />
            <path d="M 1260,680 L 1360,680 L 1440,760" />
            <path d="M 1480,60 L 1480,160 L 1560,240 L 1720,240" />
          </g>

          {/* Background SMD IC Chips */}
          <g fill="#050d18" stroke="#004877" strokeWidth="1">
            <rect x="240" y="320" width="130" height="84" rx="4" />
            <rect x="1550" y="320" width="130" height="84" rx="4" />
            <rect x="90" y="590" width="110" height="66" rx="4" />
            <rect x="1720" y="590" width="110" height="66" rx="4" />
          </g>

          {/* Deep micro via dots */}
          <g fill="#0284c7">
            <circle cx="220" cy="140" r="3.5" />
            <circle cx="80" cy="140" r="3.5" />
            <circle cx="100" cy="760" r="3.5" />
            <circle cx="1700" cy="140" r="3.5" />
            <circle cx="1840" cy="140" r="3.5" />
            <circle cx="1820" cy="760" r="3.5" />
          </g>
        </svg>
      </div>

      {/* 3. Main Foreground Circuit Layer (Crisp Neon Cyan & Electric Blue) */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${mouse.x * -24}px, ${mouse.y * -14}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            {/* High-Intensity Glow Filter */}
            <filter id="neonCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="10" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="electricBlueGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emberGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for live pulse streams */}
            <linearGradient id="pulseCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#00ffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00FBF8" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="pulseBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#00bfff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ================= LEFT WING MAIN TRACES ================= */}
          {/* Main High Bus */}
          <g stroke="#00FBF8" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="miter" filter="url(#neonCyanGlow)">
            {/* Upper Highway */}
            <path d="M 720,380 L 560,380 L 440,250 L 260,250 L 100,250" />
            {/* Branch 1B fanning up */}
            <path d="M 440,250 L 350,150 L 140,150" strokeWidth="2.4" />
            {/* Parallel Upper Companion */}
            <path d="M 700,350 L 570,350 L 460,220 L 320,220 L 220,220" strokeWidth="2" stroke="#00b8a3" />

            {/* Mid-Upper Triple Bus (Iconic PCB Bus lines) */}
            <path d="M 740,460 L 580,460 L 470,580 L 280,580 L 130,580" strokeWidth="2.6" stroke="#00ffff" />
            <path d="M 750,490 L 600,490 L 490,610 L 340,610 L 260,530 L 60,530" strokeWidth="3" />
            <path d="M 760,520 L 620,520 L 510,640 L 380,640" strokeWidth="2.2" stroke="#00b8a3" />

            {/* Mid-Lower Vibrant Highway Bus */}
            <path d="M 730,580 L 540,580 L 410,710 L 180,710 L 40,710" strokeWidth="3.2" stroke="#00ffff" />
            <path d="M 410,710 L 310,810 L 110,810" strokeWidth="2.4" />
            {/* Floor feeder trace */}
            <path d="M 680,670 L 540,670 L 440,770 L 200,770" strokeWidth="2.2" stroke="#0088ff" />

            {/* Top Feeder Lines (framing emblem from top) */}
            <path d="M 680,30 L 680,180 L 620,240 L 620,330" strokeWidth="2.4" />
            <path d="M 520,30 L 520,170 L 420,270 L 240,270" strokeWidth="2.2" stroke="#0088ff" />
          </g>

          {/* ================= RIGHT WING MAIN TRACES ================= */}
          <g stroke="#00FBF8" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="miter" filter="url(#neonCyanGlow)">
            {/* Upper Highway */}
            <path d="M 1200,380 L 1360,380 L 1480,250 L 1660,250 L 1820,250" />
            {/* Branch 1B fanning up */}
            <path d="M 1480,250 L 1570,150 L 1780,150" strokeWidth="2.4" />
            {/* Parallel Upper Companion */}
            <path d="M 1220,350 L 1350,350 L 1460,220 L 1600,220 L 1700,220" strokeWidth="2" stroke="#00b8a3" />

            {/* Mid-Upper Highway Bus (Electric Blue & Cyan Dual Bus) */}
            <path d="M 1180,460 L 1340,460 L 1450,580 L 1640,580 L 1720,500 L 1860,500" strokeWidth="2.8" stroke="#00bfff" />
            <path d="M 1170,490 L 1320,490 L 1430,610 L 1580,610 L 1660,690 L 1840,690" strokeWidth="3" />

            {/* Mid-Lower Vibrant Highway Bus */}
            <path d="M 1190,580 L 1380,580 L 1510,710 L 1740,710 L 1880,710" strokeWidth="3.2" stroke="#00ffff" />
            <path d="M 1510,710 L 1610,810 L 1810,810" strokeWidth="2.4" />
            {/* Floor feeder trace */}
            <path d="M 1240,670 L 1380,670 L 1480,770 L 1720,770" strokeWidth="2.2" stroke="#0088ff" />

            {/* Top Feeder Lines (framing emblem from top) */}
            <path d="M 1240,30 L 1240,180 L 1300,240 L 1300,330" strokeWidth="2.4" />
            <path d="M 1400,30 L 1400,170 L 1500,270 L 1680,270" strokeWidth="2.2" stroke="#0088ff" />
          </g>

          {/* ================= ANIMATED PULSE WAVE CURRENTS ================= */}
          <g fill="none" strokeWidth="3.2" strokeLinecap="round" opacity="0.95">
            {/* Pulse 1: Left Upper Highway */}
            <path
              d="M 720,380 L 560,380 L 440,250 L 260,250 L 100,250"
              stroke="url(#pulseCyanGrad)"
              strokeDasharray="90 800"
              className="animate-pulse-track"
            />
            {/* Pulse 2: Left Mid-Lower */}
            <path
              d="M 730,580 L 540,580 L 410,710 L 180,710 L 40,710"
              stroke="url(#pulseCyanGrad)"
              strokeDasharray="110 950"
              style={{ animation: "circuitPulse 3.4s linear infinite" }}
            />
            {/* Pulse 3: Right Upper */}
            <path
              d="M 1200,380 L 1360,380 L 1480,250 L 1660,250 L 1820,250"
              stroke="url(#pulseCyanGrad)"
              strokeDasharray="90 800"
              style={{ animation: "circuitPulse 2.8s linear infinite 0.6s" }}
            />
            {/* Pulse 4: Right Electric Blue Bus */}
            <path
              d="M 1180,460 L 1340,460 L 1450,580 L 1640,580 L 1720,500 L 1860,500"
              stroke="url(#pulseBlueGrad)"
              strokeDasharray="100 850"
              style={{ animation: "circuitPulse 3.1s linear infinite 1.2s" }}
            />
          </g>

          {/* ================= VIA SOLDER PADS & TEST NODES ================= */}
          {/* Left Via Pads (Annular outer ring + glowing cyan inner pin) */}
          <g>
            {/* (100, 250) */}
            <circle cx="100" cy="250" r="9" stroke="#93c5fd" strokeWidth="2.5" fill="#041220" />
            <circle cx="100" cy="250" r="4.5" fill="#ffffff" filter="url(#neonCyanGlow)" />

            {/* (140, 150) */}
            <circle cx="140" cy="150" r="8" stroke="#93c5fd" strokeWidth="2" fill="#041220" />
            <circle cx="140" cy="150" r="4" fill="#00ffff" filter="url(#neonCyanGlow)" />

            {/* (60, 530) */}
            <circle cx="60" cy="530" r="10" stroke="#93c5fd" strokeWidth="2.5" fill="#041220" />
            <circle cx="60" cy="530" r="5" fill="#ffffff" filter="url(#neonCyanGlow)" />

            {/* (130, 580) */}
            <circle cx="130" cy="580" r="8" stroke="#93c5fd" strokeWidth="2" fill="#041220" />
            <circle cx="130" cy="580" r="4" fill="#00FBF8" filter="url(#neonCyanGlow)" />

            {/* (40, 710) - Prominent Terminal via */}
            <circle cx="40" cy="710" r="12" stroke="#93c5fd" strokeWidth="3" fill="#041220" />
            <circle cx="40" cy="710" r="6" fill="#ffffff" filter="url(#neonCyanGlow)" />

            {/* (110, 810) */}
            <circle cx="110" cy="810" r="8" stroke="#93c5fd" strokeWidth="2" fill="#041220" />
            <circle cx="110" cy="810" r="4" fill="#00ffff" filter="url(#neonCyanGlow)" />

            {/* Micro test vias at 45° corners */}
            <circle cx="440" cy="250" r="4" fill="#00FBF8" filter="url(#neonCyanGlow)" />
            <circle cx="470" cy="580" r="4" fill="#00ffff" filter="url(#neonCyanGlow)" />
            <circle cx="410" cy="710" r="4.5" fill="#ffffff" filter="url(#neonCyanGlow)" />
          </g>

          {/* Right Via Pads */}
          <g>
            {/* (1820, 250) */}
            <circle cx="1820" cy="250" r="9" stroke="#93c5fd" strokeWidth="2.5" fill="#041220" />
            <circle cx="1820" cy="250" r="4.5" fill="#ffffff" filter="url(#neonCyanGlow)" />

            {/* (1780, 150) */}
            <circle cx="1780" cy="150" r="8" stroke="#93c5fd" strokeWidth="2" fill="#041220" />
            <circle cx="1780" cy="150" r="4" fill="#00ffff" filter="url(#neonCyanGlow)" />

            {/* (1860, 500) */}
            <circle cx="1860" cy="500" r="9" stroke="#93c5fd" strokeWidth="2.5" fill="#041220" />
            <circle cx="1860" cy="500" r="4.5" fill="#00bfff" filter="url(#electricBlueGlow)" />

            {/* (1840, 690) */}
            <circle cx="1840" cy="690" r="9" stroke="#93c5fd" strokeWidth="2.5" fill="#041220" />
            <circle cx="1840" cy="690" r="4.5" fill="#00ffff" filter="url(#neonCyanGlow)" />

            {/* (1880, 710) - Prominent Terminal via */}
            <circle cx="1880" cy="710" r="12" stroke="#93c5fd" strokeWidth="3" fill="#041220" />
            <circle cx="1880" cy="710" r="6" fill="#ffffff" filter="url(#neonCyanGlow)" />

            {/* (1810, 810) */}
            <circle cx="1810" cy="810" r="8" stroke="#93c5fd" strokeWidth="2" fill="#041220" />
            <circle cx="1810" cy="810" r="4" fill="#00ffff" filter="url(#neonCyanGlow)" />

            {/* Micro test vias at 45° corners */}
            <circle cx="1480" cy="250" r="4" fill="#00FBF8" filter="url(#neonCyanGlow)" />
            <circle cx="1450" cy="580" r="4" fill="#00bfff" filter="url(#electricBlueGlow)" />
            <circle cx="1510" cy="710" r="4.5" fill="#ffffff" filter="url(#neonCyanGlow)" />
          </g>

          {/* SMD Chip Outlines & Pins */}
          <g fill="#07101c" stroke="#00FBF8" strokeWidth="1.2" opacity="0.85">
            {/* Left Chips */}
            <rect x="220" y="380" width="120" height="76" rx="3" />
            <rect x="70" y="630" width="100" height="60" rx="3" />

            {/* Right Chips */}
            <rect x="1580" y="380" width="120" height="76" rx="3" />
            <rect x="1750" y="630" width="100" height="60" rx="3" />
          </g>
          {/* Pins for SMD Chips */}
          <g stroke="#00FBF8" strokeWidth="2" opacity="0.9">
            {/* Left chip 1 pins */}
            <line x1="208" y1="395" x2="220" y2="395" />
            <line x1="208" y1="410" x2="220" y2="410" />
            <line x1="208" y1="425" x2="220" y2="425" />
            <line x1="208" y1="440" x2="220" y2="440" />
            <line x1="340" y1="395" x2="352" y2="395" />
            <line x1="340" y1="410" x2="352" y2="410" />
            <line x1="340" y1="425" x2="352" y2="425" />
            <line x1="340" y1="440" x2="352" y2="440" />

            {/* Right chip 1 pins */}
            <line x1="1568" y1="395" x2="1580" y2="395" />
            <line x1="1568" y1="410" x2="1580" y2="410" />
            <line x1="1568" y1="425" x2="1580" y2="425" />
            <line x1="1568" y1="440" x2="1580" y2="440" />
            <line x1="1700" y1="395" x2="1712" y2="395" />
            <line x1="1700" y1="410" x2="1712" y2="410" />
            <line x1="1700" y1="425" x2="1712" y2="425" />
            <line x1="1700" y1="440" x2="1712" y2="440" />
          </g>

          {/* ================= FLOOR GRID & DIGITAL MARKINGS ================= */}
          {/* Floor Horizon Line */}
          <line x1="0" y1="780" x2="1920" y2="780" stroke="#00FBF8" strokeWidth="1.2" opacity="0.35" />

          {/* Floor Perspective Circuit Tracks */}
          <g stroke="#00FBF8" strokeWidth="1.4" fill="none" opacity="0.4">
            {/* Left floor tracks */}
            <path d="M 420,780 L 360,860 L 220,860 L 140,940" />
            <path d="M 620,780 L 540,880 L 320,880 L 240,1020" />
            <path d="M 720,780 L 640,920 L 520,920" />

            {/* Right floor tracks */}
            <path d="M 1500,780 L 1560,860 L 1700,860 L 1780,940" />
            <path d="M 1300,780 L 1380,880 L 1600,880 L 1680,1020" />
            <path d="M 1200,780 L 1280,920 L 1400,920" />

            {/* Cross perspective grid rails */}
            <line x1="0" y1="840" x2="1920" y2="840" stroke="#003b5c" strokeWidth="1" />
            <line x1="0" y1="910" x2="1920" y2="910" stroke="#004870" strokeWidth="1.2" />
            <line x1="0" y1="990" x2="1920" y2="990" stroke="#003b5c" strokeWidth="1" />
          </g>

          {/* Glowing Digital Floor Numbers (Exact from Image 1: 15569 on Left, 0413 on Right) */}
          {/* Left Floor: 15569 */}
          <g transform="translate(480, 930)">
            <text
              x="0"
              y="0"
              fill="#00FBF8"
              filter="url(#neonCyanGlow)"
              className="font-mono text-2xl font-bold tracking-[0.32em] opacity-85"
            >
              15569
            </text>
          </g>

          {/* Right Floor: 0413 */}
          <g transform="translate(1380, 930)">
            <text
              x="0"
              y="0"
              fill="#00FBF8"
              filter="url(#neonCyanGlow)"
              className="font-mono text-2xl font-bold tracking-[0.32em] opacity-85"
            >
              0413
            </text>
          </g>

          {/* Ember glowing pinpoints along floor horizon (Exact from Image 1) */}
          <g filter="url(#emberGlow)">
            <circle cx="340" cy="780" r="3.5" fill="#ffaa22" />
            <circle cx="560" cy="780" r="4" fill="#ffbb33" />
            <circle cx="1360" cy="780" r="4" fill="#ffbb33" />
            <circle cx="1580" cy="780" r="3.5" fill="#ffaa22" />
            <circle cx="210" cy="800" r="3" fill="#00ffff" />
            <circle cx="1710" cy="800" r="3" fill="#00ffff" />
          </g>
        </svg>
      </div>

      {/* 4. Bottom Vignette & Seamless Floor Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-void via-void/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void via-void/50 to-transparent" />

      {/* CSS Animation for Signal Pulses */}
      <style>{`
        @keyframes circuitPulse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -900; }
        }
        .animate-pulse-track {
          animation: circuitPulse 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
