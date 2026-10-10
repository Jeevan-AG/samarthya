import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SamarthyaLogoShowcaseProps {
  className?: string;
}

export const SamarthyaLogoShowcase: React.FC<SamarthyaLogoShowcaseProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = container.clientWidth || 550;
    let height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const cameraTarget = new THREE.Vector3(0, 3.63, 0);
    const cameraDistance = 8.6;
    const camera = new THREE.PerspectiveCamera(
      32,
      Math.max(width / Math.max(height, 1), 0.1),
      0.1,
      100
    );

    const frameCamera = (w: number, h: number) => {
      const aspect = Math.max(w / Math.max(h, 1), 0.1);
      camera.aspect = aspect;
      const targetWidth = 4.4;
      const targetHeight = 3.6;
      const fovFromWidth =
        2 * Math.atan(targetWidth / (2 * cameraDistance * aspect)) * (180 / Math.PI);
      const fovFromHeight =
        2 * Math.atan(targetHeight / (2 * cameraDistance)) * (180 / Math.PI);
      camera.fov = Math.max(fovFromWidth, fovFromHeight);
      camera.position.set(0, cameraTarget.y, cameraDistance);
      camera.lookAt(cameraTarget);
      camera.updateProjectionMatrix();
    };

    frameCamera(width, height);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setHasWebGL(false);
      return;
    }

    const cyanColor = new THREE.Color('#00FBF8');
    const whiteColor = new THREE.Color('#FBFBFB');
    const silverColor = new THREE.Color('#D4D4D4');
    const cyanBaseColor = new THREE.Color('#00F9F7');
    const blackColor = new THREE.Color('#000101');

    const blackDiscMaterial = new THREE.MeshBasicMaterial({ color: blackColor });
    const chromeMaterial = new THREE.MeshBasicMaterial({ color: whiteColor });
    const silverMaterial = new THREE.MeshBasicMaterial({ color: silverColor });
    const cyanBulbMaterial = new THREE.MeshBasicMaterial({ color: cyanColor });
    const cyanBaseMaterial = new THREE.MeshBasicMaterial({ color: cyanBaseColor });

    const textCyanMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#000000'),
      emissive: cyanColor,
      emissiveIntensity: 1.0,
      roughness: 0.35,
      metalness: 0.0,
    });

    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, 3.63, 0);
    scene.add(modelGroup);

    let loadedScene: THREE.Group | null = null;
    const loader = new GLTFLoader();
    loader.load(
      '/models/samarthya_logo.glb',
      (gltf) => {
        loadedScene = gltf.scene;
        gltf.scene.position.set(0.18, -3.63, 0);

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = (mesh.name + ' ' + (mesh.parent?.name || '')).toLowerCase();
            const matName = (
              Array.isArray(mesh.material)
                ? mesh.material[0]?.name
                : mesh.material?.name || ''
            ).toLowerCase();

            if (
              name.includes('blackdisc') ||
              matName.includes('blackdisc') ||
              name.includes('cylinder.030')
            ) {
              mesh.material = blackDiscMaterial;
            } else if (
              name.includes('chromeinner') ||
              matName.includes('chrome') ||
              name.includes('curve.008')
            ) {
              mesh.material = chromeMaterial;
            } else if (
              name.includes('barsilver') ||
              matName.includes('silver') ||
              name.includes('curve.009')
            ) {
              mesh.material = silverMaterial;
            } else if (name.includes('barcyan') || name.includes('curve.010')) {
              mesh.material = cyanBaseMaterial;
            } else if (name.includes('samarthyatext') || matName.includes('textcyan')) {
              mesh.material = textCyanMaterial;
            } else if (
              name.includes('cyanbody') ||
              name.includes('accent') ||
              matName.includes('logocyan') ||
              name.includes('curve.007') ||
              name.includes('curve.011')
            ) {
              mesh.material = cyanBulbMaterial;
            }
          }
        });

        modelGroup.add(gltf.scene);
        setReady(true);
      },
      undefined,
      (err) => {
        console.error('Failed to load 3D logo model:', err);
        setHasWebGL(false);
      }
    );

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onMove = (e: MouseEvent) => {
      if (reduced) return;
      const rect = container.getBoundingClientRect();
      targetMouseX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      targetMouseY = Math.max(-1, Math.min(1, -(((e.clientY - rect.top) / rect.height) * 2 - 1)));
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || 550;
      height = container.clientHeight || 550;
      frameCamera(width, height);
      renderer.setSize(width, height, false);
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

    const clock = new THREE.Clock();
    let animId = 0;
    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (!visible || document.hidden || !renderer) return;
      const t = clock.getElapsedTime();

      if (!reduced) {
        currentRotY += (targetMouseX * 0.26 - currentRotY) * 0.06;
        currentRotX += (-targetMouseY * 0.16 - currentRotX) * 0.06;

        modelGroup.rotation.set(currentRotX, currentRotY, 0);
        modelGroup.position.y = 3.63 + Math.sin(t * 1.1) * 0.04;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      resizeObserver.disconnect();
      io.disconnect();
      loadedScene?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).geometry?.dispose();
      });
      cyanBulbMaterial.dispose();
      cyanBaseMaterial.dispose();
      textCyanMaterial.dispose();
      chromeMaterial.dispose();
      silverMaterial.dispose();
      blackDiscMaterial.dispose();
      renderer?.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
        <img
          src="/logo.svg"
          alt="SAMARTHYA"
          className="h-64 w-64 object-contain drop-shadow-[0_0_40px_rgba(0,229,224,0.6)]"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full items-center justify-center overflow-visible select-none ${className}`}
      style={{ minHeight: '520px' }}
    >
      {/* Central Ambient Cyan Glow Backdrop */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] sm:h-[540px] sm:w-[540px] rounded-full bg-[#00FBF8]/15 blur-[120px] animate-pulse" />
      </div>

      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D SAMARTHYA emblem and text"
        role="img"
        className={`relative z-10 block h-full w-full max-h-[660px] cursor-grab active:cursor-grabbing transition-opacity duration-700 ease-out ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default SamarthyaLogoShowcase;
