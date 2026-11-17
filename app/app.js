/* AI Platform Mastery course app (v3). Vanilla JS, no build step.
   Routes are plain hashes: #home #learning #course-p1 #learn-p1m1-quiz #cap-p1 #cert-p1 #review #progress #settings */
{
const KEY = "apm-v2", OLD_KEY = "apm-progress-v1";
const A = window.ART, ic = A.icon;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => dayKey(new Date());
const fmtMin = m => m < 60 ? `${Math.round(m)} min` : `${(m / 60).toFixed(m < 600 ? 1 : 0)} h`;
const STEPS = [["lesson", "Lesson", "lesson", "Reading"], ["read", "Readings", "read", "Reading list"], ["quiz", "Graded quiz", "quiz", "Graded assignment"], ["ex", "Exercises", "ex", "Hands-on project"], ["reflect", "Reflection", "reflect", "Discussion prompt"]];
const LEVEL = { strong: "Refresher", partial: "Intermediate", gap: "Advanced" };
const SKILLS = {
  p1: ["ML system design", "Data contracts", "Feature stores", "Release gating", "Drift monitoring", "SLOs"],
  p2: ["Platform engineering", "Kubernetes", "GPU scheduling", "Terraform", "GitOps", "Policy as code"],
  p3: ["LLM serving", "vLLM", "KV cache", "Quantization", "Benchmarking", "GPU cost modelling"],
  p4: ["LLM evaluation", "Error analysis", "LLM-as-judge", "Agent evals", "OpenTelemetry", "Multilingual evals"],
  p5: ["AI governance", "NIST AI RMF", "EU AI Act", "LLM security", "Threat modelling", "Model cards"],
  p6: ["Technical writing", "Public speaking", "Open source", "Staff-level leadership"],
};
const CI = { p1: "pipeline", p2: "server", p3: "chip", p4: "evals", p5: "shield", p6: "megaphone" };
const bi = (n, size = 48, cls = "bi", off = false) => `<img class="${cls}${off ? " off" : ""}" src="img/badges/${n}.png" width="${size}" height="${size}" alt="" loading="lazy">`;
let D, S, mem = null;

/* ---------- state ---------- */
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
  }
  (o.log || []).forEach(d => s.activity[d] = (s.activity[d] || 0) + 1);
}
function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function touch() { const t = today(); S.activity[t] = S.activity[t] || 0.01; }
function mark(key, on = true) { if (on) S.done[key] = S.done[key] || Date.now(); else delete S.done[key]; touch(); save(); }

/* ---------- curriculum helpers ---------- */
let MODS = [];
const mods = () => MODS;
const findMod = id => MODS.find(m => m.id === id);
const pil = id => D.pillars.find(p => p.id === id);
const passed = id => (S.quiz[id]?.best || 0) >= D.pass_mark;
const req = m => m.readings.map((r, i) => [r, i]).filter(([r]) => r.required);
const core = m => m.exercises.map((e, i) => [e, i]).filter(([e]) => e.level === "core");
const hours = p => p.modules.reduce((a, m) => a + m.hours, 0);
const col = p => A.PAL[p.id].main;
function stepDone(m, step) {
  if (step === "lesson") return !!S.done[`${m.id}:lesson`];
  if (step === "read") return req(m).every(([, i]) => S.done[`${m.id}:read:${i}`]);
  if (step === "quiz") return passed(m.id);
  if (step === "ex") return core(m).every(([, i]) => S.done[`${m.id}:ex:${i}`]);
  if (step === "reflect") return (S.refl[m.id] || "").trim().length >= 40;
}
function modPct(m) {
  const r = req(m), c = core(m);
  return ((S.done[`${m.id}:lesson`] ? 1 : 0) + (r.length ? r.filter(([, i]) => S.done[`${m.id}:read:${i}`]).length / r.length : 1)
    + (passed(m.id) ? 1 : 0) + (c.length ? c.filter(([, i]) => S.done[`${m.id}:ex:${i}`]).length / c.length : 1) + (stepDone(m, "reflect") ? 1 : 0)) / 5;
}
const modDone = m => modPct(m) >= 0.999;
function unlocked(m) {
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
const courseStarted = p => coursePct(p) > 0;
const courseOpen = p => unlocked(p.modules[0]);
const overall = () => D.pillars.reduce((a, p) => a + coursePct(p) * (p.modules.length + 1), 0) / D.pillars.reduce((a, p) => a + p.modules.length + 1, 0);
const nextStep = m => STEPS.map(s => s[0]).find(s => !stepDone(m, s)) || "lesson";
function upNext() {
  if (S.last) { const m = findMod(S.last.mid); if (m && unlocked(m) && !modDone(m)) return { m, step: nextStep(m) }; }
  const m = MODS.find(m => unlocked(m) && !modDone(m) && !m.pillar.parallel) || MODS.find(m => unlocked(m) && !modDone(m));
  return m ? { m, step: nextStep(m) } : null;
}
function streak() { let n = 0; const d = new Date(); if (!S.activity[dayKey(d)]) d.setDate(d.getDate() - 1); while (S.activity[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); } return n; }
function weekDays() { const d = new Date(), dow = (d.getDay() + 6) % 7, out = []; for (let i = 0; i < 7; i++) { const x = new Date(d); x.setDate(d.getDate() - dow + i); out.push({ k: dayKey(x), on: !!S.activity[dayKey(x)], today: i === dow, future: i > dow }); } return out; }
const weekMin = () => weekDays().reduce((a, d) => a + (S.activity[d.k] || 0), 0);
const totalMin = () => Object.values(S.activity).reduce((a, b) => a + b, 0);
const lessonMin = m => Math.max(6, Math.round(m.lesson_html.replace(/<[^>]+>/g, "").split(/\s+/).length / 200));
function stepMeta(m, k) {
  if (k === "lesson") return `${lessonMin(m)} min`;
  if (k === "read") return `${fmtMin(req(m).reduce((a, [r]) => a + r.minutes, 0))} · ${req(m).length} required`;
  if (k === "quiz") return `${m.quiz.length} questions · 80% to pass`;
  if (k === "ex") return `${core(m).length} core${m.exercises.length > core(m).length ? ` + ${m.exercises.length - core(m).length} stretch` : ""}`;
  return "10 min";
}

/* ---------- time tracking ---------- */
let lastAct = Date.now();
["pointerdown", "keydown", "scroll", "touchstart"].forEach(e => addEventListener(e, () => lastAct = Date.now(), { passive: true }));
setInterval(() => {
  if (document.visibilityState !== "visible" || Date.now() - lastAct > 120000 || !S) return;
  const t = today(); S.activity[t] = (S.activity[t] || 0) + 0.25;
  const r = parse(); if (r.view === "learn") S.modTime[r.mid] = (S.modTime[r.mid] || 0) + 0.25;
  save();
}, 15000);

/* ---------- badges ---------- */
const BADGES = [
  ["first-lesson", "First lesson", "rocket", () => Object.keys(S.done).some(k => k.endsWith(":lesson"))],
  ["first-quiz", "First quiz passed", "cap", () => MODS.some(m => passed(m.id))],
  ["streak-3", "3-day streak", "calendar-check", () => streak() >= 3], ["streak-7", "7-day streak", "calendar-star", () => streak() >= 7], ["streak-30", "30-day streak", "calendar-medal", () => streak() >= 30],
  ["hours-10", "10 hours", "hourglass", () => totalMin() >= 600], ["hours-50", "50 hours", "stopwatch", () => totalMin() >= 3000],
  ["mods-5", "5 modules", "books", () => MODS.filter(modDone).length >= 5], ["mods-all", "All 25 modules", "trophy", () => MODS.every(modDone)],
  ["perfect", "100% on a quiz", "target", () => Object.values(S.quiz).some(q => q.best >= 1)],
  ...["p1", "p2", "p3", "p4", "p5", "p6"].map(id => [`course-${id}`, `Course ${id.slice(1)} complete`, CI[id], () => courseDone(pil(id))]),
];
function checkBadges() {
  const fresh = [];
  for (const [id, label, , test] of BADGES) if (!S.badges[id] && test()) { S.badges[id] = Date.now(); fresh.push(label); }
  if (fresh.length) { save(); toast("Badge earned: " + fresh.join(", ")); confetti(); }
}

/* ---------- UI helpers ---------- */
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800); }
function confetti() {
  return;
  const c = document.createElement("div"); c.className = "confetti";
  const cols = ["#0056D2", "#EA4335", "#FBBC04", "#34A853", "#7B5CE0", "#E8710A"];
  c.innerHTML = Array.from({ length: 70 }, () => `<i style="left:${Math.random() * 100}%;background:${cols[Math.random() * 6 | 0]};animation-delay:${Math.random() * .5}s;animation-duration:${1.2 + Math.random()}s"></i>`).join("");
  document.body.append(c); setTimeout(() => c.remove(), 2600);
}
const ring = (p, c, s = 64, label) => `<div class="ring" style="--p:${Math.round(p * 100)};--c:${c};--s:${s}px"><b>${label ?? Math.round(p * 100) + "%"}</b></div>`;
const bar = (p, c) => `<div class="bar" style="--c:${c}"><i style="width:${Math.round(p * 100)}%"></i></div>`;
const photo = (pid, size = "sm", eager) => `<div class="ph">${A.cover(pid)}<img src="img/${pid}${size === "sm" ? "-sm" : ""}.jpg" alt="" ${eager ? "" : 'loading="lazy"'} onerror="this.remove()"></div>`;
const prov = p => `<div class="prov">${bi(CI[p.id], 22, "pi")}Course ${p.order}</div>`;
const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const stepIc = k => STEPS.find(s => s[0] === k)[2];

