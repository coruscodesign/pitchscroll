import PitchEffect from 'pitch';
import SmoothScrollbar from 'smooth-scrollbar';
import SoftScrollPlugin from 'vendor/smooth-scrollbar/SoftScrollPlugin';
import "intersection-observer"; // if we want support IE11

// Soft edges plugin for SmoothScroll
SmoothScrollbar.use(SoftScrollPlugin);

// Init smooth scrollbar
const view = document.getElementById('main');
const scrollbar = SmoothScrollbar.init(view, {
    renderByPixels: false,
    damping: 0.075
});

// Init Pitch and provide smooth scrollbar offset
const pitch = new PitchEffect({
    scrollPos: () => scrollbar.offset.y
});

// Optional demo: pause when scroll via scrollbar track
scrollbar.track.yAxis.element.addEventListener('mousedown', () => {
    pitch.pause(true);
});

document.documentElement.addEventListener('mouseup', () => {
    pitch.pause(false);
}, true);