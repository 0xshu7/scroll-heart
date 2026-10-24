const scene = document.querySelector('.scene');
const stage = document.querySelector('.stage');
const COUNT = 40;
const pieces = [];

const rand = (min, max) => min + Math.random() * (max - min);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => 1 - (1 - t) ** 3;

for (let i = 0; i < COUNT; i++) {
    const t = (i / COUNT) * Math.PI * 2;
    const hx = 16 * Math.sin(t) ** 3;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const el = document.createElement('div')
    el.className = 'piece';
    el.style.background = `hsl(${i * 9}, 80%, 60%)`;
    stage.appendChild(el);

    pieces.push({
        el,
        start: { x: rand(-500, 500), y: rand(-350, 350), r: rand(-360, 360) },
        target: { x: hx * 10, y: hy * 10, r: 0 },
        end: { x: rand(-700, 700), y: rand(-500, 500), r: rand(-360, 360) },
    });
}

function update() {
    const total = scene.offsetHeight - window.innerHeight;
    const p = clamp(-scene.getBoundingClientRect().top / total);

    const gather = ease(clamp(p / 0.45));
    const scatter = ease(clamp((p - 0.6) / 0.4));

    pieces.forEach(({ el, start, target, end }) => {
        const from = scatter > 0 ? target : start;
        const to = scatter > 0 ? end : target;
        const k = scatter > 0 ? scatter : gather;
        const x = lerp(from.x, to.x, k);
        const y = lerp(from.y, to.y, k);
        const r = lerp(from.r, to.r, k);
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
        el.style.opacity = 1 - scatter;
    });
}

window.addEventListener('scroll', update);
update();

