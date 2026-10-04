/**
 * Image Fallback Utility for SAMARTHYA
 *
 * Provides a resilient onError handler for <img> elements.
 * Automatically tries .webp <-> .jpeg/.png, or hides broken image gracefully.
 */

const FALLBACK_MAP: Record<string, string[]> = {
  '.jpg': ['.webp', '.jpeg'],
  '.jpeg': ['.webp', '.jpg'],
  '.png': ['.webp', '.jpg'],
  '.webp': ['.jpeg', '.jpg', '.png'],
};

function getExtension(src: string): string {
  const pathPart = src.split('?')[0];
  const dotIndex = pathPart.lastIndexOf('.');
  return dotIndex !== -1 ? pathPart.slice(dotIndex).toLowerCase() : '';
}

function replaceExtension(src: string, oldExt: string, newExt: string): string {
  const idx = src.lastIndexOf(oldExt);
  if (idx === -1) return src;
  return src.slice(0, idx) + newExt + src.slice(idx + oldExt.length);
}

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>
): void {
  const img = event.currentTarget;
  const currentSrc = img.src;

  const attempted = img.dataset.fallbackAttempted || '';
  const attemptedSet = new Set(attempted.split(',').filter(Boolean));

  const ext = getExtension(currentSrc);
  const fallbacks = FALLBACK_MAP[ext] || [];

  for (const fallbackExt of fallbacks) {
    const candidateSrc = replaceExtension(currentSrc, ext, fallbackExt);
    if (!attemptedSet.has(candidateSrc)) {
      attemptedSet.add(candidateSrc);
      img.dataset.fallbackAttempted = Array.from(attemptedSet).join(',');
      img.src = candidateSrc;
      return;
    }
  }

  // Fallback to placeholder or hidden
  img.style.opacity = '0.3';
}
