// Demo: bu haftanın konularını (modules, map, destructuring, DOM) görsel bir şova çevirir
import * as util from "./util.js";
import { apiKey, abc as content } from "./util.js";

const rand = (a, b) => a + Math.random() * (b - a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const css = (el, s) => Object.assign(el.style, s);

/* ───────────────────────── KONSOL ───────────────────────── */
console.log(
  "%c CENG 475 %c JavaScript Refresher %c ⚛️ ",
  "background:#fce563;color:#1f1c17;font-size:22px;font-weight:bold;padding:8px 12px;border-radius:6px 0 0 6px",
  "background:#1f1c17;color:#fce563;font-size:22px;padding:8px 12px;border:2px solid #fce563",
  "background:#61dafb;color:#1f1c17;font-size:22px;padding:8px 12px;border-radius:0 6px 6px 0"
);
console.log("%c📦 import * as util →", "color:#61dafb;font-size:14px;font-weight:bold");
console.table(Object.entries(util).map(([name, value]) => ({ export: name, value })));
console.log("%cimport { apiKey, abc as content } →", "color:#61dafb;font-weight:bold", { apiKey, content });
const topicsTable = [...document.querySelectorAll("li")].map((li, i) => ({ no: i + 1, topic: li.textContent }));
console.log("%c🗺️  [...li].map(...) →", "color:#a6e22e;font-size:14px;font-weight:bold");
console.table(topicsTable);
const [first, second, ...rest] = topicsTable.map(({ topic }) => topic);
console.log("%c🧩 const [first, second, ...rest] =", "color:#f92672;font-weight:bold", { first, second, rest });
console.groupCollapsed("%c🤯 Tricky Parts (aç bakalım)", "color:#fd971f;font-size:14px;font-weight:bold");
[['10 == "10"', 10 == "10"], ['10 === "10"', 10 === "10"], ["0.1 + 0.2", 0.1 + 0.2], ["typeof NaN", typeof NaN],
 ["[] + {}", [] + {}], ['"5" - 2', "5" - 2], ['"5" + 2', "5" + 2]]
  .forEach(([e, r]) => console.log(`%c${e.padEnd(14)}%c→ ${JSON.stringify(r)}`, "color:#e6e2db", "color:#fce563"));
console.groupEnd();
console.log("%c🎮 Gizli tuşlar: [R] barrel roll · [SPACE] bass drop · ↑↑↓↓←→←→BA = HYPER MODE",
  "color:#61dafb;font-size:13px;font-weight:bold");

/* ───────────────────────── SES (Web Audio) ───────────────────────── */
let actx;
function sfx(freq, dur, { type = "square", vol = 0.04, to } = {}) {
  if (!actx) return;
  const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(actx.destination);
  o.start(t);
  o.stop(t + dur);
}
function noise(dur = 0.4, vol = 0.3) {
  if (!actx) return;
  const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  const src = actx.createBufferSource(), g = actx.createGain(), f = actx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 1200;
  g.gain.value = vol;
  src.buffer = buf;
  src.connect(f).connect(g).connect(actx.destination);
  src.start();
}
const tick = () => sfx(rand(700, 1100), 0.025, { vol: 0.015 });
const blip = () => sfx(1400, 0.06, { type: "triangle", vol: 0.04, to: 2200 });
const boom = (big = 1) => { sfx(170, 0.9 * big, { type: "sine", vol: 0.8, to: 28 }); noise(0.5 * big, 0.35 * big); };
const arp = () => [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => sfx(f, 0.18, { type: "triangle", vol: 0.06 }), i * 70));

