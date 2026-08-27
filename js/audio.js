const Audio = {
    ctx: null,
    enabled: true,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    },

    play(type) {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        try {
            switch (type) {
                case "click": this._beep(600, 0.05, "square", 0.1); break;
                case "success": this._chirp([523, 659, 784], 0.08); break;
                case "error": this._beep(200, 0.15, "sawtooth", 0.1); break;
                case "notification": this._chirp([880, 1100], 0.06); break;
                case "correct": this._chirp([523, 659, 784, 1047], 0.06); break;
                case "wrong": this._beep(180, 0.2, "sawtooth", 0.08); break;
                case "offer": this._fanfare(); break;
                case "gameover": this._descending(); break;
                case "dayEnd": this._beep(440, 0.1, "sine", 0.15); break;
                case "burnout": this._beep(150, 0.3, "sawtooth", 0.06); break;
            }
        } catch (e) {}
    },

    _beep(freq, duration, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || "sine";
        osc.frequency.value = freq;
        gain.gain.value = vol || 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    _chirp(freqs, dur) {
        freqs.forEach((f, i) => {
            setTimeout(() => this._beep(f, dur, "sine", 0.08), i * 80);
        });
    },

    _fanfare() {
        const notes = [523, 659, 784, 1047, 784, 1047];
        notes.forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.12, "sine", 0.1), i * 100);
        });
    },

    _descending() {
        const notes = [440, 392, 349, 330, 294, 262];
        notes.forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.15, "sine", 0.08), i * 120);
        });
    }
};
