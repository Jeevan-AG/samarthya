/**
 * Procedural Web Audio Engine for SAMARTHYA Admin CMS
 *
 * Synthesizes tactical clicks, hover tones, error hums, and success chimes
 * using standard browser Web Audio API. Zero external audio downloads.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samarthya_admin_audio');
        if (saved !== null) {
          this.muted = saved === 'false';
        }
      }
    } catch {
      this.muted = false;
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samarthya_admin_audio', (!this.muted).toString());
      }
    } catch {
      // Ignore
    }
    if (!this.muted) {
      this.playSuccess();
    }
    return this.muted;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samarthya_admin_audio', (!this.muted).toString());
      }
    } catch {
      // Ignore
    }
  }

  public playHover() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.02);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Ignore
    }
  }

  public playSuccess() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (Cyberpunk major 7th feel)
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.025, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.14);
      });
    } catch {
      // Ignore
    }
  }

  public playError() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.09);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEngine();