/* ───────────────────────── STİLLER ───────────────────────── */
const style = document.createElement("style");
style.textContent = `
  @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg) } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 15px #fce563, inset 0 0 10px #fce56355 } 50% { box-shadow: 0 0 45px #fce563, 0 0 90px #61dafb } }
  @keyframes blink { 50% { opacity: 0 } }
  @keyframes hue { to { filter: hue-rotate(360deg) saturate(2) } }
  html, body { overflow-x: hidden; }
  header, #stage { position: relative; z-index: 2; }
  header { border-bottom-color: #fce56388 !important; }
  header h1 { font-size: 2.6rem !important; font-weight: 700 !important; letter-spacing: 2px; }
  header img { width: 3.2rem !important; animation: spin3 3s linear infinite; }
  @keyframes spin3 { to { transform: rotateY(360deg) } }
  #stage { height: 380px; perspective: 1100px; margin-top: 30px; }
  #stage ul { position: absolute; left: 50%; top: 50%; width: 0; height: 0; margin: 0; padding: 0; transform-style: preserve-3d; }
  #stage li { position: absolute; width: 240px; height: 120px; left: -120px; top: -60px; margin: 0;
    display: flex; align-items: center; justify-content: center; text-align: center; padding: 12px; box-sizing: border-box;
    font: 700 1.05rem monospace; color: #fce563; background: linear-gradient(135deg, #1f1c17ee, #2a2620cc);
    border: 2px solid #fce563; border-radius: 14px; cursor: pointer; transition: background .2s, color .2s; }
  #stage li:hover { background: #fce563; color: #1f1c17; }
  #stage li small { position: absolute; top: 6px; left: 10px; font-size: .7rem; opacity: .6; }
  #panel { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); width: min(680px, 92vw); z-index: 50;
    background: #000d; border: 2px solid #61dafb; border-radius: 12px; padding: 18px 22px; font: 15px/1.5 monospace;
    color: #e6e2db; box-shadow: 0 0 40px #61dafb88; backdrop-filter: blur(6px); }
  #panel pre { margin: 0 0 10px; white-space: pre-wrap; color: #a6e22e; }
  #panel .out { color: #fce563; font-weight: bold; font-size: 1.1rem; white-space: pre-wrap; }
  #panel .x { position: absolute; top: 8px; right: 14px; cursor: pointer; color: #61dafb; }
  .cursor { animation: blink .7s steps(1) infinite; }
`;
document.head.append(style);

/* ───────────────────────── ARKA PLAN: dönen React atomu ───────────────────────── */
const orbit = "M90,0 A90,34 0 1,1 -90,0 A90,34 0 1,1 90,0";
const atom = document.createElement("div");
atom.innerHTML = `<svg viewBox="-100 -100 200 200" width="640" height="640">
  ${[0, 60, 120].map((r, i) => `<g transform="rotate(${r})">
      <ellipse rx="90" ry="34" fill="none" stroke="#61dafb" stroke-width="2.5"/>
      <circle r="5" fill="#fce563"><animateMotion dur="${1.6 + i * 0.4}s" repeatCount="indefinite" path="${orbit}"/></circle>
    </g>`).join("")}
  <circle r="11" fill="#61dafb"/></svg>`;
css(atom, { position: "fixed", left: "50%", top: "55%", transform: "translate(-50%,-50%)", opacity: 0.16,
  pointerEvents: "none", zIndex: 1, animation: "spin 25s linear infinite" });
document.body.append(atom);

/* ───────────────────────── CANVAS: partikül ağı + fizikli patlamalar ───────────────────────── */
const canvas = document.createElement("canvas");
css(canvas, { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" });
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
let nodes = [], sparks = [], hyper = false;
const resize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  nodes = Array.from({ length: Math.min(110, (innerWidth * innerHeight) / 12000) }, () => ({
    x: rand(0, innerWidth), y: rand(0, innerHeight), vx: rand(-0.5, 0.5), vy: rand(-0.5, 0.5),
  }));
};
resize();
addEventListener("resize", resize);
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  for (let i = 0; i < 2; i++)
    sparks.push({ x: e.clientX, y: e.clientY, vx: rand(-1, 1), vy: rand(-1, 1), life: 30, max: 30, size: rand(1, 3),
      hue: (performance.now() / 10) % 360, g: 0 });
});

const glyphs = ["{}", "=>", "⚛", "JS", "[]", "...", "()"];
function explode(x, y, n = 80, power = 9) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), s = rand(1, power);
    sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: rand(60, 120), max: 120,
      size: rand(2, 5), hue: rand(0, 360), g: 0.18, glyph: Math.random() < 0.15 ? glyphs[i % glyphs.length] : null });
  }
}

