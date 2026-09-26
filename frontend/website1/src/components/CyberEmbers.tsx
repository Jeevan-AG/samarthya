"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number; // Depth factor: 0.1 (far) to 1.0 (near)
  radius: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
  pulseSpeed: number;
  color: string;
  glowColor: string;
}

export default function CyberEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking for 3D depth parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Helper to calculate 3D logo geometry in screen space (matches 1920x1080 source, permanent object-cover)
    const getLogoGeometry = (w: number, h: number, mx: number, my: number) => {
      const videoAspect = 1920 / 1080;
      const canvasAspect = w / h;

      let scale: number;
      let offsetX: number;
      let offsetY: number;

      // Permanent object-cover: seamlessly fills viewport at any resolution or zoom
      if (canvasAspect > videoAspect) {
        scale = w / 1920;
        offsetX = 0;
        offsetY = (h - 1080 * scale) / 2;
      } else {
        scale = h / 1080;
        offsetX = (w - 1920 * scale) / 2;
        offsetY = 0;
      }

      // Parallax shifts match Hero.tsx (normX * 10, normY * 6)
      const parallaxLogoX = mx * 10;
      const parallaxLogoY = my * 6;

      const centerX = offsetX + 960 * scale + parallaxLogoX;

      return {
        scale,
        bulb: {
          x: centerX,
          y: offsetY + 390 * scale + parallaxLogoY,
          radius: 250 * scale,
        },
        neck: {
          x: centerX,
          y: offsetY + 595 * scale + parallaxLogoY,
          halfW: 110 * scale,
          halfH: 55 * scale,
        },
        text: {
          x: centerX,
          y: offsetY + 700 * scale + parallaxLogoY,
          halfW: 490 * scale,
          halfH: 90 * scale,
        },
      };
    };

    // Calculate signed visibility factor: 0 = fully behind logo (occluded), 1 = fully clear
    const getVisibilityFactor = (
      x: number,
      y: number,
      geom: ReturnType<typeof getLogoGeometry>
    ): number => {
      const feather = 35 * geom.scale;

      // 1. Bulb circle signed distance
      const distBulb = Math.hypot(x - geom.bulb.x, y - geom.bulb.y) - geom.bulb.radius;

      // 2. Neck box signed distance
      const dxNeck = Math.abs(x - geom.neck.x);
      const dyNeck = Math.abs(y - geom.neck.y);
      const distNeck =
        dxNeck <= geom.neck.halfW && dyNeck <= geom.neck.halfH
          ? -Math.min(geom.neck.halfW - dxNeck, geom.neck.halfH - dyNeck)
          : Math.hypot(
              Math.max(0, dxNeck - geom.neck.halfW),
              Math.max(0, dyNeck - geom.neck.halfH)
            );

      // 3. Text box signed distance
      const dxText = Math.abs(x - geom.text.x);
      const dyText = Math.abs(y - geom.text.y);
      const distText =
        dxText <= geom.text.halfW && dyText <= geom.text.halfH
          ? -Math.min(geom.text.halfW - dxText, geom.text.halfH - dyText)
          : Math.hypot(
              Math.max(0, dxText - geom.text.halfW),
              Math.max(0, dyText - geom.text.halfH)
            );

      // Closest distance to any logo component (negative = inside, positive = outside)
      const minDist = Math.min(distBulb, distNeck, distText);

      if (minDist <= 0) return 0; // Behind the logo
      if (minDist >= feather) return 1; // Clear of the logo

      // Smooth hermite fade at boundary edges
      const t = minDist / feather;
      return t * t * (3 - 2 * t);
    };

    // Generate depth-aware cyber particles
    const particleCount = 45;
    const particles: Particle[] = [];

    const initialGeom = getLogoGeometry(width, height, 0, 0);

    const createParticle = (randomY = true): Particle => {
      // z: 0.15 (deep/far background) to 1.0 (close foreground)
      const z = 0.15 + Math.random() * 0.85;

      // 88% signature cyan / teal embers, 12% amber sparks matching the floor
      const isAmber = Math.random() < 0.12;

      let color = "rgba(0, 229, 204,";
      let glowColor = "rgba(0, 229, 204,";
      if (isAmber) {
        color = "rgba(245, 158, 11,";
        glowColor = "rgba(251, 191, 36,";
      } else if (z > 0.75) {
        color = "rgba(103, 232, 249,"; // Bright electric cyan for foreground
        glowColor = "rgba(0, 229, 204,";
      }

      let spawnX = Math.random() * width;
      let spawnY = randomY ? Math.random() * height : height + 10 + Math.random() * 20;

      // Avoid spawning directly inside the logo footprint on initial frame
      if (randomY && initialGeom) {
        let attempts = 0;
        while (attempts < 6 && getVisibilityFactor(spawnX, spawnY, initialGeom) < 0.1) {
          spawnX = Math.random() * width;
          spawnY = Math.random() * height;
          attempts++;
        }
      }

      return {
        x: spawnX,
        y: spawnY,
        z,
        // Larger size in foreground, tiny pinpoint in background
        radius: 0.8 + z * 1.6,
        baseAlpha: 0.25 + z * 0.65,
        alpha: 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        // Foreground particles drift faster
        vy: -(0.25 + z * 0.55),
        swayFreq: 0.8 + Math.random() * 1.5,
        swayAmp: 0.4 + z * 1.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color,
        glowColor,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Pointer move listener
    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetMouseX = Math.max(-1, Math.min(1, nx));
      targetMouseY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Visibility observer to pause RAF when off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    // Animation loop
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);

      if (!isVisible || document.hidden) return;

      time += 0.016;

      // Smooth mouse interpolation (spring lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Current logo geometry with real-time parallax alignment
      const geom = getLogoGeometry(width, height, currentMouseX, currentMouseY);

      ctx.clearRect(0, 0, width, height);

      // Render each particle with deflection and behind-logo occlusion
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Aerodynamic Deflection Streamlines around the logo
        // Deflect around text box approaching from below
        const distToTextBottom = geom.text.y + geom.text.halfH - p.y;
        if (distToTextBottom >= -30 * geom.scale && distToTextBottom < 160 * geom.scale) {
          const dx = p.x - geom.text.x;
          const span = geom.text.halfW * 1.18;
          if (Math.abs(dx) < span) {
            const dir = dx >= 0 ? 1 : -1;
            const proximity = 1 - Math.abs(dx) / span;
            p.vx += dir * proximity * 0.07;
          }
        }

        // Deflect radially around the circular bulb
        const distToBulb = Math.hypot(p.x - geom.bulb.x, p.y - geom.bulb.y);
        const bulbAvoidRadius = geom.bulb.radius * 1.32;
        if (distToBulb < bulbAvoidRadius && distToBulb > 10) {
          const ndx = (p.x - geom.bulb.x) / distToBulb;
          const proximity = 1 - distToBulb / bulbAvoidRadius;
          p.vx += (ndx || (Math.random() > 0.5 ? 1 : -1)) * proximity * 0.09;
        }

        // Velocity damping to maintain graceful, buoyant motion
        p.vx = Math.max(-1.1, Math.min(1.1, p.vx * 0.98));

        // Drift upward with horizontal sway
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.swayFreq + p.phase) * (p.swayAmp * 0.25);
        p.phase += p.pulseSpeed;

        // Reset if drifted above the screen
        if (p.y < -20) {
          particles[i] = createParticle(false);
          continue;
        }

        // Pulsate base alpha gently
        const pulsatingAlpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(p.phase));

        // Depth parallax shift: nearer particles shift more with cursor
        const parallaxX = currentMouseX * p.z * 32;
        const parallaxY = currentMouseY * p.z * 22;

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        // 2. Behind-Logo Occlusion Mask
        // Computes visibility so embers pass BEHIND the 3D logo and never over it
        const visibility = getVisibilityFactor(drawX, drawY, geom);
        const effectiveAlpha = pulsatingAlpha * visibility;

        // If completely occluded behind the logo, skip drawing
        if (effectiveAlpha <= 0.005) {
          continue;
        }

        // Draw soft glow halo for foreground/midground embers
        if (p.z > 0.4) {
          const glowGrad = ctx.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            p.radius * (2.8 + p.z * 2.2)
          );
          glowGrad.addColorStop(0, `${p.glowColor} ${effectiveAlpha * 0.55})`);
          glowGrad.addColorStop(0.5, `${p.glowColor} ${effectiveAlpha * 0.18})`);
          glowGrad.addColorStop(1, `${p.glowColor} 0)`);

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius * (2.8 + p.z * 2.2), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle core
        ctx.fillStyle = `${p.color} ${effectiveAlpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra bright specular center for closest embers
        if (p.z > 0.8) {
          ctx.fillStyle = `rgba(255, 255, 255, ${effectiveAlpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none"
    />
  );
}
