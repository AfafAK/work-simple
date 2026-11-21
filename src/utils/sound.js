// Vintage 8-bit sound effects using Web Audio API

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type, isMuted) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case "click": {
        // High pitch, extremely short tick/click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case "receive": {
        // Classic dual-tone retro terminal chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "square";
        osc2.type = "square";

        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.setValueAtTime(1046.5, now + 0.1); // C6

        osc2.frequency.setValueAtTime(440, now); // A4
        osc2.frequency.setValueAtTime(523.25, now + 0.1); // C5

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
        break;
      }
      case "victory": {
        // Upward 8-bit arpeggio fanfare (C major triad: C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.08 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
        break;
      }
      case "boot": {
        // Slow rising mainframe hum, then dual chirps
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.4);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);

        // Chirps
        setTimeout(() => {
          if (isMuted) return;
          const oscChirp = ctx.createOscillator();
          const gainChirp = ctx.createGain();
          oscChirp.type = "square";
          oscChirp.frequency.setValueAtTime(1200, ctx.currentTime);
          oscChirp.frequency.setValueAtTime(1500, ctx.currentTime + 0.06);

          gainChirp.gain.setValueAtTime(0.03, ctx.currentTime);
          gainChirp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

          oscChirp.connect(gainChirp);
          gainChirp.connect(ctx.destination);
          oscChirp.start(ctx.currentTime);
          oscChirp.stop(ctx.currentTime + 0.12);
        }, 450);
        break;
      }
      case "error": {
        // Low grinding sawtooth alarm buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.3);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.warn("Web Audio API not allowed or failed to initialize", e);
  }
}