let rot = 0, hovering = false, ring;
function frame() {
  ctx.fillStyle = "rgba(20,17,13,0.28)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // partikül ağı (fareye doğru çekilir)
  for (const n of nodes) {
    const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
    if (d < 200) { n.vx += dx / d * 0.05; n.vy += dy / d * 0.05; }
    n.vx *= 0.99; n.vy *= 0.99;
    n.x += n.vx * (hyper ? 4 : 1); n.y += n.vy * (hyper ? 4 : 1);
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = hyper ? `hsla(${(i * 9 + performance.now() / 5) % 360},90%,60%,${1 - d / 130})`
                                : `rgba(252,229,99,${(1 - d / 130) * 0.5})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    const m = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
    if (m < 180) {
      ctx.strokeStyle = `rgba(97,218,251,${1 - m / 180})`;
      ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
    }
  }

  // kıvılcımlar (yerçekimi + zıplama)
  sparks = sparks.filter((s) => s.life-- > 0);
  for (const s of sparks) {
    s.vy += s.g; s.x += s.vx; s.y += s.vy;
    if (s.g && s.y > canvas.height - 4) { s.y = canvas.height - 4; s.vy *= -0.55; s.vx *= 0.8; }
    ctx.globalAlpha = Math.max(0, s.life / s.max);
    ctx.fillStyle = `hsl(${s.hue},95%,62%)`;
    if (s.glyph) { ctx.font = "bold 18px monospace"; ctx.fillText(s.glyph, s.x, s.y); }
    else { ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;

  // 3D carousel (fareyle eğilir)
  if (ring) {
    if (!hovering) rot += hyper ? 3 : 0.25;
    const tilt = (mouse.y / innerHeight - 0.5) * -25;
    ring.style.transform = `translateZ(-360px) rotateX(${tilt}deg) rotateY(${rot}deg)`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ───────────────────────── EFEKTLER ───────────────────────── */
function shake(p = 14, ms = 500) {
  const k = Array.from({ length: 12 }, () => ({ transform: `translate(${rand(-p, p)}px,${rand(-p, p)}px) rotate(${rand(-1, 1)}deg)` }));
  document.querySelector("header").animate([...k, { transform: "none" }], { duration: ms });
  document.querySelector("#stage")?.animate([...k, { transform: "none" }], { duration: ms });
}
function flash(color = "#fff") {
  const f = document.createElement("div");
  css(f, { position: "fixed", inset: 0, background: color, zIndex: 99, pointerEvents: "none" });
  document.body.append(f);
  f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).onfinish = () => f.remove();
}

// Başlık: gökkuşağı + glitch
const h1 = document.querySelector("h1");
const original = h1.textContent;
let hue = 0;
setInterval(() => {
  hue = (hue + 2) % 360;
  h1.style.color = `hsl(${hue},90%,65%)`;
  h1.style.textShadow = `0 0 14px hsl(${hue},90%,50%), 0 0 40px hsl(${(hue + 60) % 360},90%,50%)`;
}, 20);
setInterval(() => {
  const junk = "!<>-_\\/[]{}—=+*^?#01";
  let n = 0;
  const g = setInterval(() => {
    h1.textContent = original.split("").map((c) => (Math.random() < 0.3 ? junk[(Math.random() * junk.length) | 0] : c)).join("");
    h1.style.transform = `skewX(${rand(-15, 15)}deg) translateX(${rand(-6, 6)}px)`;
    h1.style.textShadow = `4px 0 #ff00c8, -4px 0 #00fff2`;
    if (++n > 6) { clearInterval(g); h1.textContent = original; h1.style.transform = ""; }
  }, 50);
}, 3200);

