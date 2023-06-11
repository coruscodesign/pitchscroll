import gsap from "gsap";

export default class PitchEffect {
  constructor(options) {
    this.pitches = [];
    this.els = document.querySelectorAll('[data-pitch]');

    // Iterate over each element with a 'data-pitch' attribute
    for (let i = 0; i < this.els.length; i++) {
      const el = this.els[i];
      // Merge the provided options with the element's dataset options
      const opts = Object.assign({}, options, el.dataset.Pitch ? JSON.parse(el.dataset.Pitch) : {});
      const pitch = new Pitch(el, opts);
      this.pitches.push(pitch);
    }
  }

  pause(state) {
    // Pause or resume all the pitch instances
    for (let i = 0; i < this.pitches.length; i++) {
      this.pitches[i].pause(state);
    }
  }

  destroy() {
    // Destroy all the pitch instances
    for (let i = 0; i < this.pitches.length; i++) {
      this.pitches[i].destroy();
    }
  }
}

export class Pitch {
  constructor(el, options) {
    this.el = el;
    this.paused = false;
    // Merge the provided options with the default options
    this.options = Object.assign(
      {},
      {
        intensity: 0.15,
        speed: 0.6,
        min: -5,
        max: 5,
        scrollPos: () => window.pageYOffset
      },
      options
    );
    this.init();
  }

  getScrollPos() {
    return this.options.scrollPos();
  }

  pause(state = true) {
    this.paused = state;
  }

  init() {
    // Observe the element's intersection with the viewport
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    });
    this.observer.observe(this.el);
  }

  startLoop() {
    this.y = this.getScrollPos();
    this.loop();
  }

  stopLoop() {
    // Stop the animation loop and reset the skew if not paused
    cancelAnimationFrame(this.frame);
    if (!this.paused) {
      gsap.set(this.el, { skewY: 0 });
    }
  }

  loop() {
    const y = this.getScrollPos();
    const diff = y - this.y;
    const skew = Math.min(Math.max(this.options.min, diff * this.options.intensity), this.options.max);

    if (!this.paused) {
      // Apply the skew transformation if not paused
      gsap.set(this.el, { skewY: skew, force3D: true });
      this.animationPaused = false;
    } else {
      if (!this.animationPaused) {
        // Animate back to zero skew if paused
        gsap.to(this.el, { skewY: 0, force3D: true, duration: this.options.speed });
        this.animationPaused = true;
      }
    }

    this.y = y;
    this.frame = requestAnimationFrame(this.loop.bind(this));
  }

  destroy() {
    // Disconnect the observer, unpause, and stop the loop
    this.observer.disconnect();
    this.pause(false);
    this.stopLoop();
  }
}