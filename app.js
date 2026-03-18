/* ─────────────────────────────────────────────────────────
   Bar Clock — app.js
   ───────────────────────────────────────────────────────── */

// ── 5×7 pixel-font glyphs ──────────────────────────────
const GLYPHS = {
    '0': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '1': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0]
    ],
    '2': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]
    ],
    '3': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '4': [
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0]
    ],
    '5': [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '6': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '7': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
    ],
    '8': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    '9': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
    ],
    ':': [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    '/': [
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0]
    ],
    ' ': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
};

// ── Helpers ────────────────────────────────────────────
function pad2(n) {
    return String(n).padStart(2, '0');
}

function getTimeStr() {
    const n = new Date();
    return `${pad2(n.getHours())}:${pad2(n.getMinutes())}:${pad2(n.getSeconds())}`;
}

function getDateStr() {
    const n = new Date();
    return `${pad2(n.getDate())}/${pad2(n.getMonth()+1)}/${n.getFullYear()}`;
}

function strToPixels(str) {
    const px = [];
    let off = 0;
    for (const ch of str) {
        const g = GLYPHS[ch] || GLYPHS[' '];
        for (let r = 0; r < 7; r++)
            for (let c = 0; c < 5; c++)
                if (g[r][c]) px.push({
                    col: off + c,
                    row: r
                });
        off += 6;
    }
    return px;
}

function buildBars(str, W, H) {
    const px = strToPixels(str);
    if (!px.length) return [];
    const maxCol = Math.max(...px.map(p => p.col)) + 1;
    const cellW = W / (maxCol + 2);
    const cellH = H / 9;

    const cols = {};
    for (const p of px)(cols[p.col] ??= []).push(p.row);

    const bars = [];
    for (const [cStr, rows] of Object.entries(cols)) {
        const col = +cStr;
        const x = (col + 1) * cellW + cellW / 2;
        const bw = Math.max(2, cellW * 0.45);
        const sorted = [...rows].sort((a, b) => a - b);
        let run = [sorted[0]];
        for (let i = 1; i <= sorted.length; i++) {
            if (i < sorted.length && sorted[i] === sorted[i - 1] + 1) {
                run.push(sorted[i]);
                continue;
            }
            const top = (run[0] + 1) * cellH,
                bot = (run[run.length - 1] + 2) * cellH;
            const h = bot - top;
            bars.push({
                x,
                y: top + h / 2,
                h,
                w: bw
            });
            run = i < sorted.length ? [sorted[i]] : [];
        }
    }
    return bars;
}

// ── Interpolation ──────────────────────────────────────
function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function interpBars(from, to, t) {
    const e = ease(Math.min(1, Math.max(0, t)));
    const used = new Set();
    const out = [];

    for (const fb of from) {
        let best = -1,
            bestD = Infinity;
        for (let i = 0; i < to.length; i++) {
            if (used.has(i)) continue;
            const d = Math.abs(fb.x - to[i].x) + Math.abs(fb.y - to[i].y);
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        }
        if (best >= 0 && bestD < 600) {
            used.add(best);
            const tb = to[best];
            out.push({
                x: fb.x + (tb.x - fb.x) * e,
                y: fb.y + (tb.y - fb.y) * e,
                h: fb.h + (tb.h - fb.h) * e,
                w: fb.w + (tb.w - fb.w) * e,
            });
        } else {
            out.push({
                x: fb.x,
                y: fb.y,
                h: fb.h * (1 - e),
                w: fb.w
            });
        }
    }
    for (let i = 0; i < to.length; i++) {
        if (!used.has(i)) out.push({
            x: to[i].x,
            y: to[i].y,
            h: to[i].h * e,
            w: to[i].w
        });
    }
    return out;
}

// ── Canvas setup ───────────────────────────────────────
const canvas = document.getElementById('clock-canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => {
    resize();
    forceRebuild();
});

// ── State ──────────────────────────────────────────────
const TRANSITION_MS = 900;
const TIME_SHOW_MS = 10000;
const DATE_SHOW_MS = 5000;

const st = {
    bars: [],
    from: [],
    target: [],
    transitioning: false,
    transStart: 0,
    mode: 'time', // 'time' | 'date'
    lastStr: '',
};

function startTransition(toStr) {
    st.from = st.bars.map(b => ({
        ...b
    }));
    st.target = buildBars(toStr, canvas.width, canvas.height);
    st.transitioning = true;
    st.transStart = performance.now();
    st.lastStr = toStr;
}

function forceRebuild() {
    const s = st.mode === 'time' ? getTimeStr() : getDateStr();
    st.bars = buildBars(s, canvas.width, canvas.height);
    st.target = st.bars.map(b => ({
        ...b
    }));
    st.from = st.bars.map(b => ({
        ...b
    }));
    st.transitioning = false;
    st.lastStr = s;
}