/* ───────────────────────── 3D KARTLAR + CANLI KOD ───────────────────────── */
const demos = [
  [`"use strict";\nconst course = "ceng 475";\ncourse.toUpperCase() + " 🚀"`, () => "ceng 475".toUpperCase() + " 🚀"],
  [`10 == "10";   // gevşek eşitlik\n10 === "10";  // katı eşitlik\n[10 == "10", 10 === "10"]`, () => [10 == "10", 10 === "10"]],
  [`const greet = (name, msg = "Hello!") =>\n  \`Hi, I am \${name}. \${msg}\`;\n\ngreet("Alparslan")`, () => ((n, m = "Hello!") => `Hi, I am ${n}. ${m}`)("Alparslan")],
  [`const { name: userName, age } = {\n  name: "Max",\n  age: 45\n};\n({ userName, age })`, () => { const { name: userName, age } = { name: "Max", age: 45 }; return { userName, age }; }],
  [`["Sports", "Cooking", "Reading"]\n  .map((item, i) => ({ id: i, text: item }))`, () => ["Sports", "Cooking", "Reading"].map((item, i) => ({ id: i, text: item }))],
  [`[1, 2, 3, 4, 5, 6, 7, 8]\n  .filter(n => n % 2 === 0)\n  .map(n => n ** 2)`, () => [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => n % 2 === 0).map((n) => n ** 2)],
  [`document.querySelectorAll("li").length\n// + bütün sayfa zaten DOM'la yapıldı 😎`, () => document.querySelectorAll("li").length],
  [`import { apiKey, abc as content } from "./util.js";\nconst [first, ...rest] = ["JSX", "props", "useState"];\n({ apiKey, content, first, rest })`, () => { const [first, ...rest] = ["JSX", "props", "useState"]; return { apiKey, content, first, rest }; }],
  [`[0.1 + 0.2, typeof NaN, [] + {}, "5" - 2, "5" + 2]`, () => [0.1 + 0.2, typeof NaN, [] + {}, "5" - 2, "5" + 2]],
];

const ul = document.querySelector("ul");
const stage = document.createElement("div");
stage.id = "stage";
ul.before(stage);
stage.append(ul);
ring = ul;
stage.onmouseenter = () => (hovering = true);
stage.onmouseleave = () => (hovering = false);
const items = [...ul.querySelectorAll("li")];
const texts = items.map((li) => li.textContent);
items.forEach((li, i) => {
  li.style.transform = `rotateY(${i * 40}deg) translateZ(360px)`;
  li.textContent = "";
  li.onmouseenter = blip;
  li.onclick = () => runDemo(i);
});

