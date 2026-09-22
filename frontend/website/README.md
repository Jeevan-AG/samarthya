# SAMARTHYA website2

Astro + React (TSX) + Tailwind CSS + Lenis homepage for the ECE technical club.

Interactive hero loads the Blender-exported emblem from `samarthya_blender/models/samarthya_logo.glb`.

## Develop

```bash
cd frontend/website2
npm install
npm run dev
```

Open http://localhost:4321

## Notes

- Keep large Blender sources in `samarthya_blender/`. Only the GLB, logo, group photo, and hero poster are copied into `public/`.
- Prefer reduced-motion: Lenis and the 3D tilt idle are skipped; WebGL failure falls back to the poster still.
