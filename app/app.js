/* AI Platform Mastery — course app. Vanilla JS, no build step.
   Routes are plain hashes (#home, #course-p1, #learn-p1m1-quiz …) so they also work inside a sandboxed frame. */
{
const KEY = "apm-v2", OLD_KEY = "apm-progress-v1";
const A = window.ART, ic = A.icon;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtMin = m => m < 60 ? `${Math.round(m)} min` : `${(m / 60).toFixed(m < 600 ? 1 : 0)} h`;
const STEPS = [["lesson", "Lesson", "lesson"], ["read", "Readings", "read"], ["quiz", "Quiz", "quiz"], ["ex", "Exercises", "ex"], ["reflect", "Reflect", "reflect"]];
const LEVEL = { strong: "Refresher", partial: "Intermediate", gap: "Advanced" };

let D, S, mem = null;

/* ---------------- state ---------------- */
function blank() { return { v: 2, name: "Ammar", goalMin: 360, started: Date.now(), done: {}, quiz: {}, links: {}, notes: {}, refl: {}, caps: {}, capLinks: {}, review: {}, activity: {}, modTime: {}, last: null, badges: {} }; }
function load() {
  let s = null;
  try { const v = localStorage.getItem(KEY); if (v) s = JSON.parse(v); } catch (e) { s = mem; }
  if (!s) { s = blank(); try { const o = JSON.parse(localStorage.getItem(OLD_KEY) || "null"); if (o && o.modules) migrate(o, s); } catch (e) {} }
  return Object.assign(blank(), s);
}
function migrate(o, s) {
  for (const [id, m] of Object.entries(o.modules)) {
    if (m.best) s.quiz[id] = { best: m.best, attempts: [{ score: m.best, at: m.passedAt || Date.now() }] };
    Object.entries(m.readings || {}).forEach(([i, v]) => v && (s.done[`${id}:read:${i}`] = Date.now()));
    Object.entries(m.ex || {}).forEach(([i, v]) => v && (s.done[`${id}:ex:${i}`] = Date.now()));
    if (m.reflection) s.refl[id] = m.reflection; if (m.notes) s.notes[id] = m.notes;
    Object.entries(m.links || {}).forEach(([i, v]) => s.links[`${id}:${i}`] = v);
  }
  (o.log || []).forEach(d => s.activity[d] = (s.activity[d] || 0) + 1);
}
function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function mark(key, on = true) { if (on) S.done[key] = S.done[key] || Date.now(); else delete S.done[key]; touch(); save(); }
function touch() { const t = today(); S.activity[t] = S.activity[t] || 0.01; }

/* ---------------- curriculum helpers ---------------- */
const mods = () => D.pillars.flatMap(p => p.modules.map((m, i) => Object.assign(m, { pillar: p, idx: i })));
const findMod = id => mods().find(m => m.id === id);
const pil = id => D.pillars.find(p => p.id === id);
const passed = id => (S.quiz[id]?.best || 0) >= D.pass_mark;
const req = m => m.readings.map((r, i) => [r, i]).filter(([r]) => r.required);
const core = m => m.exercises.map((e, i) => [e, i]).filter(([e]) => e.level === "core");
function stepDone(m, step) {
  if (step === "lesson") return !!S.done[`${m.id}:lesson`];
  if (step === "read") return req(m).every(([, i]) => S.done[`${m.id}:read:${i}`]);
  if (step === "quiz") return passed(m.id);
  if (step === "ex") return core(m).every(([, i]) => S.done[`${m.id}:ex:${i}`]);
  if (step === "reflect") return (S.refl[m.id] || "").trim().length >= 40;
}
function modPct(m) {
  let p = 0;
  p += S.done[`${m.id}:lesson`] ? 1 : 0;
  const r = req(m); p += r.length ? r.filter(([, i]) => S.done[`${m.id}:read:${i}`]).length / r.length : 1;
  p += passed(m.id) ? 1 : 0;
  const c = core(m); p += c.length ? c.filter(([, i]) => S.done[`${m.id}:ex:${i}`]).length / c.length : 1;
  p += stepDone(m, "reflect") ? 1 : 0;
  return p / 5;
}
const modDone = m => modPct(m) >= 0.999;
function unlocked(m) {
  if (!m.pillar) m = findMod(m.id);
  const p = m.pillar;
  if (m.idx > 0) return passed(p.modules[m.idx - 1].id);
  if (p.parallel) return true;
  const seq = D.pillars.filter(x => !x.parallel), i = seq.indexOf(p);
  return i <= 0 || passed(seq[i - 1].modules.at(-1).id);
}
const capOpen = p => p.modules.every(m => passed(m.id));
const capPct = p => p.capstone.deliverables.filter((_, i) => S.caps[`${p.id}:${i}`]).length / p.capstone.deliverables.length;
const coursePct = p => (p.modules.reduce((a, m) => a + modPct(m), 0) + capPct(p)) / (p.modules.length + 1);
const courseDone = p => p.modules.every(modDone) && capPct(p) >= 0.999;
const coursePassed = p => p.modules.filter(m => passed(m.id)).length;
const overall = () => { const ps = D.pillars; return ps.reduce((a, p) => a + coursePct(p) * (p.modules.length + 1), 0) / ps.reduce((a, p) => a + p.modules.length + 1, 0); };
function nextStep(m) { return STEPS.map(s => s[0]).find(s => !stepDone(m, s)) || "lesson"; }
function upNext() {
  if (S.last) { const m = findMod(S.last.mid); if (m && unlocked(m) && !modDone(m)) return { m, step: nextStep(m) }; }
  const m = mods().find(m => unlocked(m) && !modDone(m) && !m.pillar.parallel) || mods().find(m => unlocked(m) && !modDone(m));
  return m ? { m, step: nextStep(m) } : null;
}
function streak() {
  let n = 0; const d = new Date();
  if (!S.activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  while (S.activity[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function weekMin() { const d = new Date(), dow = (d.getDay() + 6) % 7; let t = 0; for (let i = 0; i <= dow; i++) { const x = new Date(d); x.setDate(d.getDate() - i); t += S.activity[dayKey(x)] || 0; } return t; }
const totalMin = () => Object.values(S.activity).reduce((a, b) => a + b, 0);

/* ---------------- time tracking (active minutes only) ---------------- */
let lastAct = Date.now();
["pointerdown", "keydown", "scroll", "touchstart"].forEach(e => addEventListener(e, () => lastAct = Date.now(), { passive: true }));
setInterval(() => {
  if (document.visibilityState !== "visible" || Date.now() - lastAct > 120000) return;
  const t = today(); S.activity[t] = (S.activity[t] || 0) + 0.25;
  const r = parse(); if (r.view === "learn") S.modTime[r.mid] = (S.modTime[r.mid] || 0) + 0.25;
  save();
}, 15000);

/* ---------------- badges ---------------- */
const BADGES = [
  ["first-quiz", "First quiz passed", () => mods().some(m => passed(m.id))],
  ["streak-3", "3-day streak", () => streak() >= 3],
  ["streak-7", "7-day streak", () => streak() >= 7],
  ["streak-30", "30-day streak", () => streak() >= 30],
  ["hours-10", "10 hours studied", () => totalMin() >= 600],
  ["hours-50", "50 hours studied", () => totalMin() >= 3000],
  ["mods-5", "5 modules complete", () => mods().filter(modDone).length >= 5],
  ["mods-all", "All 25 modules", () => mods().every(modDone)],
  ["perfect", "Perfect quiz", () => Object.values(S.quiz).some(q => q.best >= 1)],
  ...["p1", "p2", "p3", "p4", "p5", "p6"].map(id => [`course-${id}`, `Course ${id.toUpperCase()} certificate`, () => courseDone(pil(id))]),
];
function checkBadges() {
  const fresh = [];
  for (const [id, label, test] of BADGES) if (!S.badges[id] && test()) { S.badges[id] = Date.now(); fresh.push(label); }
  if (fresh.length) { save(); toast("Badge earned: " + fresh.join(", ")); confetti(); }
}

/* ---------------- UI helpers ---------------- */
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800); }
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("div"); c.className = "confetti";
  const cols = ["#1A73E8", "#EA4335", "#FBBC04", "#34A853", "#7B5CE0", "#E8710A"];
  c.innerHTML = Array.from({ length: 70 }, () => `<i style="left:${Math.random() * 100}%;background:${cols[Math.random() * 6 | 0]};animation-delay:${Math.random() * .5}s;animation-duration:${1.2 + Math.random()}s"></i>`).join("");
  document.body.append(c); setTimeout(() => c.remove(), 2600);
}
const ring = (p, c, s = 72, label) => `<div class="ring" style="--p:${Math.round(p * 100)};--c:${c};--s:${s}px"><b>${label ?? Math.round(p * 100) + "%"}</b></div>`;
const bar = (p, c) => `<div class="bar" style="--c:${c}"><i style="width:${Math.round(p * 100)}%"></i></div>`;
const col = p => A.PAL[p.id].main;

/* ---------------- views ---------------- */
function vHome() {
  const n = upNext(), st = streak(), wk = weekMin(), donePids = D.pillars.filter(courseDone).map(p => p.id);
  const passedP = D.pillars.filter(p => p.modules.every(m => passed(m.id))).map(p => p.id);
  let h = installCard();
  h += `<section class="card hero"><div class="art">${A.hero([...new Set([...donePids, ...passedP])])}</div><div class="txt">
    <div class="mut">${greeting()}, ${esc(S.name)}</div><h1>Become a global-level AI platform engineer</h1>
    <p class="mut">${D.pillars.length} courses · ${mods().length} modules · ${Math.round(overall() * 100)}% complete</p>
    ${bar(overall(), "var(--brand)")}
    <div style="margin-top:16px">${n ? `<a class="btn pri" href="#learn-${n.m.id}-${n.step}">${S.last ? "Resume learning" : "Start learning"} ${ic("next")}</a>` : `<a class="btn pri" href="#progress">See your achievements</a>`}</div></div></section>`;
  if (n) {
    const p = n.m.pillar;
    h += `<div class="sec"><h2>Continue learning</h2></div><a class="card resume" href="#learn-${n.m.id}-${n.step}"><span class="thumb">${A.thumb(p.id, n.m.idx + 1)}</span>
      <span><span class="mut">${esc(p.title)}</span><h3 style="margin:2px 0 8px">${esc(n.m.title)}</h3>${bar(modPct(n.m), col(p))}
      <span class="mut" style="display:block;margin-top:6px">${Math.round(modPct(n.m) * 100)}% · next: ${STEPS.find(s => s[0] === n.step)[1]}</span></span></a>`;
  }
  h += `<div class="sec"><h2>This week</h2></div><div class="kpis">
    <div class="card kpi">${A.spot.flame(st > 0)}<div><b>${st}</b><span class="mut">day streak</span></div></div>
    <div class="card kpi">${ring(Math.min(1, wk / S.goalMin), "var(--brand)", 56, "")}<div><b>${fmtMin(wk)}</b><span class="mut">of ${fmtMin(S.goalMin)} goal</span></div></div>
    <div class="card kpi">${ring(mods().filter(m => passed(m.id)).length / mods().length, "#34A853", 56, "")}<div><b>${mods().filter(m => passed(m.id)).length}/${mods().length}</b><span class="mut">quizzes passed</span></div></div>
    <div class="card kpi">${ring(Object.keys(S.badges).length / BADGES.length, "#FBBC04", 56, "")}<div><b>${Object.keys(S.badges).length}</b><span class="mut">badges</span></div></div></div>`;
  h += `<div class="sec"><h2>Your courses</h2><a href="#courses">See all</a></div><div class="grid">${D.pillars.map(courseCard).join("")}</div>`;
  const rv = Object.keys(S.review).length;
  if (rv) h += `<div class="sec"><h2>Review</h2></div><a class="card resume" href="#review"><span class="thumb" style="background:#FEF7E0;display:grid;place-items:center">${ic("review", "ic")}</span><span><h3>${rv} question${rv > 1 ? "s" : ""} to review</h3><span class="mut">Questions you missed come back until you get them right twice.</span></span></a>`;
  return h;
}
function greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }
function courseCard(p) {
  const pc = coursePct(p), hrs = p.modules.reduce((a, m) => a + m.hours, 0);
  const first = p.modules.find(m => unlocked(m) && !modDone(m));
  return `<a class="card course" href="#course-${p.id}"><div class="cv">${A.cover(p.id)}<span class="chip lvl">${p.parallel ? "Runs in parallel" : LEVEL[p.status]}</span></div>
    <div class="bd"><span class="mut" style="font-weight:700">Course ${p.order}</span><h3>${esc(p.title)}</h3>
    <div class="meta"><span>${ic("lesson")}${p.modules.length} modules</span><span>${ic("clock")}~${hrs} h</span><span class="chip ${p.status}">You: ${p.status}</span></div>
    <div style="margin-top:auto">${bar(pc, col(p))}<div class="mut" style="margin-top:6px">${pc > 0 ? Math.round(pc * 100) + "% complete" : first ? "Not started" : "Locked until earlier courses"}${courseDone(p) ? " · certificate earned" : ""}</div></div></div></a>`;
}
function vCourses() {
  return `<h1 style="margin-bottom:6px">My learning</h1><p class="mut">Recommended order: ${D.pillars.filter(p => !p.parallel).map(p => p.id.toUpperCase()).join(" → ")}. P6 runs alongside all of them.</p>
    <div class="grid" style="margin-top:16px">${D.pillars.map(courseCard).join("")}</div>`;
}
function vCourse(pid) {
  const p = pil(pid); if (!p) return notFound();
  const c = A.PAL[p.id], hrs = p.modules.reduce((a, m) => a + m.hours, 0), pc = coursePct(p);
  const n = p.modules.find(m => unlocked(m) && !modDone(m));
  let h = `<a class="crumb" href="#courses">${ic("back")} My learning</a>
    <section class="card chero"><div class="cv">${A.cover(p.id)}</div><div class="txt" style="--cbg:${c.dark}">
    <span class="chip" style="background:rgba(255,255,255,.18);color:#fff">Course ${p.order} · ${p.parallel ? "Runs in parallel" : LEVEL[p.status]}</span>
    <h1 style="margin-top:10px">${esc(p.title)}</h1><p>${esc(p.goal)}</p>
    <div class="meta" style="margin:14px 0"><span>${ic("lesson")}${p.modules.length} modules</span><span>${ic("clock")}~${hrs} h</span><span>${ic("quiz")}${p.modules.reduce((a, m) => a + m.quiz.length, 0)} quiz questions</span><span>${ic("award")}Certificate</span></div>
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">${n ? `<a class="btn" style="background:#fff;color:${c.dark};border-color:#fff" href="#learn-${n.id}-${nextStep(n)}">${pc > 0 ? "Continue" : "Start course"} ${ic("next")}</a>` : courseDone(p) ? `<a class="btn" style="background:#fff;color:${c.dark}" href="#cert-${p.id}">View certificate</a>` : ""}
    <span style="font-weight:700">${Math.round(pc * 100)}% complete</span></div></div></section>`;
  h += `<div class="sec"><h2>Why this matters for you</h2></div><div class="card pad"><p style="margin:0">${esc(p.why_now)}</p></div>`;
  h += `<div class="sec"><h2>What you'll learn</h2></div><ul class="card learn">${p.modules.flatMap(m => m.objectives.slice(0, 2)).map(o => `<li>${ic("check")}<span>${esc(o)}</span></li>`).join("")}</ul>`;
  h += `<div class="sec"><h2>Syllabus</h2><span class="mut">${coursePassed(p)}/${p.modules.length} quizzes passed</span></div><div class="card syl">`;
  p.modules.forEach((m, i) => {
    const un = unlocked(m), dn = modDone(m), mp = modPct(m), open = n && n.id === m.id;
    h += `<details class="mod" ${open ? "open" : ""}><summary><span class="thumb">${A.thumb(p.id, i + 1, dn ? "done" : un ? "" : "locked")}</span>
      <span><span class="mut">Module ${i + 1} · ~${m.hours} h</span><h3 style="margin:2px 0 6px">${esc(m.title)}</h3>${un ? bar(mp, col(p)) : `<span class="mut">${ic("lock", "ic")} Pass module ${i}'s quiz to unlock</span>`}</span>
      <span class="mut">${un ? Math.round(mp * 100) + "%" : ""}</span></summary><ul class="items">`;
    STEPS.forEach(([k, label, icn]) => {
      const sd = stepDone(m, k), detail = k === "read" ? `${req(m).length} required · ${m.readings.length - req(m).length} optional` : k === "quiz" ? `${m.quiz.length} questions${S.quiz[m.id] ? ` · best ${Math.round(S.quiz[m.id].best * 100)}%` : ""}` : k === "ex" ? `${core(m).length} core · ${m.exercises.length - core(m).length} stretch` : k === "lesson" ? `${Math.max(5, Math.round((m.lesson_html.length / 1100)))} min read` : "One paragraph";
      h += `<li><a class="item ${un ? "" : "locked"}" href="#learn-${m.id}-${k}"><span class="st ${sd ? "on" : ""}">${sd ? ic("check") : ""}</span><span class="ty">${ic(icn)}</span><span class="t">${label}<br><span class="mut">${detail}</span></span></a></li>`;
    });
    h += `</ul></details>`;
  });
  h += `</div>`;
  const co = capOpen(p);
  h += `<div class="sec"><h2>Capstone project</h2></div><a class="card capst" href="${co ? `#cap-${p.id}` : `#course-${p.id}`}" ${co ? "" : 'aria-disabled="true"'} style="${co ? "" : "opacity:.6"}">
    ${ring(capPct(p), col(p), 64, co ? "" : "🔒")}<span><h3>${esc(p.capstone.title)}</h3><span class="mut">${co ? `${p.capstone.deliverables.length} deliverables` : "Unlocks when every module quiz is passed"}</span></span>${ic("next")}</a>`;
  return h;
}
function sideNav(m) {
  const p = m.pillar;
  return `<aside class="card side"><a href="#course-${p.id}" style="font-weight:700">${ic("back")} ${esc(p.title)}</a>${p.modules.map((x, i) => `<h3>Module ${i + 1}: ${esc(x.title)}</h3>${STEPS.map(([k, l, icn]) => {
    const un = unlocked(x), on = x.id === m.id && parse().step === k;
    return `<a class="${on ? "on" : ""} ${un ? "" : "lk"}" href="#learn-${x.id}-${k}">${stepDone(x, k) ? `<span style="color:var(--ok)">${ic("check")}</span>` : ic(icn)}${l}</a>`; }).join("")}`).join("")}</aside>`;
}
function vLearn(mid, step) {
  const m = findMod(mid); if (!m) return notFound();
  const p = m.pillar, c = col(p);
  if (!unlocked(m)) {
    const prev = mods().slice(0, mods().indexOf(m)).reverse().find(x => !passed(x.id) && !x.pillar.parallel);
    return `<a class="crumb" href="#course-${p.id}">${ic("back")} ${esc(p.title)}</a><div class="card empty"><span class="spot" style="display:block">${A.thumb(p.id, m.idx + 1, "locked")}</span><h2>${esc(m.title)} is locked</h2><p class="mut">Pass the quiz for the module before it (80%) to unlock this one.</p>${prev ? `<a class="btn pri" href="#learn-${prev.id}-quiz">Go to ${esc(prev.title)}</a>` : ""}</div>`;
  }
  S.last = { mid, step }; save();
  const steps = `<nav class="steps" aria-label="Module steps">${STEPS.map(([k, l, icn]) => `<a href="#learn-${mid}-${k}" class="${k === step ? "on" : ""} ${stepDone(m, k) ? "done" : ""}" style="--c:${c}">${stepDone(m, k) ? ic("check") : ic(icn)}${l}</a>`).join("")}</nav>`;
  const body = { lesson: lessonView, read: readView, quiz: quizView, ex: exView, reflect: reflView }[step]?.(m) || lessonView(m);
  return `<div class="player">${sideNav(m)}<div><a class="crumb" href="#course-${p.id}">${ic("back")} ${esc(p.title)} · Module ${m.idx + 1}</a>
    <h1 style="font-size:clamp(22px,4vw,30px);margin-bottom:6px">${esc(m.title)}</h1>
    <div class="meta" style="margin-bottom:14px"><span>${ic("clock")}~${m.hours} h</span><span>${Math.round(modPct(m) * 100)}% done</span>${S.modTime[mid] ? `<span>${fmtMin(S.modTime[mid])} spent</span>` : ""}</div>
    ${steps}<div class="card content">${body}</div></div></div>`;
}
function stepNav(m, step, primaryLabel, primaryAct) {
  const i = STEPS.findIndex(s => s[0] === step), prev = STEPS[i - 1], next = STEPS[i + 1];
  const nextHref = next ? `#learn-${m.id}-${next[0]}` : nextModuleHref(m);
  return `<div class="foot">${prev ? `<a class="btn" href="#learn-${m.id}-${prev[0]}">${ic("back")} ${prev[1]}</a>` : "<span></span>"}
    ${primaryAct ? `<button class="btn pri" data-act="${primaryAct}" data-href="${nextHref}">${primaryLabel} ${ic("next")}</button>` : `<a class="btn pri" href="${nextHref}">${next ? next[1] : "Next module"} ${ic("next")}</a>`}</div>`;
}
function nextModuleHref(m) { const all = mods(), i = all.indexOf(m), n = all.slice(i + 1).find(x => unlocked(x)); return n ? `#learn-${n.id}-lesson` : `#course-${m.pillar.id}`; }
function lessonView(m) {
  const figs = (m.figures || []).map(f => A.FIG[f] ? A.FIG[f]() : "").join("");
  let html = m.lesson_html;
  if (figs) { const k = html.indexOf("</p>"); html = k > 0 ? html.slice(0, k + 4) + figs + html.slice(k + 4) : figs + html; }
  const dn = stepDone(m, "lesson");
  return `<div class="objs"><h3>By the end you'll be able to</h3><ul>${m.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>
    <article class="lesson">${html}</article>${stepNav(m, "lesson", dn ? "Continue" : "Mark complete & continue", "lesson-done")}`;
}
function readView(m) {
  const mins = m.readings.filter(r => r.required).reduce((a, r) => a + r.minutes, 0);
  return `<h2>Readings</h2><p class="mut">${req(m).length} required (~${fmtMin(mins)}). Tick each one when you've read it with the "focus on" note in mind.</p>
    ${m.readings.map((r, i) => `<div class="rd"><input type="checkbox" class="ck" data-done="${m.id}:read:${i}" ${S.done[`${m.id}:read:${i}`] ? "checked" : ""} aria-label="Mark ${esc(r.title)} as read">
      <div><a href="${esc(r.url)}" target="_blank" rel="noopener" style="font-weight:700;font-size:16px">${esc(r.title)}</a>
      <div class="tg"><span class="chip ${r.required ? "partial" : ""}">${r.required ? "Required" : "Optional"}</span><span class="chip">${esc(r.type)}</span><span class="chip">${ic("clock", "ic")} ${r.minutes} min</span></div>
      <div class="mut">${esc(r.author)}</div><div style="font-size:15px;margin-top:4px"><b>Focus on:</b> ${esc(r.focus)}</div></div></div>`).join("")}
    ${stepNav(m, "read")}`;
}
let quiz = null;
function quizView(m) {
  const qs = S.quiz[m.id];
  if (!quiz || quiz.id !== m.id) {
    return `<div class="qhead">${ring(qs ? qs.best : 0, passed(m.id) ? "#34A853" : col(m.pillar), 76, qs ? "" : "?")}
      <div><h2>Graded quiz · ${m.quiz.length} questions</h2><p class="mut" style="margin:4px 0 0">Pass mark 80%. ${qs ? `Best ${Math.round(qs.best * 100)}% · ${qs.attempts.length} attempt${qs.attempts.length > 1 ? "s" : ""}` : "Already know this? Take it cold to test out."}</p></div></div>
      ${passed(m.id) ? `<div class="fb ok"><b>Passed.</b> ${unlockedNextText(m)}</div>` : ""}
      ${qs && qs.attempts.length > 1 ? `<p class="mut">History: ${qs.attempts.slice(-6).map(a => Math.round(a.score * 100) + "%").join(" → ")}</p>` : ""}
      <div class="foot"><a class="btn" href="#learn-${m.id}-read">${ic("back")} Readings</a><button class="btn pri" data-act="quiz-start">${qs ? "Retake quiz" : "Start quiz"} ${ic("next")}</button></div>`;
  }
  if (quiz.i >= m.quiz.length) {
    const sc = quiz.correct / m.quiz.length, ok = sc >= D.pass_mark;
    return `<div class="result">${ok ? A.spot.trophy() : A.spot.empty()}<h2>${Math.round(sc * 100)}%</h2>
      <p>${quiz.correct} of ${m.quiz.length} correct. ${ok ? "<b>You passed.</b> " + unlockedNextText(m) : "Not yet. Re-read the parts you missed and try again."}</p>
      ${quiz.missed.length ? `<p class="mut">${quiz.missed.length} missed question${quiz.missed.length > 1 ? "s" : ""} added to Review.</p>` : ""}
      <div class="foot" style="justify-content:center"><button class="btn" data-act="quiz-start">Retake</button>${ok ? `<a class="btn pri" href="#learn-${m.id}-ex">Exercises ${ic("next")}</a>` : `<a class="btn pri" href="#learn-${m.id}-lesson">Review lesson</a>`}</div></div>`;
  }
  const q = m.quiz[quiz.i], a = quiz.answered;
  return `<div class="qprog">${m.quiz.map((_, j) => `<i class="${j < quiz.i ? (quiz.res[j] ? "ok" : "no") : j === quiz.i ? "cur" : ""}"></i>`).join("")}</div>
    <div class="mut" style="font-weight:700">Question ${quiz.i + 1} of ${m.quiz.length}</div><p class="qtext">${esc(q.q)}</p>
    ${q.options.map((o, j) => `<button class="opt ${a == null ? "" : j === q.answer ? "right" : j === a ? "wrong" : ""}" data-ans="${j}" ${a != null ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${esc(o)}</span></button>`).join("")}
    ${a != null ? `<div class="fb ${a === q.answer ? "ok" : "no"}"><b>${a === q.answer ? "Correct." : "Not quite."}</b> ${esc(q.explain)}</div>
    <div class="foot"><span></span><button class="btn pri" data-act="quiz-next">${quiz.i + 1 < m.quiz.length ? "Next question" : "See result"} ${ic("next")}</button></div>` : ""}`;
}
function unlockedNextText(m) { const all = mods(), n = all[all.indexOf(m) + 1]; return n && n.pillar === m.pillar ? `Module ${m.idx + 2} is unlocked.` : m.idx === m.pillar.modules.length - 1 ? "The capstone is unlocked." : ""; }
function exView(m) {
  return `<h2>Exercises</h2><p class="mut">Core exercises count toward completion; stretch ones are for extra depth. Link your work so you can find it later.</p>
    ${m.exercises.map((e, i) => `<div class="card ex"><div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><h3>${esc(e.title)}</h3><span class="chip ${e.level === "core" ? "partial" : ""}">${e.level}</span></div>
      <p>${esc(e.task)}</p><p class="mut"><b>Deliverable:</b> ${esc(e.deliverable)}</p><div class="mut"><b>Done when</b><ul>${e.acceptance.map(a => `<li>${esc(a)}</li>`).join("")}</ul></div>
      <input type="url" placeholder="Link to your work (repo, doc, post)" data-link="${m.id}:${i}" value="${esc(S.links[`${m.id}:${i}`])}">
      <label class="row"><input type="checkbox" class="ck" data-done="${m.id}:ex:${i}" ${S.done[`${m.id}:ex:${i}`] ? "checked" : ""}><span>I've met every "done when" point</span></label></div>`).join("")}
    ${stepNav(m, "ex")}`;
}
function reflView(m) {
  return `<h2>Reflect</h2>${(m.reflection || []).map(r => `<p style="font-size:17px;font-weight:600">${esc(r)}</p>`).join("")}
    <textarea data-refl="${m.id}" placeholder="One honest paragraph tied to your real work (40+ characters to complete)">${esc(S.refl[m.id])}</textarea>
    <h3 style="margin-top:20px">Notes</h3><p class="mut">Takeaways from the readings, questions, ideas for a blog post.</p>
    <textarea data-notes="${m.id}" placeholder="Three bullets per reading">${esc(S.notes[m.id])}</textarea>
    <p class="mut">Saved automatically.</p>${stepNav(m, "reflect")}`;
}
function vCap(pid) {
  const p = pil(pid); if (!p) return notFound();
  if (!capOpen(p)) return `<a class="crumb" href="#course-${pid}">${ic("back")} ${esc(p.title)}</a><div class="card empty"><h2>Capstone locked</h2><p class="mut">Pass every module quiz in this course first.</p></div>`;
  return `<a class="crumb" href="#course-${pid}">${ic("back")} ${esc(p.title)}</a>
    <section class="card chero"><div class="cv">${A.cover(pid)}</div><div class="txt" style="--cbg:${A.PAL[pid].dark}"><span class="chip" style="background:rgba(255,255,255,.18);color:#fff">Capstone</span><h1 style="margin-top:10px">${esc(p.capstone.title)}</h1><p>${esc(p.capstone.brief)}</p></div></section>
    <div class="sec"><h2>Deliverables</h2><span class="mut">${Math.round(capPct(p) * 100)}%</span></div><div class="card pad">
    ${p.capstone.deliverables.map((d, i) => `<label class="row"><input type="checkbox" class="ck" data-cap="${pid}:${i}" ${S.caps[`${pid}:${i}`] ? "checked" : ""}><span>${esc(d)}</span></label>`).join("")}
    <input type="url" placeholder="Link to your write-up" data-caplink="${pid}" value="${esc(S.capLinks[pid])}" style="margin-top:8px"></div>
    <div class="sec"><h2>Graded on</h2></div><ul class="card learn">${p.capstone.rubric.map(r => `<li>${ic("star")}<span>${esc(r)}</span></li>`).join("")}</ul>
    ${courseDone(p) ? `<p><a class="btn pri" href="#cert-${pid}">${ic("award")} View certificate</a></p>` : `<p class="mut">Finish every module (all five steps) and every deliverable to earn the certificate.</p>`}`;
}
function vCert(pid) {
  const p = pil(pid); if (!p) return notFound();
  if (!courseDone(p)) return `<a class="crumb" href="#course-${pid}">${ic("back")} ${esc(p.title)}</a><div class="card empty">${A.spot.seal(pid)}<h2>Certificate not earned yet</h2><p class="mut">${Math.round(coursePct(p) * 100)}% of the course done. Finish every module and the capstone.</p></div>`;
  const when = Math.max(...Object.entries(S.caps).filter(([k]) => k.startsWith(pid + ":")).map(([, v]) => +v || Date.now()), Date.now() - 1);
  return `<a class="crumb" href="#progress">${ic("back")} Progress</a><div class="cert" style="--c:${col(p)}">
    <div class="mut" style="font-weight:700;letter-spacing:.02em">AI Platform Mastery · Certificate of completion</div>${A.spot.seal(pid)}
    <div class="mut">This certifies that</div><div class="name">${esc(S.name)}</div><div class="mut">completed every module, quiz, exercise and the capstone of</div>
    <h1>${esc(p.title)}</h1><div class="mut">${p.modules.length} modules · ~${p.modules.reduce((a, m) => a + m.hours, 0)} hours · ${new Date(when).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</div></div>`;
}
let rv = null;
function reviewItems() { return Object.keys(S.review).map(k => { const [mid, qi] = k.split(":"), m = findMod(mid); return m && m.quiz[+qi] ? { k, m, q: m.quiz[+qi] } : null; }).filter(Boolean); }
function vReview() {
  const items = reviewItems();
  if (!items.length) return `<h1>Review</h1><div class="card empty" style="margin-top:16px">${A.spot.empty()}<h2>Nothing to review</h2><p class="mut">Questions you miss in quizzes land here until you answer them right twice in a row.</p></div>`;
  if (!rv || !S.review[rv.k]) rv = { k: items[0].k, a: null };
  const it = items.find(x => x.k === rv.k), q = it.q, a = rv.a;
  return `<h1>Review</h1><p class="mut">${items.length} question${items.length > 1 ? "s" : ""} left · ${esc(it.m.title)}</p>
    <div class="card flash" style="border-top:6px solid ${col(it.m.pillar)}"><p class="qtext">${esc(q.q)}</p>
    ${q.options.map((o, j) => `<button class="opt ${a == null ? "" : j === q.answer ? "right" : j === a ? "wrong" : ""}" data-rans="${j}" ${a != null ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${esc(o)}</span></button>`).join("")}
    ${a != null ? `<div class="fb ${a === q.answer ? "ok" : "no"}">${esc(q.explain)} ${a === q.answer ? `<b>(${S.review[rv.k].n}/2)</b>` : ""}</div><div class="foot"><a class="btn" href="#learn-${it.m.id}-lesson">Open lesson</a><button class="btn pri" data-act="rv-next">Next ${ic("next")}</button></div>` : ""}</div>`;
}
function vProgress() {
  const all = mods(), tm = totalMin();
  const days = []; const d = new Date(); d.setDate(d.getDate() - 7 * 16 + 1 + ((7 - ((d.getDay() + 6) % 7) - 1)));
  const start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 7 * 15);
  for (let i = 0; i < 16 * 7; i++) { const x = new Date(start); x.setDate(start.getDate() + i); const v = S.activity[dayKey(x)] || 0; days.push(x > new Date() ? -1 : v); }
  const lvl = v => v < 0 ? "x" : v === 0 ? 0 : v < 15 ? 1 : v < 45 ? 2 : v < 90 ? 3 : 4;
  let h = `<h1>Progress</h1><p class="mut">Started ${new Date(S.started).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
    <div class="kpis" style="margin-top:16px">
      <div class="card kpi">${ring(overall(), "var(--brand)", 60)}<div><b>${all.filter(modDone).length}/${all.length}</b><span class="mut">modules complete</span></div></div>
      <div class="card kpi">${A.spot.flame(streak() > 0)}<div><b>${streak()}</b><span class="mut">day streak</span></div></div>
      <div class="card kpi"><div><b>${fmtMin(tm)}</b><span class="mut">active study time</span></div></div>
      <div class="card kpi"><div><b>${avgQuiz()}%</b><span class="mut">average best quiz</span></div></div></div>
    <div class="sec"><h2>Activity</h2><span class="mut">last 16 weeks</span></div><div class="card"><div class="heat" aria-label="Activity heatmap">${days.map(v => `<i data-l="${lvl(v)}" style="${v < 0 ? "visibility:hidden" : ""}" title="${v > 0 ? fmtMin(v) : ""}"></i>`).join("")}</div></div>
    <div class="sec"><h2>Courses</h2></div><div class="card">${D.pillars.map(p => `<a class="prow" href="#course-${p.id}"><span class="thumb">${A.cover(p.id)}</span><span><b>${esc(p.title)}</b>${bar(coursePct(p), col(p))}</span><span class="mut">${Math.round(coursePct(p) * 100)}%</span></a>`).join("")}</div>
    <div class="sec"><h2>Certificates</h2></div><div class="badges">${D.pillars.map(p => `<a class="card badge ${courseDone(p) ? "" : "off"}" href="#cert-${p.id}" style="text-decoration:none;color:inherit">${A.spot.seal(p.id)}<b style="font-size:14px">${esc(p.title)}</b></a>`).join("")}</div>
    <div class="sec"><h2>Badges</h2><span class="mut">${Object.keys(S.badges).length}/${BADGES.length}</span></div><div class="badges">${BADGES.map(([id, label]) => `<div class="card badge ${S.badges[id] ? "" : "off"}"><span style="display:block;width:44px;height:44px;margin:0 auto 6px;color:${S.badges[id] ? "#F29900" : "var(--mut)"}">${ic("award", "")}</span><b style="font-size:14px">${label}</b></div>`).join("")}</div>`;
  return h;
}
function avgQuiz() { const v = Object.values(S.quiz); return v.length ? Math.round(v.reduce((a, q) => a + q.best, 0) / v.length * 100) : 0; }
function vSettings() {
  return `<h1>Settings</h1><div class="card pad" style="margin-top:16px;display:grid;gap:14px">
    <label><b>Your name</b> (shown on certificates)<input type="text" data-set="name" value="${esc(S.name)}"></label>
    <label><b>Weekly goal</b><select data-set="goalMin">${[120, 180, 240, 360, 480, 600].map(v => `<option value="${v}" ${S.goalMin === v ? "selected" : ""}>${v / 60} hours a week</option>`).join("")}</select></label></div>
    <div class="sec"><h2>Your progress data</h2></div><div class="card pad">
    <p style="margin-top:0">Progress is saved on this device${navigator.storage?.persist ? " in persistent storage" : ""}. Back it up regularly, and use it to move to another device.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn pri" data-act="export">Copy backup</button><button class="btn" data-act="download">Download backup</button><label class="btn" for="imp">Restore from file</label><input id="imp" type="file" accept=".json,application/json,text/plain" hidden></div>
    <textarea id="exp" readonly hidden style="margin-top:12px"></textarea>
    <h3 style="margin-top:18px">Restore by pasting</h3><textarea id="imptxt" placeholder="Paste a backup here"></textarea><p><button class="btn" data-act="import-text">Restore pasted backup</button></p>
    <p class="mut" id="msg" role="status"></p></div>
    <div class="sec"><h2>Danger zone</h2></div><div class="card pad"><button class="btn" data-act="reset" style="color:var(--bad)">Reset all progress</button></div>`;
}
const notFound = () => `<div class="card empty">${A.spot.empty()}<h2>Page not found</h2><a class="btn pri" href="#home">Home</a></div>`;

/* ---------------- install prompt ---------------- */
let deferredInstall = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; if (parse().view === "home") render(); });
function installCard() {
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone || S.hideInstall) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (deferredInstall) return `<div class="card install">${ic("home")}<p><b>Install the app</b> for offline learning and a home-screen icon.</p><button class="btn pri" data-act="install">Install</button><button class="btn ghost" data-act="hide-install" aria-label="Dismiss">✕</button></div>`;
  if (ios && "serviceWorker" in navigator) return `<div class="card install">${ic("home")}<p><b>Install on iPhone:</b> tap Share, then "Add to Home Screen".</p><button class="btn ghost" data-act="hide-install" aria-label="Dismiss">✕</button></div>`;
  return "";
}

/* ---------------- router ---------------- */
function parse() {
  const h = location.hash.replace(/^#/, "") || "home";
  let m;
  if ((m = h.match(/^learn-(p\dm\d+)-(lesson|read|quiz|ex|reflect)$/))) return { view: "learn", mid: m[1], step: m[2] };
  if ((m = h.match(/^(course|cap|cert)-(p\d)$/))) return { view: m[1], pid: m[2] };
  return { view: ["home", "courses", "review", "progress", "settings"].includes(h) ? h : "home" };
}
function render() {
  const r = parse(), app = $("#app");
  const tab = { home: "home", courses: "courses", course: "courses", learn: "courses", cap: "courses", cert: "progress", review: "review", progress: "progress", settings: "progress" }[r.view];
  document.querySelectorAll("[data-tab]").forEach(a => a.classList.toggle("on", a.dataset.tab === tab));
  if (r.view !== "learn" || (quiz && quiz.id !== r.mid)) quiz = null;
  app.innerHTML = r.view === "home" ? vHome() : r.view === "courses" ? vCourses() : r.view === "course" ? vCourse(r.pid) : r.view === "learn" ? vLearn(r.mid, r.step)
    : r.view === "cap" ? vCap(r.pid) : r.view === "cert" ? vCert(r.pid) : r.view === "review" ? vReview() : r.view === "progress" ? vProgress() : vSettings();
  $("#streak-n").textContent = streak();
  $("#streak-f").innerHTML = A.spot.flame(streak() > 0);
  $("#avatar").textContent = (S.name || "A").trim()[0]?.toUpperCase() || "A";
  $(".steps a.on")?.scrollIntoView({ inline: "center", block: "nearest" });
  document.title = r.view === "learn" ? `${findMod(r.mid)?.title || ""} · AI Platform Mastery` : "AI Platform Mastery";
}
let prevHash = location.hash;
addEventListener("hashchange", () => { const a = prevHash.split("-").slice(0, 2).join("-"), b = location.hash.split("-").slice(0, 2).join("-"); prevHash = location.hash; render(); if (a !== b || !location.hash.startsWith("#learn")) scrollTo(0, 0); else $(".content")?.scrollIntoView({ block: "start" }); });

/* ---------------- events ---------------- */
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-act],[data-ans],[data-rans]"); if (!t) return;
  const r = parse(), m = r.mid && findMod(r.mid);
  if (t.dataset.ans != null && m && quiz) {
    quiz.answered = +t.dataset.ans; const q = m.quiz[quiz.i], ok = quiz.answered === q.answer;
    quiz.res[quiz.i] = ok; if (ok) quiz.correct++; else { quiz.missed.push(quiz.i); S.review[`${m.id}:${quiz.i}`] = { n: 0 }; }
    touch(); save(); render(); return;
  }
  if (t.dataset.rans != null && rv) {
    rv.a = +t.dataset.rans; const it = reviewItems().find(x => x.k === rv.k);
    S.review[rv.k].n = rv.a === it.q.answer ? S.review[rv.k].n + 1 : 0; touch(); save(); render(); return;
  }
  const act = t.dataset.act;
  if (act === "lesson-done") { mark(`${m.id}:lesson`); checkBadges(); location.hash = t.dataset.href; }
  else if (act === "quiz-start") { quiz = { id: m.id, i: 0, correct: 0, answered: null, res: [], missed: [] }; render(); }
  else if (act === "quiz-next") {
    quiz.i++; quiz.answered = null;
    if (quiz.i >= m.quiz.length) {
      const sc = quiz.correct / m.quiz.length, rec = S.quiz[m.id] || (S.quiz[m.id] = { best: 0, attempts: [] }), was = passed(m.id);
      rec.attempts.push({ score: sc, at: Date.now() }); rec.best = Math.max(rec.best, sc); save();
      if (sc >= D.pass_mark && !was) { confetti(); toast("Quiz passed! Next module unlocked."); }
      checkBadges();
    }
    render(); $(".content")?.scrollIntoView({ block: "start" });
  }
  else if (act === "rv-next") {
    if (S.review[rv.k]?.n >= 2) { delete S.review[rv.k]; toast("Mastered — removed from review"); }
    const items = reviewItems(), i = items.findIndex(x => x.k === rv.k); rv = items.length ? { k: items[(i + 1) % items.length].k, a: null } : null; save(); render();
  }
  else if (act === "export") { const txt = JSON.stringify(S), box = $("#exp"); box.hidden = false; box.value = txt; box.select();
    try { await navigator.clipboard.writeText(txt); $("#msg").textContent = "Backup copied. Paste it somewhere safe."; } catch (err) { $("#msg").textContent = "Select the text above and copy it."; } }
  else if (act === "download") { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" })); a.download = `ai-platform-mastery-backup-${today()}.json`; a.click(); }
  else if (act === "import-text") restore($("#imptxt").value);
  else if (act === "reset") { if (t.dataset.confirm) { S = blank(); save(); render(); toast("Progress reset"); } else { t.dataset.confirm = 1; t.textContent = "Tap again to erase everything"; } }
  else if (act === "install" && deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; render(); }
  else if (act === "hide-install") { S.hideInstall = true; save(); render(); }
});
function restore(txt) { try { const v = JSON.parse(txt); if (!v || (v.v !== 2 && !v.modules)) throw 0; S = v.v === 2 ? Object.assign(blank(), v) : (() => { const s = blank(); migrate(v, s); return s; })(); save(); $("#msg").textContent = "Progress restored."; render(); } catch (e) { $("#msg").textContent = "That isn't a valid backup."; } }
document.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "imp" && t.files[0]) { t.files[0].text().then(restore); return; }
  if (t.dataset.done) { mark(t.dataset.done, t.checked); checkBadges(); const r = parse(); if (r.view === "learn") { const m = findMod(r.mid); if (stepDone(m, r.step) && t.checked) toast(`${STEPS.find(s => s[0] === r.step)[1]} complete`); } render(); }
  else if (t.dataset.cap) { if (t.checked) S.caps[t.dataset.cap] = Date.now(); else delete S.caps[t.dataset.cap]; touch(); save(); checkBadges(); render(); }
  else if (t.dataset.set) { S[t.dataset.set] = t.dataset.set === "goalMin" ? +t.value : t.value; save(); $("#avatar").textContent = (S.name || "A")[0].toUpperCase(); }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.refl) { const was = stepDone(findMod(t.dataset.refl), "reflect"); S.refl[t.dataset.refl] = t.value; touch(); save(); if (!was && stepDone(findMod(t.dataset.refl), "reflect")) { toast("Reflection complete"); checkBadges(); } }
  else if (t.dataset.notes) { S.notes[t.dataset.notes] = t.value; save(); }
  else if (t.dataset.link) { S.links[t.dataset.link] = t.value; save(); }
  else if (t.dataset.caplink) { S.capLinks[t.dataset.caplink] = t.value; save(); }
  else if (t.dataset.set === "name") { S.name = t.value; save(); }
});

/* ---------------- boot ---------------- */
(async function init() {
  const raw = $("#curriculum-data")?.textContent.trim() || "";
  try { D = raw.startsWith("{") ? JSON.parse(raw) : await (await fetch("data/curriculum.json")).json(); }
  catch (e) { $("#app").innerHTML = `<div class="card empty"><h2>Couldn't load the course content</h2><p class="mut">Check your connection and reload.</p></div>`; return; }
  S = load(); save();
  try { if (navigator.storage?.persist) navigator.storage.persist(); } catch (e) {}
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !raw.startsWith("{")) navigator.serviceWorker.register("sw.js").catch(() => {});
  render(); checkBadges();
})();
}