/* ---------- views ---------- */
function vHome() {
  const n = upNext(), wk = weekMin(), pct = overall();
  let h = `<section class="hero"><div class="ph"><img src="img/hero.jpg" alt="" onerror="this.remove()"></div><div class="wrap">
    <div class="kick">${greet()}, ${esc(S.name)}</div><h1>AI Platform Mastery</h1>
    <p>${D.pillars.length} courses · ${MODS.length} modules · about ${Math.round(MODS.reduce((a, m) => a + m.hours, 0) / 10) * 10} hours. Production ML, platforms, LLM inference, evals and AI governance.</p>
    <div class="hbar"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px"><span>Overall progress</span><b>${Math.round(pct * 100)}%</b></div>${bar(pct)}</div>
    <div class="row">${n ? `<a class="btn wh lg" href="#learn-${n.m.id}-${n.step}">${pct > 0 ? "Resume" : "Start course 1"} ${ic("next")}</a>` : ""}<a class="btn txt" style="color:#fff" href="#learning">All courses</a></div></div></section>`;
  h += `<div class="wrap">${installCard()}<div class="dash" style="margin-top:28px"><div>`;
  if (n) {
    const p = n.m.pillar, st = STEPS.find(s => s[0] === n.step);
    h += `<h2 style="margin-bottom:14px">Continue learning</h2><div class="card resume">${photo(p.id, "lg")}<div class="bd">
      <span class="tag">${esc(p.title)}</span><div class="mnum">Module ${n.m.idx + 1} of ${p.modules.length}</div><h3>${esc(n.m.title)}</h3>
      <div style="display:flex;gap:10px;align-items:center;margin:12px 0 4px">${bar(modPct(n.m), col(p))}<span class="sm" style="white-space:nowrap">${Math.round(modPct(n.m) * 100)}%</span></div>
      <div class="nextitem">${ic(st[2])}<div><div class="xs mut">Next up · ${st[3]}</div><b>${st[1]}</b> <span class="mut sm">· ${stepMeta(n.m, n.step)}</span></div></div>
      <a class="btn pri" href="#learn-${n.m.id}-${n.step}">Resume ${ic("next")}</a></div></div>`;
  }
  const inprog = D.pillars.filter(p => courseStarted(p) && !courseDone(p));
  h += `<div class="sec"><h2>Courses</h2><a href="#learning">See all</a></div><div class="grid">${D.pillars.map(courseCard).join("")}</div>`;
  const rv = Object.keys(S.review).length;
  h += `</div><aside class="rail">
    <div class="card"><h3 style="margin-bottom:14px">Weekly goal</h3><div class="goalrow">${ring(Math.min(1, wk / S.goalMin), "var(--blue)", 72)}<div><b style="font-size:20px">${fmtMin(wk)}</b> <span class="mut">of ${fmtMin(S.goalMin)}</span><div class="sm mut">${wk >= S.goalMin ? "Goal met" : `${fmtMin(Math.max(0, S.goalMin - wk))} left this week`}</div></div></div>
      <div class="week">${weekDays().map((d, i) => `<div><span>${"MTWTFSS"[i]}</span><i class="${d.on ? "on" : ""} ${d.today ? "today" : ""}">${d.on ? ic("check", "ic wk") : ""}</i></div>`).join("")}</div></div>
    <div class="card"><div class="stats3"><div>${bi("calendar-check", 28, "bi", !streak())}<b>${streak()}</b><span>day streak</span></div><div>${bi("cap", 28)}<b>${MODS.filter(m => passed(m.id)).length}</b><span>quizzes passed</span></div><div>${bi("trophy", 28)}<b>${Object.keys(S.badges).length}</b><span>badges</span></div></div></div>
    ${rv ? `<a class="card" href="#review" style="display:flex;gap:14px;align-items:center;color:inherit;text-decoration:none"><span style="color:var(--blue)">${ic("review")}</span><div><b>${rv} question${rv > 1 ? "s" : ""} to review</b><div class="sm mut">From quizzes you took</div></div></a>` : ""}
  </aside></div>${footer()}</div>`;
  return h;
}
function courseCard(p) {
  const pc = coursePct(p), open = courseOpen(p);
  return `<a class="card ccard" href="#course-${p.id}"><div class="ph" style="aspect-ratio:16/9">${A.cover(p.id)}<img src="img/${p.id}-sm.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="badge-lvl">${p.parallel ? "Runs in parallel" : LEVEL[p.status]}</span>${courseDone(p) ? `<span class="badge-done">Completed</span>` : ""}</div>
    <div class="bd">${prov(p)}<h3>${esc(p.title)}</h3><div class="skills"><b>Skills you'll gain:</b> ${SKILLS[p.id].join(", ")}</div>
    ${pc > 0 ? `<div style="margin-top:8px">${bar(pc, col(p))}<div class="xs mut" style="margin-top:4px">${Math.round(pc * 100)}% complete</div></div>` : ""}
    <div class="cmeta">${p.modules.length} modules · ~${hours(p)} h${open ? "" : ` · <span class="lk">${ic("lock", "ic xs-ic")} Locked</span>`}</div></div></a>`;
}
let seg = "progress";
function vLearning() {
  const groups = { progress: D.pillars.filter(p => courseOpen(p) && !courseDone(p)), next: D.pillars.filter(p => !courseOpen(p)), done: D.pillars.filter(courseDone) };
  const list = groups[seg];
  return `<div class="wrap" style="padding-top:28px"><h1>My Learning</h1><p class="mut">Order: ${D.pillars.filter(p => !p.parallel).map(p => "Course " + p.order).join(", ")}. Course 6 runs alongside the others.</p>
    <div class="seg" role="tablist">${[["progress", "In progress"], ["next", "Up next"], ["done", "Completed"]].map(([k, l]) => `<button role="tab" class="${seg === k ? "on" : ""}" data-seg="${k}">${l} (${groups[k].length})</button>`).join("")}</div>
    ${list.length ? list.map(p => { const pc = coursePct(p), m = p.modules.find(x => unlocked(x) && !modDone(x));
      return `<a class="card lrow" href="#course-${p.id}">${photo(p.id)}<div>${prov(p)}<h3 style="margin:4px 0">${esc(p.title)}</h3><div class="sm mut">${m ? `Next: Module ${m.idx + 1} · ${esc(m.title)}` : courseDone(p) ? "Certificate earned" : "Pass the previous course to unlock"}</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:10px;max-width:420px">${bar(pc, col(p))}<span class="xs mut">${Math.round(pc * 100)}%</span></div></div>
        <div class="act">${courseDone(p) ? `<span class="btn" data-href="#cert-${p.id}">View certificate</span>` : m ? `<span class="btn pri" data-href="#learn-${m.id}-${nextStep(m)}">${pc > 0 ? "Resume" : "Start"}</span>` : `<span class="chip">${ic("lock", "ic")} Locked</span>`}</div></a>`; }).join("")
      : `<div class="card empty">${bi("books", 96, "bi big")}<h3>Nothing here yet</h3><p class="mut">${seg === "done" ? "Finish every module and the capstone of a course to complete it." : "All courses are open."}</p></div>`}
    ${footer()}</div>`;
}
function vCourse(pid) {
  const p = pil(pid); if (!p) return notFound();
  const pc = coursePct(p), n = p.modules.find(m => unlocked(m) && !modDone(m)), lockedC = !courseOpen(p);
  let h = `<section class="chead"><div class="wrap"><div>
    <div class="crumbs"><a href="#home">Home</a>${ic("next")}<a href="#learning">My Learning</a>${ic("next")}<span>Course ${p.order}</span></div>
    <h1>${esc(p.title)}</h1><p class="lead">${esc(p.goal)}</p>
    <div class="by">${bi(CI[p.id], 32)}<span>${p.modules.reduce((a, m) => a + m.readings.length, 0)} readings · ${p.modules.reduce((a, m) => a + m.exercises.length, 0)} exercises · 1 capstone</span></div>
    <div class="ctas">${lockedC ? `<span class="btn lg" style="pointer-events:none;opacity:.7">${ic("lock")} Unlocks after the previous course</span>` : n ? `<a class="btn pri lg" href="#learn-${n.id}-${nextStep(n)}">${pc > 0 ? "Resume course" : "Start course"}</a>` : courseDone(p) ? `<a class="btn pri lg" href="#cert-${p.id}">View certificate</a>` : `<a class="btn pri lg" href="#cap-${p.id}">Go to capstone</a>`}
      ${pc > 0 ? `<div style="min-width:180px"><div class="sm" style="display:flex;justify-content:space-between"><span>Your progress</span><b>${Math.round(pc * 100)}%</b></div>${bar(pc, col(p))}</div>` : ""}</div>
    </div>${photo(p.id, "lg", true)}</div></section>
    <div class="wrap"><div class="card strip" style="margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0">
      <div><b>${p.modules.length} modules</b><span>${p.modules.reduce((a, m) => a + m.quiz.length, 0)} graded questions</span></div>
      <div><b>${p.parallel ? "Parallel track" : LEVEL[p.status] + " level"}</b><span>Your level: ${p.status}</span></div>
      <div><b>~${hours(p)} hours</b><span>Flexible schedule</span></div>
      <div><b>Certificate</b><span>After the capstone</span></div></div></div>
    <nav class="ctabs"><div class="wrap">${[["about", "About"], ["modules", "Modules"], ["capstone", "Capstone"], ["skills", "Skills"]].map(([k, l], i) => `<a href="#course-${pid}" data-scroll="${k}" class="${i === 0 ? "on" : ""}">${l}</a>`).join("")}</div></nav>
    <div class="wrap"><div class="cbody"><div>
    <section id="s-about"><h2 style="margin-bottom:10px">What you'll learn</h2><ul class="card learn">${p.modules.flatMap(m => m.objectives.slice(0, 2)).map(o => `<li>${ic("check")}<span>${esc(o)}</span></li>`).join("")}</ul>
      <h3 style="margin:24px 0 8px">Why it matters for you</h3><p style="color:var(--ink2);font-size:17px">${esc(p.why_now)}</p></section>
    <section id="s-skills" style="margin-top:28px"><h3 style="margin-bottom:12px">Skills you'll gain</h3><div class="chips">${SKILLS[p.id].map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></section>
    <section id="s-modules" style="margin-top:36px"><div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:12px"><h2>Modules</h2></div>
    <p class="mut">Each module: lesson, readings, quiz, exercises, reflection. Score 80% on the quiz to unlock the next module.</p><div class="card modlist">`;
  p.modules.forEach((m, i) => {
    const un = unlocked(m), mp = modPct(m), open = n && n.id === m.id;
    h += `<details class="mod" ${open ? "open" : ""}><summary><div><div class="mnum">Module ${i + 1}${modDone(m) ? ` · <span style="color:var(--ok)">Completed</span>` : ""}</div><h3>${esc(m.title)}</h3>
      ${un ? `<div style="display:flex;gap:10px;align-items:center;max-width:360px">${bar(mp, col(p))}<span class="xs mut">${Math.round(mp * 100)}%</span></div>` : `<div class="lockrow">${ic("lock")} Pass Module ${i}'s quiz to unlock</div>`}</div><span class="chev">${ic("next")}</span></summary>
      <div class="mbody"><div class="mstats"><span>${ic("clock")}~${m.hours} hours</span><span>${ic("read")}${m.readings.length} readings</span><span>${ic("quiz")}${m.quiz.length}-question quiz</span><span>${ic("ex")}${m.exercises.length} exercises</span></div>
      <ul style="margin:0 0 12px;padding-left:20px;color:var(--ink2);font-size:15px">${m.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
      ${STEPS.map(([k, l, icn, kind]) => { const sd = stepDone(m, k); return `<a class="item ${un ? "" : "locked"}" href="#learn-${m.id}-${k}"><span class="st ${sd ? "on" : ""}">${sd ? ic("check") : ""}</span><span class="ty">${ic(icn)}</span><span class="t"><b style="font-weight:600">${l}</b><br><span class="xs mut">${kind}</span></span><span class="d">${stepMeta(m, k)}</span></a>`; }).join("")}</div></details>`;
  });
  const co = capOpen(p);
  h += `</div></section>
    <section id="s-capstone" style="margin-top:36px"><h2 style="margin-bottom:12px">Capstone project</h2><div class="card capbox">${photo(p.id, "lg")}<div class="bd">
      <span class="tag">${co ? "Unlocked" : "Locked"}</span><h3>${esc(p.capstone.title)}</h3><p style="color:var(--ink2);margin-top:8px">${esc(p.capstone.brief)}</p>
      <div class="sm mut" style="margin-bottom:14px">${p.capstone.deliverables.length} deliverables · graded on ${p.capstone.rubric.length} criteria</div>
      ${co ? `<a class="btn pri" href="#cap-${p.id}">Open capstone</a>` : `<span class="lockrow">${ic("lock")} Pass every module quiz to unlock</span>`}</div></div></section>
    </div><aside><div class="card side-card"><h3 style="margin-bottom:12px">Course progress</h3><div style="display:flex;gap:14px;align-items:center">${ring(pc, col(p), 76)}<div class="sm"><b>${p.modules.filter(m => passed(m.id)).length}/${p.modules.length}</b> quizzes passed<br><b>${p.modules.filter(modDone).length}/${p.modules.length}</b> modules complete<br><b>${Math.round(capPct(p) * 100)}%</b> capstone</div></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><div class="sm mut">Earn a certificate by completing every module (all five steps) and the capstone.</div>
      ${courseDone(p) ? `<a class="btn pri" style="width:100%;margin-top:14px" href="#cert-${p.id}">${ic("award")} View certificate</a>` : ""}</div></aside></div>${footer()}</div>`;
  return h;
}

/* ---------- player ---------- */
function syllabus(m) {
  const p = m.pillar, r = parse();
  return `<div class="syl"><div class="hd"><a href="#course-${p.id}" class="iconbtn" aria-label="Back to course">${ic("back")}</a><b>${esc(p.title)}</b></div>${p.modules.map((x, i) => `<div class="mh"><b>Module ${i + 1}</b><span class="xs mut">${unlocked(x) ? Math.round(modPct(x) * 100) + "%" : "Locked"}</span></div><div class="xs mut" style="padding:0 16px 6px">${esc(x.title)}</div>${STEPS.map(([k, l, icn, kind]) => {
    const un = unlocked(x), on = x.id === m.id && r.step === k, sd = stepDone(x, k);
    return `<a class="it ${on ? "on" : ""} ${un ? "" : "lk"}" href="#learn-${x.id}-${k}">${sd ? `<span class="ok">${ic("check")}</span>` : ic(icn)}<span>${l}<small>${kind} · ${stepMeta(x, k)}</small></span></a>`; }).join("")}`).join("")}</div>`;
}
function vLearn(mid, step) {
  const m = findMod(mid); if (!m) return notFound();
  const p = m.pillar;
  if (!unlocked(m)) {
    const prev = MODS.slice(0, MODS.indexOf(m)).reverse().find(x => !passed(x.id) && !x.pillar.parallel);
    return `<div class="wrap"><div class="card empty" style="margin-top:28px">${bi(CI[p.id], 96, "bi big", true)}<h2>${esc(m.title)} is locked</h2><p class="mut">Pass the quiz for the module before it (80%) to unlock this one.</p>${prev ? `<a class="btn pri" href="#learn-${prev.id}-quiz">Go to ${esc(prev.title)}</a>` : ""}</div></div>`;
  }
  S.last = { mid, step }; save();
  const st = STEPS.find(s => s[0] === step) || STEPS[0];
  const body = { lesson: lessonView, read: readView, quiz: quizView, ex: exView, reflect: reflView }[st[0]](m);
  return `<div class="pl"><aside class="pside">${syllabus(m)}</aside><div>
    <div class="ptop"><button class="iconbtn menu" data-act="drawer" aria-label="Open syllabus">${ic("menu")}</button><span class="t">${esc(p.title)} · Module ${m.idx + 1}</span><span class="pct">${Math.round(modPct(m) * 100)}% of module</span></div>
    <div class="pmain"><div class="ptype">${ic(st[2])}${st[3]} · ${stepMeta(m, st[0])}</div><h1>${st[0] === "lesson" ? esc(m.title) : `${st[1]}: ${esc(m.title)}`}</h1>
    <div class="pmeta">Module ${m.idx + 1} of ${p.modules.length} · ${esc(p.title)}${S.modTime[mid] ? ` · ${fmtMin(S.modTime[mid])} spent` : ""}</div>${body}</div>${actionBar(m, st[0])}</div></div>`;
}
function nextHref(m, step) {
  const i = STEPS.findIndex(s => s[0] === step), nx = STEPS[i + 1];
  if (nx) return `#learn-${m.id}-${nx[0]}`;
  const n = MODS.slice(MODS.indexOf(m) + 1).find(x => unlocked(x));
  return n ? `#learn-${n.id}-lesson` : `#course-${m.pillar.id}`;
}
function actionBar(m, step) {
  if (step === "quiz" && quiz && quiz.id === m.id && quiz.i < m.quiz.length) return "";
  const i = STEPS.findIndex(s => s[0] === step), prev = STEPS[i - 1], done = stepDone(m, step), nx = STEPS[i + 1];
  const left = done ? `<span class="done">${ic("check")} Completed</span>` : step === "lesson" ? `<button class="btn" data-act="lesson-done">Mark as completed</button>`
    : step === "read" ? `<span class="sm mut">${req(m).filter(([, i]) => S.done[`${m.id}:read:${i}`]).length}/${req(m).length} required read</span>`
    : step === "quiz" ? `<span class="sm mut">Pass with 80% to continue</span>` : step === "ex" ? `<span class="sm mut">${core(m).filter(([, i]) => S.done[`${m.id}:ex:${i}`]).length}/${core(m).length} core done</span>` : `<span class="sm mut">40+ characters completes this</span>`;
  return `<div class="pbar"><div class="in">${prev ? `<a class="btn txt" href="#learn-${m.id}-${prev[0]}" aria-label="Previous">${ic("back")}</a>` : ""}${left}<span class="sp"></span>
    <a class="btn pri" href="${nextHref(m, step)}" data-act="${step === "lesson" && !done ? "lesson-next" : ""}">${nx ? `Next: ${nx[1]}` : "Next module"} ${ic("next")}</a></div></div>`;
}
function lessonView(m) {
  const figs = (m.figures || []).map(f => A.FIG[f] ? A.FIG[f]() : "").join("");
  let html = m.lesson_html;
  if (figs) { const k = html.indexOf("</p>"); html = k > 0 ? html.slice(0, k + 4) + figs + html.slice(k + 4) : figs + html; }
  return `<div class="objs"><h3>Learning objectives</h3><ul>${m.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div><article class="lesson">${html}</article>`;
}
function readView(m) {
  return `<p style="color:var(--ink2)">Tick each reading when you've read it with the <b>Focus on</b> note in mind. Required readings count toward completion.</p>
    ${m.readings.map((r, i) => `<div class="rd"><input type="checkbox" class="ck" data-done="${m.id}:read:${i}" ${S.done[`${m.id}:read:${i}`] ? "checked" : ""} aria-label="Mark ${esc(r.title)} as read">
      <div><a class="t" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ${ic("link", "ic")}</a><div class="sm mut">${esc(r.author)}</div>
      <div class="tg"><span class="chip ${r.required ? "warn" : ""}">${r.required ? "Required" : "Optional"}</span><span class="chip">${esc(r.type)}</span><span class="chip">${r.minutes} min</span></div>
      <div style="font-size:15px;color:var(--ink2)"><b>Focus on:</b> ${esc(r.focus)}</div></div></div>`).join("")}`;
}
let quiz = null;
function quizView(m) {
  const qs = S.quiz[m.id];
  if (!quiz || quiz.id !== m.id) {
    return `<div class="qfacts"><div><b>${m.quiz.length}</b><span>questions</span></div><div><b>80%</b><span>to pass</span></div><div><b>${qs ? Math.round(qs.best * 100) + "%" : "None"}</b><span>your best</span></div></div>
      ${passed(m.id) ? `<div class="fb ok"><b>Passed.</b> ${unlockedNextText(m)}</div>` : `<p style="color:var(--ink2)">Take it before the lesson to test out. Missed questions go to Review.</p>`}
      ${qs && qs.attempts.length ? `<p class="sm mut">Attempts: ${qs.attempts.slice(-6).map(a => Math.round(a.score * 100) + "%").join(" → ")}</p>` : ""}
      <button class="btn pri lg" data-act="quiz-start">${qs ? "Retake quiz" : "Start quiz"}</button>`;
  }
  if (quiz.i >= m.quiz.length) {
    const sc = quiz.correct / m.quiz.length, ok = sc >= D.pass_mark;
    return `<div class="result">${bi(ok ? "trophy" : "books", 120, "bi big")}<div class="score" style="color:${ok ? "var(--ok)" : "var(--bad)"}">${Math.round(sc * 100)}%</div>
      <h2>${ok ? "Passed" : "Below the pass mark"}</h2><p style="color:var(--ink2)">${quiz.correct} of ${m.quiz.length} correct. ${ok ? unlockedNextText(m) : "You need 80%. Review the lesson and retake it."}</p>
      ${quiz.missed.length ? `<p class="sm mut">${quiz.missed.length} missed question${quiz.missed.length > 1 ? "s" : ""} added to Review.</p>` : ""}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:16px"><button class="btn" data-act="quiz-start">Retake</button>${ok ? "" : `<a class="btn pri" href="#learn-${m.id}-lesson">Review lesson</a>`}</div></div>`;
  }
  const q = m.quiz[quiz.i], a = quiz.answered;
  return `<div class="qprog">${m.quiz.map((_, j) => `<i class="${j < quiz.i ? (quiz.res[j] ? "ok" : "no") : j === quiz.i ? "cur" : ""}"></i>`).join("")}</div>
    <div class="sm mut" style="font-weight:700">Question ${quiz.i + 1} of ${m.quiz.length}</div><p class="qtext">${esc(q.q)}</p>
    ${q.options.map((o, j) => `<button class="opt ${a == null ? "" : j === q.answer ? "right" : j === a ? "wrong" : ""}" data-ans="${j}" ${a != null ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${esc(o)}</span></button>`).join("")}
    ${a != null ? `<div class="fb ${a === q.answer ? "ok" : "no"}"><b>${a === q.answer ? "Correct." : "Incorrect."}</b> ${esc(q.explain)}</div>
    <div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="btn pri" data-act="quiz-next">${quiz.i + 1 < m.quiz.length ? "Next question" : "Submit and see result"} ${ic("next")}</button></div>` : ""}`;
}
function unlockedNextText(m) { const n = MODS[MODS.indexOf(m) + 1]; return n && n.pillar === m.pillar ? `Module ${m.idx + 2} is now unlocked.` : m.idx === m.pillar.modules.length - 1 ? "The capstone project is now unlocked." : ""; }
function exView(m) {
  return `<p style="color:var(--ink2)">Core exercises count toward completion. Stretch ones are optional.</p>
    ${m.exercises.map((e, i) => `<div class="card ex"><div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><h3>${esc(e.title)}</h3><span class="chip ${e.level === "core" ? "warn" : ""}">${e.level}</span></div>
      <p style="margin-top:10px;color:var(--ink2)">${esc(e.task)}</p><p class="sm"><b>Deliverable:</b> ${esc(e.deliverable)}</p><div class="sm"><b>Done when</b><ul>${e.acceptance.map(a => `<li>${esc(a)}</li>`).join("")}</ul></div>
      <input type="url" placeholder="Link to your work (repo, doc, post)" data-link="${m.id}:${i}" value="${esc(S.links[`${m.id}:${i}`])}">
      <label class="row"><input type="checkbox" class="ck" data-done="${m.id}:ex:${i}" ${S.done[`${m.id}:ex:${i}`] ? "checked" : ""}><span>I've met every "done when" point</span></label></div>`).join("")}`;
}
function reflView(m) {
  return `${(m.reflection || []).map(r => `<p style="font-size:19px;font-weight:700;color:var(--ink)">${esc(r)}</p>`).join("")}
    <textarea data-refl="${m.id}" placeholder="One honest paragraph tied to your real work">${esc(S.refl[m.id])}</textarea>
    <h3 style="margin:24px 0 6px">Notes</h3><p class="sm mut">Takeaways from the readings, open questions, ideas for a blog post.</p>
    <textarea data-notes="${m.id}" placeholder="Three bullets per reading">${esc(S.notes[m.id])}</textarea><p class="xs mut">Saved automatically on this device.</p>`;
}
function vCap(pid) {
  const p = pil(pid); if (!p) return notFound();
  if (!capOpen(p)) return `<div class="wrap"><div class="card empty" style="margin-top:28px">${bi(CI[p.id], 96, "bi big", true)}<h2>Capstone locked</h2><p class="mut">Pass every module quiz in this course first.</p><a class="btn pri" href="#course-${pid}">Back to course</a></div></div>`;
  return `<section class="chead"><div class="wrap"><div><div class="crumbs"><a href="#course-${pid}">${esc(p.title)}</a>${ic("next")}<span>Capstone</span></div><h1>${esc(p.capstone.title)}</h1><p class="lead">${esc(p.capstone.brief)}</p>
    <div style="max-width:360px"><div class="sm" style="display:flex;justify-content:space-between"><span>Deliverables</span><b>${Math.round(capPct(p) * 100)}%</b></div>${bar(capPct(p), col(p))}</div></div>${photo(pid, "lg", true)}</div></section>
    <div class="wrap" style="max-width:860px"><h2 style="margin:28px 0 12px">Deliverables</h2><div class="card" style="padding:8px 20px">
    ${p.capstone.deliverables.map((d, i) => `<label class="row" style="font-weight:400;border-bottom:1px solid var(--line2)"><input type="checkbox" class="ck" data-cap="${pid}:${i}" ${S.caps[`${pid}:${i}`] ? "checked" : ""}><span>${esc(d)}</span></label>`).join("")}
    <input type="url" placeholder="Link to your write-up" data-caplink="${pid}" value="${esc(S.capLinks[pid])}" style="margin:14px 0"></div>
    <h2 style="margin:28px 0 12px">Grading criteria</h2><ul class="card learn">${p.capstone.rubric.map(r => `<li>${ic("star")}<span>${esc(r)}</span></li>`).join("")}</ul>
    <p style="margin-top:20px">${courseDone(p) ? `<a class="btn pri lg" href="#cert-${pid}">${ic("award")} View certificate</a>` : `<span class="mut">Complete every module (all five steps) and every deliverable to earn the certificate.</span>`}</p>${footer()}</div>`;
}
function vCert(pid) {
  const p = pil(pid); if (!p) return notFound();
  if (!courseDone(p)) return `<div class="wrap" style="max-width:760px"><div class="card empty" style="margin-top:28px">${bi(CI[pid], 110, "bi big", true)}<h2>Certificate not earned yet</h2><p class="mut">${Math.round(coursePct(p) * 100)}% of ${esc(p.title)} complete. Finish every module and the capstone.</p><a class="btn pri" href="#course-${pid}">Go to course</a></div></div>`;
  const when = Math.max(...Object.entries(S.caps).filter(([k]) => k.startsWith(pid + ":")).map(([, v]) => +v || 0));
  return `<div class="wrap" style="max-width:880px;padding-top:28px"><div class="crumbs" style="margin-bottom:14px"><a href="#progress">Progress</a>${ic("next")}<span>Certificate</span></div>
    <div class="cert" style="--c:${col(p)}"><div class="mut" style="font-weight:700;font-size:14px">Certificate of completion</div>${bi(CI[pid], 110, "bi big")}
    <div class="mut">This certifies that</div><div class="name">${esc(S.name)}</div><div class="mut">completed every module, quiz, exercise and the capstone of</div>
    <h1 style="margin:12px 0">${esc(p.title)}</h1><div class="mut">${p.modules.length} modules · ~${hours(p)} hours · ${new Date(when || Date.now()).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</div></div></div>`;
}
let rv = null;
function reviewItems() { return Object.keys(S.review).map(k => { const [mid, qi] = k.split(":"), m = findMod(mid); return m && m.quiz[+qi] ? { k, m, q: m.quiz[+qi] } : null; }).filter(Boolean); }
function vReview() {
  const items = reviewItems();
  let h = `<div class="wrap" style="max-width:860px;padding-top:28px"><h1>Review</h1><p class="mut">Missed quiz questions. Answer each one right twice to clear it.</p>`;
  if (!items.length) return h + `<div class="card empty" style="margin-top:16px">${bi("shield", 96, "bi big")}<h2>Nothing to review</h2><p class="mut">Questions you miss in quizzes show up here.</p></div></div>`;
  if (!rv || !S.review[rv.k]) rv = { k: items[0].k, a: null };
  const it = items.find(x => x.k === rv.k), q = it.q, a = rv.a;
  return h + `<div class="card" style="padding:24px;margin-top:16px;border-top:4px solid ${col(it.m.pillar)}"><div class="sm mut">${items.length} left · ${esc(it.m.pillar.title)} · ${esc(it.m.title)}</div><p class="qtext">${esc(q.q)}</p>
    ${q.options.map((o, j) => `<button class="opt ${a == null ? "" : j === q.answer ? "right" : j === a ? "wrong" : ""}" data-rans="${j}" ${a != null ? "disabled" : ""}><b>${"ABCD"[j]}</b><span>${esc(o)}</span></button>`).join("")}
    ${a != null ? `<div class="fb ${a === q.answer ? "ok" : "no"}">${esc(q.explain)} ${a === q.answer ? `<b>(${S.review[rv.k].n}/2)</b>` : ""}</div><div style="display:flex;justify-content:space-between;margin-top:16px"><a class="btn" href="#learn-${it.m.id}-lesson">Open lesson</a><button class="btn pri" data-act="rv-next">Next ${ic("next")}</button></div>` : ""}</div></div>`;
}
function vProgress() {
  const tm = totalMin(), start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 7 * 15);
  const days = Array.from({ length: 112 }, (_, i) => { const x = new Date(start); x.setDate(start.getDate() + i); return x > new Date() ? -1 : (S.activity[dayKey(x)] || 0); });
  const lvl = v => v < 0 ? "x" : v === 0 ? 0 : v < 15 ? 1 : v < 45 ? 2 : v < 90 ? 3 : 4;
  return `<div class="wrap" style="padding-top:28px"><h1>Progress</h1><p class="mut">Started ${new Date(S.started).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
    <div class="kpis" style="margin-top:18px"><div class="card kpi">${ring(overall(), "var(--blue)", 58)}<div><b>${MODS.filter(modDone).length}/${MODS.length}</b><span class="mut sm">modules complete</span></div></div>
      <div class="card kpi">${bi("calendar-check", 40, "bi", !streak())}<div><b>${streak()}</b><span class="mut sm">day streak</span></div></div>
      <div class="card kpi">${bi("hourglass", 40)}<div><b>${fmtMin(tm)}</b><span class="mut sm">active time</span></div></div><div class="card kpi">${bi("target", 40)}<div><b>${avgQuiz()}%</b><span class="mut sm">avg best quiz</span></div></div></div>
    <div class="sec"><h2>Learning activity</h2><span class="mut sm">last 16 weeks</span></div><div class="card"><div class="heat">${days.map(v => `<i data-l="${lvl(v)}" style="${v < 0 ? "visibility:hidden" : ""}" title="${v > 0 ? fmtMin(v) : ""}"></i>`).join("")}</div></div>
    <div class="sec"><h2>Courses</h2></div><div class="card">${D.pillars.map(p => `<a class="prow" href="#course-${p.id}">${photo(p.id)}<span><b>${esc(p.title)}</b><span style="display:block;margin-top:6px">${bar(coursePct(p), col(p))}</span></span><span class="sm mut">${Math.round(coursePct(p) * 100)}%</span></a>`).join("")}</div>
    <div class="sec"><h2>Certificates</h2></div><div class="badges">${D.pillars.map(p => `<a class="card badge ${courseDone(p) ? "" : "off"}" href="#cert-${p.id}">${bi(CI[p.id], 64)}<b class="sm">${esc(p.title)}</b></a>`).join("")}</div>
    <div class="sec"><h2>Badges</h2><span class="mut sm">${Object.keys(S.badges).length}/${BADGES.length}</span></div><div class="badges">${BADGES.map(([id, label, icon]) => `<div class="card badge ${S.badges[id] ? "" : "off"}">${bi(icon, 64)}<b class="sm">${label}</b>${S.badges[id] ? `<div class="xs mut">${new Date(S.badges[id]).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>` : ""}</div>`).join("")}</div>
    <p style="margin-top:24px"><a href="#settings">Settings and backup</a></p>${footer()}</div>`;
}
const avgQuiz = () => { const v = Object.values(S.quiz); return v.length ? Math.round(v.reduce((a, q) => a + q.best, 0) / v.length * 100) : 0; };
function vSettings() {
  return `<div class="wrap" style="max-width:760px;padding-top:28px"><h1>Settings</h1><div class="card" style="padding:20px;margin-top:16px;display:grid;gap:16px">
    <label><b>Your name</b> <span class="sm mut">(shown on certificates)</span><input type="text" data-set="name" value="${esc(S.name)}" style="margin-top:6px"></label>
    <label><b>Weekly goal</b><select data-set="goalMin" style="margin-top:6px">${[120, 180, 240, 360, 480, 600].map(v => `<option value="${v}" ${S.goalMin === v ? "selected" : ""}>${v / 60} hours a week</option>`).join("")}</select></label></div>
    <h2 style="margin:28px 0 12px">Backup and restore</h2><div class="card" style="padding:20px">
    <p style="color:var(--ink2)">Progress is saved on this device. Back it up regularly, and use the backup to move to another device.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn pri" data-act="export">Copy backup</button><button class="btn" data-act="download">Download backup</button><label class="btn" for="imp">Restore from file</label><input id="imp" type="file" accept=".json,application/json,text/plain" hidden></div>
    <textarea id="exp" readonly hidden style="margin-top:12px"></textarea><h3 style="margin:20px 0 8px">Restore by pasting</h3><textarea id="imptxt" placeholder="Paste a backup here"></textarea>
    <p style="margin-top:10px"><button class="btn" data-act="import-text">Restore pasted backup</button></p><p class="sm mut" id="msg" role="status"></p></div>
    <h2 style="margin:28px 0 12px">Danger zone</h2><div class="card" style="padding:20px"><button class="btn" data-act="reset" style="color:var(--bad);border-color:var(--bad)">Reset all progress</button></div>${footer()}</div>`;
}
const notFound = () => `<div class="wrap"><div class="card empty" style="margin-top:28px">${bi("target", 96, "bi big")}<h2>Page not found</h2><a class="btn pri" href="#home">Go home</a></div></div>`;
const footer = () => `<footer class="foot">AI Platform Mastery · <a href="#settings">Settings</a> · <a href="https://github.com/ammaradam/ai-platform-mastery" target="_blank" rel="noopener">Source</a></footer>`;

/* ---------- install ---------- */
let deferredInstall = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; if (parse().view === "home") render(); });
function installCard() {
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone || S.hideInstall) return "";
  if (deferredInstall) return `<div class="card install">${ic("home")}<p><b>Install the app</b> for offline learning and a home-screen icon.</p><button class="btn pri" data-act="install">Install</button><button class="iconbtn" data-act="hide-install" aria-label="Dismiss">${ic("x")}</button></div>`;
  if (/iphone|ipad|ipod/i.test(navigator.userAgent) && "serviceWorker" in navigator) return `<div class="card install">${ic("home")}<p><b>Install on iPhone:</b> tap Share, then "Add to Home Screen".</p><button class="iconbtn" data-act="hide-install" aria-label="Dismiss">${ic("x")}</button></div>`;
  return "";
}

