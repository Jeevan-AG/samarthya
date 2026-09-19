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

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking for 3D depth parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Generate depth-aware cyber particles
    const particleCount = 45;
    const particles: Particle[] = [];

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

      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 10 + Math.random() * 20,
        z,
        // Larger size in foreground, tiny pinpoint in background
        radius: (0.8 + z * 1.6),
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

      ctx.clearRect(0, 0, width, height);

      // Render each particle with depth parallax
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift upward with horizontal sway
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.swayFreq + p.phase) * (p.swayAmp * 0.25);
        p.phase += p.pulseSpeed;

        // Pulsate alpha gently
        p.alpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(p.phase));

        // Depth parallax shift: nearer particles shift more with cursor
        const parallaxX = currentMouseX * p.z * 32;
        const parallaxY = currentMouseY * p.z * 22;

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        // Reset if drifted above the screen
        if (p.y < -20) {
          particles[i] = createParticle(false);
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
          glowGrad.addColorStop(0, `${p.glowColor} ${p.alpha * 0.55})`);
          glowGrad.addColorStop(0.5, `${p.glowColor} ${p.alpha * 0.18})`);
          glowGrad.addColorStop(1, `${p.glowColor} 0)`);

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius * (2.8 + p.z * 2.2), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle core
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra bright specular center for closest embers
        if (p.z > 0.8) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
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