let panel, running = 0;
async function runDemo(i) {
  const id = ++running;
  panel?.remove();
  panel = document.createElement("div");
  panel.id = "panel";
  panel.innerHTML = `<span class="x">✕ ESC</span><div style="color:#61dafb;margin-bottom:8px">// ${texts[i]}</div><pre></pre><div class="out"></div>`;
  document.body.append(panel);
  panel.querySelector(".x").onclick = () => panel.remove();
  const pre = panel.querySelector("pre"), out = panel.querySelector(".out");
  const [code, fn] = demos[i];
  for (let c = 1; c <= code.length; c++) {
    if (id !== running) return;
    pre.innerHTML = code.slice(0, c).replace(/</g, "&lt;") + '<span class="cursor">▌</span>';
    if (c % 2) tick();
    await sleep(18);
  }
  pre.textContent = code;
  const result = fn();
  out.textContent = "→ " + JSON.stringify(result, null, 1).replace(/\n\s*/g, " ");
  out.animate([{ transform: "scale(1.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 400, easing: "cubic-bezier(.2,2,.4,1)" });
  console.log(`%c${texts[i]} →`, "color:#61dafb;font-weight:bold", result);
  arp();
  const r = panel.getBoundingClientRect();
  explode(r.left + r.width / 2, r.top, 90, 11);
}

/* ───────────────────────── ETKİLEŞİM ───────────────────────── */
let launched = false;
document.addEventListener("click", (e) => {
  if (!launched || e.target.closest("#panel")) return;
  explode(e.clientX, e.clientY, 70, 9);
  boom(0.5);
  shake(6, 250);
});

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let keys = [];
addEventListener("keydown", (e) => {
  if (!launched) return;
  keys = [...keys, e.key].slice(-konami.length);
  if (keys.join() === konami.join()) return hyperMode();
  if (e.key === "Escape") return panel?.remove();
  if (e.key === " ") { e.preventDefault(); boom(1.5); flash("#fce563"); shake(25, 700); explode(innerWidth / 2, innerHeight / 2, 250, 16); return; }
  if (e.key.toLowerCase() === "r") {
    document.documentElement.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 1000, easing: "ease-in-out" });
    sfx(200, 1, { type: "sawtooth", vol: 0.05, to: 1600 });
  }
  if (e.key.length === 1) {
    const s = document.createElement("span");
    s.textContent = e.key;
    css(s, { position: "fixed", left: rand(5, 90) + "vw", bottom: "-60px", zIndex: 60, pointerEvents: "none",
      font: `900 ${rand(40, 110)}px monospace`, color: `hsl(${rand(0, 360)},95%,65%)`, textShadow: "0 0 20px currentColor" });
    document.body.append(s);
    s.animate([{ transform: "translateY(0) rotate(0)" }, { transform: `translateY(-${innerHeight + 150}px) rotate(${rand(-540, 540)}deg)` }],
      { duration: rand(1200, 2200), easing: "cubic-bezier(.2,.8,.4,1)" }).onfinish = () => s.remove();
    tick();
  }
});

function hyperMode() {
  if (hyper) return;
  hyper = true;
  console.log("%c🔥🔥🔥 HYPER MODE 🔥🔥🔥", "font-size:40px;color:#f0f;text-shadow:3px 3px #0ff");
  flash("#ff00c8");
  boom(2);
  arp();
  document.body.style.animation = "hue 1s linear infinite";
  const fw = setInterval(() => { explode(rand(0, innerWidth), rand(0, innerHeight * 0.6), 60, 10); sfx(rand(300, 900), 0.15, { vol: 0.05, to: 60 }); }, 160);
  setTimeout(() => { clearInterval(fw); hyper = false; document.body.style.animation = ""; }, 7000);
}

/* ───────────────────────── AÇILIŞ: hacker terminali ───────────────────────── */
async function boot() {
  const ov = document.createElement("div");
  css(ov, { position: "fixed", inset: 0, zIndex: 100, background: "#000", color: "#33ff66", padding: "6vh 6vw",
    font: "18px/1.7 monospace", cursor: "pointer", overflow: "hidden" });
  document.body.append(ov);
  // istediğin an tıkla → direkt fırlat (yazıyı beklemeye gerek yok)
  const clicked = new Promise((r) => (ov.onclick = r));
  const hint = document.createElement("div");
  hint.textContent = "(ekrana tıkla → başlat)";
  css(hint, { position: "absolute", right: "4vw", bottom: "4vh", color: "#33ff6688", fontSize: "14px", animation: "blink 1.2s steps(1) infinite" });
  ov.append(hint);
  let skip = false;
  clicked.then(() => (skip = true));
  const lines = [
    "> booting CENG475.exe ...",
    "> import * as util from './util.js'",
    `  ✓ exports: [ ${Object.keys(util).join(", ")} ]`,
    "> import { apiKey, abc as content } from './util.js'",
    `  ✓ apiKey = "${apiKey}"   content = "${content}"`,
    `> document.querySelectorAll("li").map(...)  →  ${items.length} topics`,
    "> loading React essentials ......... ⚛️",
    "> injecting vibes .................. 100%",
  ];
  for (const line of lines) {
    if (skip) break;
    const p = document.createElement("div");
    ov.append(p);
    for (let c = 1; c <= line.length && !skip; c++) { p.textContent = line.slice(0, c); await sleep(12); }
    await sleep(120);
  }
  const btn = document.createElement("div");
  btn.textContent = "[ CLICK TO LAUNCH 🚀 ]";
  css(btn, { marginTop: "5vh", display: "inline-block", padding: "16px 30px", border: "2px solid #fce563", color: "#fce563",
    fontSize: "28px", fontWeight: "bold", borderRadius: "10px", animation: "pulse 1.2s infinite" });
  if (!skip) ov.append(btn);
  await clicked;

  actx = new (window.AudioContext || window.webkitAudioContext)();
  launched = true;
  boom(2);
  flash();
  ov.animate([{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "scale(2.5)", filter: "blur(20px)" }],
    { duration: 700, easing: "ease-in" }).onfinish = () => ov.remove();
  shake(30, 800);
  explode(innerWidth / 2, innerHeight / 2, 300, 18);

  // kartlar sırayla daktiloyla yazılır
  items.forEach((li, i) =>
    setTimeout(async () => {
      li.innerHTML = `<small>0${i + 1}</small>`;
      const span = document.createElement("span");
      li.append(span);
      li.animate([{ opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 400 });
      for (let c = 1; c <= texts[i].length; c++) { span.textContent = texts[i].slice(0, c); if (c % 3 === 0) tick(); await sleep(25); }
      li.style.animation = "pulse 2.5s infinite";
    }, 600 + i * 300)
  );
}
boot();