/* ---------- search ---------- */
let INDEX = [];
function buildIndex() {
  INDEX = [];
  for (const m of MODS) {
    INDEX.push({ t: m.title, s: m.pillar.title, body: m.lesson_html.replace(/<[^>]+>/g, " "), href: `#learn-${m.id}-lesson`, ic: "lesson", kind: "Lesson" });
    m.readings.forEach(r => INDEX.push({ t: r.title, s: `${r.author} · ${m.title}`, body: r.focus, href: `#learn-${m.id}-read`, ic: "read", kind: "Reading" }));
    m.exercises.forEach(e => INDEX.push({ t: e.title, s: m.title, body: e.task, href: `#learn-${m.id}-ex`, ic: "ex", kind: "Exercise" }));
  }
  D.pillars.forEach(p => INDEX.push({ t: p.title, s: "Course", body: p.goal + " " + SKILLS[p.id].join(" "), href: `#course-${p.id}`, ic: "courses", kind: "Course" }));
}
function runSearch(q) {
  const box = $("#sres"); q = q.trim().toLowerCase();
  if (q.length < 2) { box.innerHTML = `<p class="mut" style="padding:16px 4px">Search lessons, readings and exercises. For example: KV cache, drift, judge, EU AI Act.</p>`; return; }
  const terms = q.split(/\s+/), hits = INDEX.map(x => { const hay = (x.t + " " + x.body).toLowerCase(); const sc = terms.every(t => hay.includes(t)) ? terms.reduce((a, t) => a + (x.t.toLowerCase().includes(t) ? 5 : 1), 0) : 0; return [sc, x]; }).filter(([s]) => s).sort((a, b) => b[0] - a[0]).slice(0, 30);
  const hl = s => { let o = esc(s); terms.forEach(t => o = o.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>")); return o; };
  const snip = b => { const i = b.toLowerCase().indexOf(terms[0]); return i < 0 ? b.slice(0, 140) : (i > 60 ? "…" : "") + b.slice(Math.max(0, i - 60), i + 100) + "…"; };
  box.innerHTML = hits.length ? hits.map(([, x]) => `<a class="sres" href="${x.href}" data-act="search-close">${ic(x.ic)}<div><div class="xs mut">${x.kind} · ${esc(x.s)}</div><b>${hl(x.t)}</b><div class="sm mut">${hl(snip(x.body))}</div></div></a>`).join("") : `<p class="mut" style="padding:16px 4px">No results for "${esc(q)}".</p>`;
}

/* ---------- router ---------- */
function parse() {
  const h = location.hash.replace(/^#/, "") || "home"; let m;
  if ((m = h.match(/^learn-(p\dm\d+)-(lesson|read|quiz|ex|reflect)$/))) return { view: "learn", mid: m[1], step: m[2] };
  if ((m = h.match(/^(course|cap|cert)-(p\d)$/))) return { view: m[1], pid: m[2] };
  if (h === "courses") return { view: "learning" };
  return { view: ["home", "learning", "review", "progress", "settings"].includes(h) ? h : "home" };
}
function render() {
  const r = parse(), app = $("#app");
  const tab = { home: "home", learning: "learning", course: "learning", learn: "learning", cap: "learning", cert: "progress", review: "review", progress: "progress", settings: "progress" }[r.view];
  document.querySelectorAll("[data-tab]").forEach(a => a.classList.toggle("on", a.dataset.tab === tab));
  if (r.view !== "learn" || (quiz && quiz.id !== r.mid)) quiz = null;
  app.innerHTML = ({ home: vHome, learning: vLearning, course: () => vCourse(r.pid), learn: () => vLearn(r.mid, r.step), cap: () => vCap(r.pid), cert: () => vCert(r.pid), review: vReview, progress: vProgress, settings: vSettings })[r.view]();
  $("#streak-n").textContent = streak(); $("#streak-f").innerHTML = bi("calendar-check", 22, "bi", !streak());
  $("#avatar").textContent = (S.name || "A").trim()[0]?.toUpperCase() || "A";
  $(".syl a.on")?.scrollIntoView({ block: "center" });
  document.title = r.view === "learn" ? `${findMod(r.mid)?.title || ""} | AI Platform Mastery` : r.view === "course" ? `${pil(r.pid)?.title} | AI Platform Mastery` : "AI Platform Mastery";
}
addEventListener("hashchange", () => { closeOverlays(); render(); scrollTo(0, 0); });
function closeOverlays() { $("#drawer").classList.remove("open"); $("#sov").classList.remove("open"); }

/* ---------- events ---------- */
document.addEventListener("click", async e => {
  const hrefEl = e.target.closest("[data-href]"); if (hrefEl) { e.preventDefault(); location.hash = hrefEl.dataset.href; return; }
  const sc = e.target.closest("[data-scroll]"); if (sc) { e.preventDefault(); document.querySelectorAll("[data-scroll]").forEach(a => a.classList.toggle("on", a === sc)); $("#s-" + sc.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); return; }
  const sg = e.target.closest("[data-seg]"); if (sg) { seg = sg.dataset.seg; render(); return; }
  const t = e.target.closest("[data-act],[data-ans],[data-rans]"); if (!t) return;
  const r = parse(), m = r.mid && findMod(r.mid);
  if (t.dataset.ans != null && m && quiz) {
    quiz.answered = +t.dataset.ans; const q = m.quiz[quiz.i], ok = quiz.answered === q.answer;
    quiz.res[quiz.i] = ok; if (ok) quiz.correct++; else { quiz.missed.push(quiz.i); S.review[`${m.id}:${quiz.i}`] = { n: 0 }; }
    touch(); save(); render(); return;
  }
  if (t.dataset.rans != null && rv) { rv.a = +t.dataset.rans; const it = reviewItems().find(x => x.k === rv.k); S.review[rv.k].n = rv.a === it.q.answer ? S.review[rv.k].n + 1 : 0; touch(); save(); render(); return; }
  const act = t.dataset.act;
  if (act === "lesson-done") { mark(`${m.id}:lesson`); toast("Lesson completed"); checkBadges(); render(); }
  else if (act === "lesson-next") { mark(`${m.id}:lesson`); checkBadges(); }
  else if (act === "quiz-start") { quiz = { id: m.id, i: 0, correct: 0, answered: null, res: [], missed: [] }; render(); $(".pmain")?.scrollIntoView(); }
  else if (act === "quiz-next") {
    quiz.i++; quiz.answered = null;
    if (quiz.i >= m.quiz.length) {
      const sc2 = quiz.correct / m.quiz.length, rec = S.quiz[m.id] || (S.quiz[m.id] = { best: 0, attempts: [] }), was = passed(m.id);
      rec.attempts.push({ score: sc2, at: Date.now() }); rec.best = Math.max(rec.best, sc2); save();
      if (sc2 >= D.pass_mark && !was) { confetti(); toast("Quiz passed. Next module unlocked."); }
      checkBadges();
    }
    render(); scrollTo(0, 0);
  }
  else if (act === "rv-next") { if (S.review[rv.k]?.n >= 2) { delete S.review[rv.k]; toast("Answered twice. Removed from Review."); } const items = reviewItems(), i = items.findIndex(x => x.k === rv.k); rv = items.length ? { k: items[(i + 1) % items.length].k, a: null } : null; save(); render(); }
  else if (act === "drawer") { $("#drawer-panel").innerHTML = syllabus(m); $("#drawer").classList.add("open"); $("#drawer-panel .on")?.scrollIntoView({ block: "center" }); }
  else if (act === "drawer-close") $("#drawer").classList.remove("open");
  else if (act === "search") { $("#sov").classList.add("open"); const i = $("#sq"); i.value = ""; runSearch(""); setTimeout(() => i.focus(), 30); }
  else if (act === "search-close") $("#sov").classList.remove("open");
  else if (act === "export") { const txt = JSON.stringify(S), box = $("#exp"); box.hidden = false; box.value = txt; box.select(); try { await navigator.clipboard.writeText(txt); $("#msg").textContent = "Backup copied. Paste it somewhere safe."; } catch (err) { $("#msg").textContent = "Select the text above and copy it."; } }
  else if (act === "download") { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" })); a.download = `ai-platform-mastery-backup-${today()}.json`; a.click(); }
  else if (act === "import-text") restore($("#imptxt").value);
  else if (act === "reset") { if (t.dataset.confirm) { S = blank(); save(); render(); toast("Progress reset"); } else { t.dataset.confirm = 1; t.textContent = "Tap again to erase everything"; } }
  else if (act === "install" && deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; render(); }
  else if (act === "hide-install") { S.hideInstall = true; save(); render(); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeOverlays();
  if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $("[data-act=search]").click(); }
  if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("search")) { e.preventDefault(); document.activeElement.click(); }
});
function restore(txt) { try { const v = JSON.parse(txt); if (!v || (v.v !== 2 && !v.modules)) throw 0; S = v.v === 2 ? Object.assign(blank(), v) : (() => { const s = blank(); migrate(v, s); return s; })(); save(); render(); toast("Progress restored"); } catch (e) { const m = $("#msg"); if (m) m.textContent = "That isn't a valid backup."; } }
document.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "imp" && t.files[0]) { t.files[0].text().then(restore); return; }
  if (t.dataset.done) { mark(t.dataset.done, t.checked); const r = parse(); if (r.view === "learn" && t.checked && stepDone(findMod(r.mid), r.step)) toast(`${STEPS.find(s => s[0] === r.step)[1]} completed`); checkBadges(); render(); }
  else if (t.dataset.cap) { if (t.checked) S.caps[t.dataset.cap] = Date.now(); else delete S.caps[t.dataset.cap]; touch(); save(); checkBadges(); render(); }
  else if (t.dataset.set) { S[t.dataset.set] = t.dataset.set === "goalMin" ? +t.value : t.value; save(); $("#avatar").textContent = (S.name || "A")[0].toUpperCase(); }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "sq") runSearch(t.value);
  else if (t.dataset.refl) { const m = findMod(t.dataset.refl), was = stepDone(m, "reflect"); S.refl[t.dataset.refl] = t.value; touch(); save(); if (!was && stepDone(m, "reflect")) { toast("Reflection completed"); checkBadges(); } }
  else if (t.dataset.notes) { S.notes[t.dataset.notes] = t.value; save(); }
  else if (t.dataset.link) { S.links[t.dataset.link] = t.value; save(); }
  else if (t.dataset.caplink) { S.capLinks[t.dataset.caplink] = t.value; save(); }
  else if (t.dataset.set === "name") { S.name = t.value; save(); }
});

/* ---------- boot ---------- */
(async function init() {
  const raw = $("#curriculum-data")?.textContent.trim() || "";
  try { D = raw.startsWith("{") ? JSON.parse(raw) : await (await fetch("data/curriculum.json")).json(); }
  catch (e) { $("#app").innerHTML = `<div class="wrap"><div class="card empty" style="margin-top:28px"><h2>Couldn't load the course content</h2><p class="mut">Check your connection and reload.</p></div></div>`; return; }
  MODS = D.pillars.flatMap(p => p.modules.map((m, i) => Object.assign(m, { pillar: p, idx: i })));
  S = load(); save(); buildIndex();
  try { navigator.storage?.persist?.(); } catch (e) {}
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !raw.startsWith("{")) navigator.serviceWorker.register("sw.js").catch(() => {});
  render(); checkBadges();
})();
}
