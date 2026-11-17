/* Flat-vector illustration library. Every function returns an SVG string.
   Style: Google-visuals flat vector: bold flat fields, a soft shadow plane,
   a light edge, few shapes. Colours come from each course's palette. */
(function () {
  const PAL = {
    p1: { main: "#1A73E8", dark: "#0B4FB3", light: "#D2E3FC", accent: "#FBBC04", name: "lifecycle" },
    p2: { main: "#0E9F8F", dark: "#08695F", light: "#C9EFEA", accent: "#F9AB00", name: "platform" },
    p3: { main: "#E8710A", dark: "#A84F05", light: "#FDE3CC", accent: "#1A73E8", name: "inference" },
    p4: { main: "#7B5CE0", dark: "#4E36A8", light: "#E4DCFB", accent: "#34A853", name: "evals" },
    p5: { main: "#188038", dark: "#0D5223", light: "#CEEAD6", accent: "#EA4335", name: "governance" },
    p6: { main: "#D93025", dark: "#97211A", light: "#FAD2CF", accent: "#FBBC04", name: "proof" },
  };
  const INK = "#202124", WHITE = "#FFFFFF", PAPER = "#F8F9FA", SHADE = "rgba(32,33,36,.14)";

  const svg = (vb, body, cls = "", label = "") =>
    `<svg class="${cls}" viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
  const shadow = (cx, cy, rx, ry = rx * 0.18) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${SHADE}"/>`;

  /* ---------- motifs (drawn in a 200x140 box, centred ~100,80) ---------- */
  const motifs = {
    p1: (c) => `
      ${shadow(100, 122, 80, 7)}
      <rect x="18" y="96" width="164" height="16" rx="8" fill="${INK}" opacity=".85"/>
      ${[34, 66, 98, 130, 162].map(x => `<circle cx="${x}" cy="104" r="5" fill="${c.light}"/>`).join("")}
      <rect x="26" y="70" width="30" height="26" rx="4" fill="${WHITE}"/><rect x="26" y="70" width="30" height="7" rx="3" fill="${c.light}"/>
      <path d="M32 86h18M32 91h12" stroke="${c.main}" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(100 66)"><circle r="22" fill="${c.accent}"/><circle r="22" fill="none" stroke="${WHITE}" stroke-width="2" opacity=".5"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="-4" y="-29" width="8" height="10" rx="2" fill="${c.accent}" transform="rotate(${a})"/>`).join("")}
        <circle r="9" fill="${c.dark}"/></g>
      <rect x="140" y="58" width="40" height="38" rx="6" fill="${WHITE}"/>
      <path d="M147 86l9-10 8 6 10-14" fill="none" stroke="${c.main}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M58 82h14M128 82h10" stroke="${WHITE}" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/>`,
    p2: (c) => `
      ${shadow(100, 124, 78, 7)}
      <rect x="40" y="86" width="56" height="34" rx="5" fill="${c.accent}"/><path d="M52 92v22M64 92v22M76 92v22" stroke="${WHITE}" stroke-width="3" opacity=".6"/>
      <rect x="104" y="86" width="56" height="34" rx="5" fill="${WHITE}"/><path d="M116 92v22M128 92v22M140 92v22" stroke="${c.light}" stroke-width="3"/>
      <rect x="72" y="50" width="56" height="34" rx="5" fill="${c.dark}"/><path d="M84 56v22M96 56v22M108 56v22" stroke="${WHITE}" stroke-width="3" opacity=".35"/>
      <g transform="translate(152 40)"><circle r="20" fill="${WHITE}"/>
        <polygon points="0,-14 11,-8.7 13.6,3.1 6.1,12.6 -6.1,12.6 -13.6,3.1 -11,-8.7" fill="${c.main}"/>
        <circle r="4" fill="${WHITE}"/>${[0, 51, 103, 154, 206, 257, 309].map(a => `<path d="M0 -4V-11" stroke="${WHITE}" stroke-width="2" transform="rotate(${a})"/>`).join("")}</g>
      <path d="M30 52c0-10 14-14 20-6 4-8 20-6 18 6 8 0 8 12 0 12H34c-6 0-8-10-4-12z" fill="${WHITE}" opacity=".9"/>`,
    p3: (c) => `
      ${shadow(100, 124, 70, 7)}
      <g>${[0, 1, 2, 3, 4].map(i => `<rect x="${62 + i * 16}" y="30" width="6" height="12" rx="2" fill="${INK}" opacity=".7"/><rect x="${62 + i * 16}" y="104" width="6" height="12" rx="2" fill="${INK}" opacity=".7"/><rect x="38" y="${52 + i * 12}" width="12" height="5" rx="2" fill="${INK}" opacity=".7"/><rect x="150" y="${52 + i * 12}" width="12" height="5" rx="2" fill="${INK}" opacity=".7"/>`).join("")}</g>
      <rect x="48" y="40" width="104" height="66" rx="10" fill="${c.dark}"/>
      <rect x="62" y="52" width="76" height="42" rx="6" fill="${c.main}"/>
      <rect x="62" y="52" width="76" height="8" rx="4" fill="${WHITE}" opacity=".25"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${70 + i * 16}" y="66" width="12" height="18" rx="3" fill="${i === 3 ? c.accent : WHITE}"/>`).join("")}
      <path d="M152 73h20" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>
      ${[0, 1, 2].map(i => `<rect x="${170 + i * 0}" y="${60 + i * 12}" width="10" height="8" rx="2" fill="${WHITE}" opacity="${1 - i * 0.3}" transform="translate(${i * 6} 0)"/>`).join("")}`,
    p4: (c) => `
      ${shadow(96, 124, 72, 7)}
      <rect x="44" y="28" width="74" height="94" rx="8" fill="${WHITE}"/>
      <rect x="66" y="20" width="30" height="14" rx="5" fill="${c.dark}"/>
      ${[0, 1, 2].map(i => `<rect x="56" y="${48 + i * 22}" width="12" height="12" rx="3" fill="${i < 2 ? c.accent : c.light}"/>
        ${i < 2 ? `<path d="M58.5 ${54 + i * 22}l3 3 5-6" fill="none" stroke="${WHITE}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
        <rect x="74" y="${51 + i * 22}" width="${34 - i * 8}" height="6" rx="3" fill="${c.light}"/>`).join("")}
      <g transform="translate(138 80)"><circle r="26" fill="${c.light}" opacity=".6"/><circle r="20" fill="none" stroke="${INK}" stroke-width="7"/>
        <circle r="20" fill="${WHITE}" opacity=".35"/><path d="M14 14l18 18" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
        <path d="M-9 0l6 6 11-12" fill="none" stroke="${c.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    p5: (c) => `
      ${shadow(100, 124, 70, 7)}
      <path d="M100 22l42 14v30c0 28-18 46-42 56-24-10-42-28-42-56V36z" fill="${c.dark}"/>
      <path d="M100 22l42 14v30c0 28-18 46-42 56z" fill="${c.main}"/>
      <path d="M84 70l11 11 22-24" fill="none" stroke="${WHITE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(36 70)"><path d="M0 -24v40M-14 16h28" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>
        <path d="M-18 -18h36" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>
        <path d="M-24 0l6-18 6 18z" fill="${c.accent}"/><path d="M12 0l6-18 6 18z" fill="${c.accent}"/></g>
      <g transform="translate(166 76)"><rect x="-14" y="-6" width="28" height="24" rx="5" fill="${c.accent}"/>
        <path d="M-8 -6v-6a8 8 0 0 1 16 0v6" fill="none" stroke="${WHITE}" stroke-width="4"/><circle cy="6" r="3.5" fill="${WHITE}"/></g>`,
    p6: (c) => `
      ${shadow(100, 124, 76, 7)}
      <rect x="62" y="96" width="76" height="24" rx="4" fill="${c.dark}"/><rect x="72" y="88" width="56" height="10" rx="3" fill="${INK}" opacity=".8"/>
      <g transform="translate(78 54) rotate(-14)"><path d="M0 -10l46 -18v56L0 10z" fill="${WHITE}"/><rect x="-14" y="-12" width="16" height="24" rx="4" fill="${c.accent}"/>
        <path d="M-4 12l6 18" stroke="${c.accent}" stroke-width="7" stroke-linecap="round"/></g>
      <path d="M140 34c8 4 12 12 12 20M148 22c14 8 20 22 18 36" fill="none" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(40 34)"><rect x="-18" y="-12" width="36" height="24" rx="8" fill="${WHITE}"/><path d="M-6 12l-4 8 10-8" fill="${WHITE}"/>
        <path d="M-9 0h18" stroke="${c.main}" stroke-width="3" stroke-linecap="round"/></g>
      <path d="M168 92l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="${c.accent}"/>`,
  };

  /* ---------- course cover ---------- */
  function cover(pid, cls = "cover") {
    const c = PAL[pid];
    return svg("0 0 200 140", `
      <rect width="200" height="140" fill="${c.main}"/>
      <circle cx="176" cy="18" r="46" fill="${WHITE}" opacity=".10"/>
      <circle cx="20" cy="130" r="54" fill="${c.dark}" opacity=".45"/>
      <path d="M0 112 Q60 96 120 108 T200 100 V140 H0z" fill="${c.dark}" opacity=".35"/>
      ${motifs[pid](c)}`, cls, `${c.name} illustration`);
  }

  /* ---------- module thumbnail: course motif on a tint, number badge ---------- */
  function thumb(pid, n, state) {
    const c = PAL[pid];
    const badge = state === "done" ? `<circle cx="168" cy="26" r="18" fill="#188038"/><path d="M160 26l6 6 11-12" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : state === "locked" ? `<circle cx="168" cy="26" r="18" fill="${INK}" opacity=".7"/><rect x="161" y="24" width="14" height="11" rx="2" fill="#fff"/><path d="M164 24v-3a4 4 0 0 1 8 0v3" stroke="#fff" stroke-width="2.5" fill="none"/>`
      : `<circle cx="168" cy="26" r="18" fill="${WHITE}"/><text x="168" y="32" text-anchor="middle" font-size="18" font-weight="700" fill="${c.dark}" font-family="system-ui">${n}</text>`;
    return svg("0 0 200 140", `<rect width="200" height="140" fill="${c.light}"/><circle cx="30" cy="20" r="40" fill="${WHITE}" opacity=".5"/>
      <g transform="translate(10 4) scale(.9)">${motifs[pid](c)}</g>${badge}`, "thumb", "");
  }

  /* ---------- hero: path up a hill with six flags ---------- */
  function hero(done = []) {
    const pts = [[40, 170], [110, 150], [170, 122], [230, 98], [290, 70], [340, 40]];
    const ids = ["p1", "p4", "p3", "p2", "p5", "p6"];
    return svg("0 0 400 200", `
      <rect width="400" height="200" fill="#E8F0FE"/>
      <circle cx="236" cy="46" r="24" fill="#FBBC04"/><circle cx="236" cy="46" r="34" fill="#FBBC04" opacity=".2"/>
      <path d="M0 160 Q90 120 170 140 T400 110 V200 H0z" fill="#AECBFA"/>
      <path d="M0 200 L0 180 Q120 150 220 120 Q300 90 360 30 L400 30 V200z" fill="#1A73E8"/>
      <path d="M220 120 Q300 90 360 30 L400 30 V200 H260z" fill="#0B4FB3" opacity=".35"/>
      <path d="M${pts.map(p => p.join(" ")).join(" L")}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>
      ${pts.map((p, i) => { const c = PAL[ids[i]], on = done.includes(ids[i]);
        return `<g transform="translate(${p[0]} ${p[1]})"><path d="M0 0V-30" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
          <path d="M1.5 -30h20l-6 7 6 7h-20z" fill="${on ? c.main : "#fff"}" opacity="${on ? 1 : .55}"/>
          <ellipse cy="2" rx="8" ry="2.5" fill="rgba(0,0,0,.18)"/></g>`; }).join("")}
      <g transform="translate(70 162)"><ellipse cy="12" rx="14" ry="3" fill="rgba(0,0,0,.2)"/>
        <rect x="-6" y="-12" width="12" height="20" rx="5" fill="#EA4335"/><circle cy="-19" r="7" fill="#F6C7A1"/>
        <path d="M-7 -21a7 7 0 0 1 14 0" fill="#3C2A1E"/><rect x="2" y="-8" width="10" height="13" rx="3" fill="#FBBC04"/>
        <path d="M-4 8v4M4 8v4" stroke="#202124" stroke-width="3" stroke-linecap="round"/></g>`, "hero-art", "A path up a hill with six course flags");
  }

  /* ---------- small spot illustrations ---------- */
  const spot = {
    trophy: () => svg("0 0 160 140", `${shadow(80, 128, 46, 6)}
      <circle cx="80" cy="64" r="58" fill="#FEF7E0"/>
      <path d="M50 30h60v24a30 30 0 0 1-60 0z" fill="#FBBC04"/><path d="M80 30h30v24a30 30 0 0 1-30 30z" fill="#F29900"/>
      <path d="M50 38H36a14 14 0 0 0 16 20M110 38h14a14 14 0 0 1-16 20" fill="none" stroke="#FBBC04" stroke-width="6"/>
      <rect x="72" y="84" width="16" height="18" fill="#F29900"/><rect x="58" y="102" width="44" height="12" rx="3" fill="#202124"/>
      <path d="M80 40l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#fff"/>
      ${[[24, 30], [136, 26], [130, 90], [28, 96]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${4 + i % 2 * 2}" fill="${["#EA4335", "#1A73E8", "#34A853", "#7B5CE0"][i]}"/>`).join("")}`, "spot", "Trophy"),
    empty: () => svg("0 0 160 120", `${shadow(80, 108, 50, 6)}<circle cx="80" cy="56" r="48" fill="#E6F4EA"/>
      <rect x="50" y="30" width="60" height="70" rx="8" fill="#fff"/><path d="M62 52l8 8 16-18" fill="none" stroke="#34A853" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="62" y="74" width="36" height="6" rx="3" fill="#CEEAD6"/><rect x="62" y="84" width="24" height="6" rx="3" fill="#CEEAD6"/>`, "spot", "All clear"),
    flame: (on = true) => svg("0 0 40 48", `<path d="M20 2c4 10 16 16 16 28a16 16 0 0 1-32 0c0-8 6-12 8-20 2 4 4 6 6 6 0-6 0-10 2-14z" fill="${on ? "#F29900" : "#DADCE0"}"/>
      <path d="M20 22c3 6 8 8 8 14a8 8 0 0 1-16 0c0-4 4-6 4-10 2 2 3 2 4-4z" fill="${on ? "#FBBC04" : "#F1F3F4"}"/>`, "flame", "Streak"),
    seal: (pid) => { const c = PAL[pid]; return svg("0 0 120 120", `${Array.from({ length: 16 }, (_, i) => `<circle cx="60" cy="10" r="10" fill="${c.main}" transform="rotate(${i * 22.5} 60 60)"/>`).join("")}
      <circle cx="60" cy="60" r="44" fill="${c.main}"/><circle cx="60" cy="60" r="36" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 4"/>
      <path d="M44 60l11 11 22-24" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`, "seal", "Seal"); },
    welcome: () => svg("0 0 200 150", `${shadow(100, 140, 70, 7)}
      <rect x="40" y="96" width="120" height="8" rx="4" fill="#5F6368"/><rect x="52" y="104" width="6" height="34" fill="#5F6368"/><rect x="142" y="104" width="6" height="34" fill="#5F6368"/>
      <rect x="66" y="52" width="68" height="44" rx="5" fill="#202124"/><rect x="70" y="56" width="60" height="34" rx="2" fill="#1A73E8"/>
      <path d="M78 80l10-10 8 6 14-14 10 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="42" cy="52" r="10" fill="#F6C7A1"/><path d="M32 50a10 10 0 0 1 20-2c-6 0-12-2-20 2z" fill="#3C2A1E"/>
      <rect x="30" y="62" width="24" height="34" rx="9" fill="#34A853"/><path d="M50 72l18 10" stroke="#34A853" stroke-width="7" stroke-linecap="round"/>
      <rect x="146" y="74" width="14" height="22" rx="3" fill="#fff"/><path d="M160 80h4a4 4 0 0 1 0 8h-4" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M150 66c2-4-2-6 0-10M156 66c2-4-2-6 0-10" stroke="#BDC1C6" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="170" cy="30" r="14" fill="#FBBC04"/>`, "spot", "Learner at a desk"),
  };

  /* ---------- item-type icons (24x24, stroke) ---------- */
  const ICON = {
    lesson: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h6M8 11h6"/>',
    read: '<path d="M2 5c4-2 7-1 10 1 3-2 6-3 10-1v14c-4-2-7-1-10 1-3-2-6-3-10-1z"/><path d="M12 6v14"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6V14M12 17h.01"/>',
    ex: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.8-.7-.7-2.8z"/>',
    reflect: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    courses: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8"/>',
    review: '<rect x="4" y="6" width="14" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/>',
    stats: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  };
  const icon = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ""}</svg>`;

  /* ---------- concept figures for lessons (viewBox 600x260) ---------- */
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 18}" font-weight="${o.w || 600}" fill="${o.fill || INK}" text-anchor="${o.a || "middle"}" font-family="inherit">${s}</text>`;
  const box = (x, y, w, h, fill, label, sub, tc = WHITE) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}"/>${T(x + w / 2, y + h / 2 + (sub ? -3 : 6), label, { fill: tc, size: 17 })}${sub ? T(x + w / 2, y + h / 2 + 19, sub, { size: 14, w: 500, fill: tc }) : ""}`;
  const arrow = (x1, y1, x2, y2, col = "#5F6368") => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col}" stroke-width="3" marker-end="url(#ah)"/>`;
  const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" fill="#5F6368"/></marker></defs>`;
  const fig = (body, label) => `<figure class="concept">${svg("0 0 600 260", defs + `<rect width="600" height="260" rx="16" fill="#F8F9FA"/>` + body, "", label).replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"')}<figcaption>${label}</figcaption></figure>`;

  const FIG = {
    "ml-code-small": () => fig(`
      ${[["Config", 20, 24, 110], ["Data collection", 142, 24, 150], ["Features", 304, 24, 120], ["Serving", 436, 24, 144],
         ["Data checks", 20, 192, 130], ["Monitoring", 162, 192, 130], ["Process mgmt", 304, 192, 140], ["Analysis", 456, 192, 124]].map(([l, x, y, w]) => box(x, y, w, 46, "#D2E3FC", l, null, "#0B4FB3")).join("")}
      ${box(250, 106, 100, 48, "#1A73E8", "ML code")}`, "ML code is a small box in a big system (after Sculley et al., 2015)"),
    "drift-types": () => fig(`
      ${T(150, 34, "Data drift: P(X) changes")}${T(450, 34, "Concept drift: P(Y|X) changes")}
      <path d="M40 210h220M40 210V60M340 210h220M340 210V60" stroke="#BDC1C6" stroke-width="2"/>
      <path d="M50 200 Q100 60 150 200" fill="#1A73E8" opacity=".35"/><path d="M110 200 Q170 60 230 200" fill="#E8710A" opacity=".45"/>
      ${T(100, 236, "before", { size: 15, w: 500 })}${T(190, 236, "after", { size: 15, w: 500 })}
      <path d="M360 190L540 90" stroke="#1A73E8" stroke-width="4"/><path d="M360 190L540 150" stroke="#E8710A" stroke-width="4" stroke-dasharray="8 6"/>
      ${T(520, 80, "before", { size: 15, w: 500, a: "end" })}${T(520, 172, "after", { size: 15, w: 500, a: "end" })}
      ${T(450, 236, "same inputs, different price", { size: 15, w: 500 })}`, "Data drift shifts the inputs; concept drift changes the relationship"),
    "control-loop": () => fig(`
      ${box(40, 100, 140, 60, "#0E9F8F", "Desired state", "etcd via API")}
      ${box(230, 100, 140, 60, "#08695F", "Controller", "compare + act")}
      ${box(420, 100, 140, 60, "#C9EFEA", "Actual state", "pods, nodes", "#08695F")}
      ${arrow(182, 130, 226, 130)}${arrow(372, 130, 416, 130)}
      <path d="M490 162 Q490 220 300 220 Q300 220 300 166" fill="none" stroke="#5F6368" stroke-width="3" marker-end="url(#ah)"/>
      ${T(395, 240, "observe", { size: 15, w: 500 })}${T(300, 70, "reconcile forever", { size: 15, w: 500 })}`, "Every Kubernetes controller runs this loop"),
    "prefill-decode": () => fig(`
      ${T(150, 36, "Prefill: compute-bound")}${T(450, 36, "Decode: memory-bound")}
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${50 + i * 26}" y="70" width="20" height="20" rx="4" fill="#E8710A"/>`).join("")}
      ${arrow(150, 98, 150, 136)}${box(70, 140, 160, 50, "#A84F05", "All prompt tokens", "in one pass")}
      ${T(150, 222, "sets time to first token", { size: 15, w: 500 })}
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${370 + i * 34}" y="${180 - i * 22}" width="24" height="24" rx="5" fill="${i === 4 ? "#1A73E8" : "#FDE3CC"}"/>`).join("")}
      ${T(450, 222, "one token per step", { size: 15, w: 500 })}`, "Two phases with two different bottlenecks"),
    "batching": () => fig(`
      ${T(150, 30, "Static batching")}${T(450, 30, "Continuous batching")}
      ${[[6, 0], [3, 0], [5, 0]].map(([n], r) => Array.from({ length: 6 }, (_, i) => `<rect x="${40 + i * 36}" y="${56 + r * 50}" width="30" height="34" rx="5" fill="${i < n ? "#E8710A" : "#E8EAED"}"/>`).join("")).join("")}
      ${[["#E8710A", 6], ["#E8710A", 3, "#1A73E8", 3], ["#E8710A", 5, "#34A853", 1]].map((row, r) => Array.from({ length: 6 }, (_, i) => { const fill = i < row[1] ? row[0] : row[2] || "#E8EAED"; return `<rect x="${340 + i * 36}" y="${56 + r * 50}" width="30" height="34" rx="5" fill="${fill}"/>`; }).join("")).join("")}
      ${T(150, 230, "grey = idle slots waiting for the longest", { size: 15, w: 500 })}${T(450, 230, "new requests fill slots every step", { size: 15, w: 500 })}`, "Why continuous batching raises throughput"),
    "kv-cache": () => fig(`
      ${T(300, 34, "KV cache per token = 2 × layers × kv_heads × head_dim × bytes")}
      ${Array.from({ length: 4 }, (_, l) => Array.from({ length: 10 }, (_, t) => `<rect x="${80 + t * 46}" y="${60 + l * 40}" width="38" height="30" rx="5" fill="${t < 7 ? "#1A73E8" : "#D2E3FC"}" opacity="${t < 7 ? 1 - l * .12 : 1}"/>`).join("")).join("")}
      ${T(50, 82, "L1", { size: 12 })}${T(50, 202, "L32", { size: 12 })}${T(300, 236, "grows with every token of every active request", { size: 15, w: 500 })}`, "KV cache, not weights, usually caps concurrency"),
    "eval-flywheel": () => fig(`
      ${box(212, 26, 176, 50, "#7B5CE0", "Production traces")}
      ${box(410, 104, 170, 50, "#4E36A8", "Error analysis")}
      ${box(212, 184, 176, 50, "#E4DCFB", "Eval suite grows", null, "#4E36A8")}
      ${box(20, 104, 160, 50, "#34A853", "Release gate")}
      ${arrow(390, 56, 470, 100)}${arrow(480, 158, 392, 204)}${arrow(208, 206, 120, 158)}${arrow(110, 100, 208, 56)}`, "The eval flywheel: production failures become regression tests"),
    "judge-matrix": () => fig(`
      ${T(330, 34, "Judge says")}${T(250, 62, "Pass", { size: 13 })}${T(410, 62, "Fail", { size: 13 })}
      ${T(110, 112, "Expert: Pass", { size: 13, a: "middle" })}${T(110, 192, "Expert: Fail", { size: 13 })}
      ${box(180, 76, 140, 70, "#34A853", "True pass", "→ TPR")}${box(340, 76, 140, 70, "#FAD2CF", "Missed pass", null, "#97211A")}
      ${box(180, 156, 140, 70, "#FAD2CF", "Missed fail", null, "#97211A")}${box(340, 156, 140, 70, "#34A853", "True fail", "→ TNR")}`, "Measure your judge like a classifier: report TPR and TNR"),
    "nist-rmf": () => fig(`
      <circle cx="300" cy="130" r="58" fill="#188038"/>${T(300, 135, "Govern", { fill: WHITE, size: 17 })}
      ${[["Map", 130, 70], ["Measure", 470, 70], ["Manage", 300, 230]].map(([l, x, y]) => `<circle cx="${x}" cy="${y}" r="42" fill="#CEEAD6"/>${T(x, y + 5, l, { fill: "#0D5223" })}`).join("")}
      <path d="M172 76 Q300 20 428 76M450 108 Q420 200 342 224M258 224 Q180 200 150 108" fill="none" stroke="#5F6368" stroke-width="3" marker-end="url(#ah)"/>`, "NIST AI RMF: Govern underpins Map, Measure and Manage"),
    "trifecta": () => fig(`
      <circle cx="220" cy="105" r="78" fill="#EA4335" opacity=".25"/><circle cx="380" cy="105" r="78" fill="#1A73E8" opacity=".25"/><circle cx="300" cy="175" r="78" fill="#FBBC04" opacity=".35"/>
      ${T(185, 92, "Private data", { size: 14 })}${T(415, 92, "Untrusted content", { size: 14 })}${T(300, 226, "External comms", { size: 14 })}
      ${T(300, 135, "DANGER", { size: 13, fill: "#97211A" })}`, "The lethal trifecta: remove any one leg"),
    "team-topologies": () => fig(`
      ${[0, 1, 2].map(i => box(40 + i * 130, 30, 110, 50, "#0E9F8F", "Stream", "aligned")).join("")}
      ${box(40, 180, 370, 50, "#08695F", "Platform team", "X-as-a-service")}
      ${box(450, 30, 120, 50, "#F9AB00", "Enabling", "facilitating", INK)}
      ${box(450, 120, 120, 50, "#C9EFEA", "Complicated", "subsystem", "#08695F")}
      ${[95, 225, 355].map(x => arrow(x, 176, x, 84)).join("")}${arrow(446, 56, 414, 56)}`, "Team Topologies: four team types, platform as a service"),
  };

  window.ART = { PAL, cover, thumb, hero, spot, icon, FIG };
})();