// Init
const initStr = getTimeStr();
st.target = buildBars(initStr, canvas.width, canvas.height);
st.from = st.target.map(b => ({
    ...b,
    h: 0
}));
st.bars = st.from.map(b => ({
    ...b
}));
st.lastStr = initStr;
st.transitioning = true;
st.transStart = performance.now();

// ── Scheduling ─────────────────────────────────────────
let phaseTimeout = null;

function scheduleNext() {
    clearTimeout(phaseTimeout);
    if (st.mode === 'time') {
        phaseTimeout = setTimeout(() => {
            st.mode = 'date';
            updateHUD();
            startTransition(getDateStr());
            phaseTimeout = setTimeout(() => {
                st.mode = 'time';
                updateHUD();
                startTransition(getTimeStr());
                scheduleNext();
            }, DATE_SHOW_MS + TRANSITION_MS);
        }, TIME_SHOW_MS);
    }
}
scheduleNext();

// Live clock tick (only in time mode, after transition settles)
setInterval(() => {
    if (st.mode === 'time' && !st.transitioning) {
        const s = getTimeStr();
        if (s !== st.lastStr) startTransition(s);
    }
}, 1000);

// ── HUD ────────────────────────────────────────────────
const hudLabel = document.getElementById('hud-label');
const modeBtn = document.getElementById('hud-mode-btn');
const cornerLbl = document.getElementById('corner-label');

// Inject pulse dot into HUD
const dot = document.createElement('span');
dot.className = 'pulse-dot';
hudLabel.prepend(dot);

// Progress ring
const progressWrap = document.createElement('div');
progressWrap.id = 'progress-wrap';
progressWrap.innerHTML = `<svg viewBox="0 0 32 32" width="32" height="32">
  <circle class="track"  cx="16" cy="16" r="13" fill="none" stroke="var(--brand-mid)" stroke-width="3" opacity="0.3"/>
  <circle id="progress-fill" cx="16" cy="16" r="13" fill="none" stroke="var(--brand-dark)" stroke-width="3"
    stroke-linecap="round" stroke-dasharray="81.7" stroke-dashoffset="81.7"/>
</svg>`;
document.body.appendChild(progressWrap);
const progressFill = document.getElementById('progress-fill');
const CIRC = 81.7;

let cycleStart = performance.now();
const CYCLE_MS = TIME_SHOW_MS + TRANSITION_MS + DATE_SHOW_MS + TRANSITION_MS;

function updateHUD() {
    const isDate = st.mode === 'date';
    hudLabel.childNodes[1].textContent = isDate ? 'DATE' : 'TIME';
    hudLabel.classList.toggle('date-mode', isDate);
    cornerLbl.textContent = isDate ? getDateStr() : '';
}
updateHUD();

// Manual toggle
function manualToggle() {
    clearTimeout(phaseTimeout);
    st.mode = st.mode === 'time' ? 'date' : 'time';
    updateHUD();
    startTransition(st.mode === 'time' ? getTimeStr() : getDateStr());
    cycleStart = performance.now();
    scheduleNext();
}
modeBtn.addEventListener('click', manualToggle);
modeBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') manualToggle();
});

// ── Draw ───────────────────────────────────────────────
const BAR_COLOR = '#3a5c3a';
const GRID_COLOR = 'rgba(60,100,60,0.07)';

function draw(now) {
    // Transition
    if (st.transitioning) {
        const t = (now - st.transStart) / TRANSITION_MS;
        st.bars = interpBars(st.from, st.target, t);
        if (t >= 1) {
            st.transitioning = false;
            st.bars = st.target.map(b => ({
                ...b
            }));
        }
    }

    // Clear
    ctx.fillStyle = '#f0f7f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    const nCols = Math.floor(canvas.width / 11);
    for (let i = 0; i < nCols; i++) {
        const x = i * (canvas.width / nCols) + (canvas.width / nCols) / 2;
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Bars
    ctx.fillStyle = BAR_COLOR;
    for (const b of st.bars) {
        if (b.h < 0.5) continue;
        const r = Math.min(b.w / 2, b.h / 2, 3);
        roundRect(ctx, b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, r);
        ctx.fill();
    }

    // Progress ring
    const elapsed = (now - cycleStart) % CYCLE_MS;
    const frac = elapsed / CYCLE_MS;
    progressFill.style.strokeDashoffset = CIRC * (1 - frac);

    requestAnimationFrame(draw);
}

// Rounded rect helper
function roundRect(c, x, y, w, h, r) {
    if (c.roundRect) {
        c.beginPath();
        c.roundRect(x, y, w, h, r);
        return;
    }
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
}

requestAnimationFrame(draw);

// ── Service Worker ─────────────────────────────────────
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}