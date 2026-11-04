// Web Audio API Generative Soundscape for THE RED ROOM
// Zero external assets required — entirely synthesized in real time.

class BotanicalSoundscape {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;

  // Pentatonic notes for crystal chimes (F minor / Db major scale: F4, Ab4, Bb4, C5, Db5, Eb5, F5)
  private chimeFrequencies = [349.23, 415.30, 466.16, 523.25, 554.37, 622.25, 698.46, 830.61];

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.setupDrone();
  }

  private setupDrone() {
    if (!this.ctx || !this.ambientGain) return;

    // Filter for warm, dark velvety texture
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.filter.connect(this.ambientGain);

    // Warm sub drone (F2 = 87.31 Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(87.31, this.ctx.currentTime);

    // Subtle 5th overtone (C3 = 130.81 Hz) with slight detune
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(130.81, this.ctx.currentTime);
    this.droneOsc2.detune.setValueAtTime(3.5, this.ctx.currentTime);

    // Slow breathing LFO to gently modulate filter frequency
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec breath cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);

    this.droneOsc1.connect(this.filter);
    this.droneOsc2.connect(this.filter);

    this.droneOsc1.start();
    this.droneOsc2.start();
    this.lfo.start();
  }

  public async toggleSound(): Promise<boolean> {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    const targetGain = this.isMuted ? 0 : 0.85;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 1.2);

    if (!this.isMuted) {
      // Play a soft welcome chime when enabled
      this.playBloomChime();
    }

    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play a delicate, crystalline celestial note (bell/glass harp tone)
  public playRoseChime(index = 0) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const freq = this.chimeFrequencies[index % this.chimeFrequencies.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle harmonic sparkle
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 3.0);
      osc2.stop(now + 2.0);
    } catch {
      // Audio fallback
    }
  }

  // Harmonic chord played during scene transitions / bloom
  public playBloomChime() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      [0, 2, 4, 6].forEach((noteIdx, i) => {
        setTimeout(() => {
          this.playRoseChime(noteIdx);
        }, i * 160);
      });
    } catch {
      // Fallback
    }
  }

  // Soft whisper / wind chime when petals fly
  public playPetalBreeze() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for gentle velvet wind
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(300, now + 1.5);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 1.6);
    } catch {
      // Fallback
    }
  }
}

export const soundscape = new BotanicalSoundscape();
