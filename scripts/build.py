#!/usr/bin/env python3
"""Build the curriculum from content/*.yaml.

Single source of truth: content/*.yaml
Outputs:
  curriculum/<pillar>/README.md            pillar overview + capstone
  curriculum/<pillar>/<module>.md          lesson, readings, quiz, exercises
  CURRICULUM.md                            full syllabus
  docs/reading-list.md                     every reading in one place
  app/data/curriculum.json                 data for the learning app
  app/standalone.html                      app with data inlined (single file)

Usage:  python scripts/build.py            build everything
        python scripts/build.py --check    validate only (used in CI)
"""
from __future__ import annotations

import hashlib
import json
import random
import re
import sys
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
OUT = ROOT / "curriculum"
APP_DATA = ROOT / "app" / "data" / "curriculum.json"

# Recommended learning path (pillar ids). p6 runs in parallel with everything.
PATH = ["p1", "p4", "p3", "p2", "p5", "p6"]
PASS_MARK = 0.8

REQ_PILLAR = ["id", "order", "title", "status", "goal", "why_now", "capstone", "modules"]
REQ_MODULE = ["id", "title", "hours", "objectives", "lesson", "readings", "quiz", "exercises"]
REQ_READING = ["title", "author", "url", "type", "required", "minutes", "focus"]
REQ_QUIZ = ["q", "options", "answer", "explain"]
REQ_EX = ["title", "level", "task", "deliverable", "acceptance"]


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def shuffle_options(q: dict) -> dict:
    """Deterministically shuffle options so the correct answer isn't always in the
    same position. Authors write options in any order; the build balances them."""
    seed = int(hashlib.sha256(q["q"].encode()).hexdigest(), 16)
    idx = list(range(len(q["options"])))
    random.Random(seed).shuffle(idx)
    out = dict(q)
    out["options"] = [q["options"][i] for i in idx]
    out["answer"] = idx.index(q["answer"])
    return out


def load(shuffle: bool = True) -> list[dict]:
    pillars = [yaml.safe_load(p.read_text()) for p in sorted(CONTENT.glob("p*.yaml"))]
    if shuffle:
        for p in pillars:
            for m in p["modules"]:
                m["quiz"] = [shuffle_options(q) for q in m["quiz"]]
    return sorted(pillars, key=lambda p: PATH.index(p["id"]))


def validate(pillars: list[dict]) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    for p in pillars:
        for k in REQ_PILLAR:
            if k not in p:
                errors.append(f"{p.get('id')}: missing {k}")
        for m in p.get("modules", []):
            mid = m.get("id", "?")
            if mid in seen:
                errors.append(f"duplicate module id {mid}")
            seen.add(mid)
            for k in REQ_MODULE:
                if k not in m:
                    errors.append(f"{mid}: missing {k}")
            for r in m.get("readings", []):
                for k in REQ_READING:
                    if k not in r:
                        errors.append(f"{mid}: reading '{r.get('title')}' missing {k}")
                if not str(r.get("url", "")).startswith("https://"):
                    errors.append(f"{mid}: reading '{r.get('title')}' url must be https")
            if not any(r.get("required") for r in m.get("readings", [])):
                errors.append(f"{mid}: needs at least one required reading")
            quiz = m.get("quiz", [])
            if len(quiz) < 4:
                errors.append(f"{mid}: quiz needs at least 4 questions")
            for i, q in enumerate(quiz):
                for k in REQ_QUIZ:
                    if k not in q:
                        errors.append(f"{mid} q{i+1}: missing {k}")
                opts = q.get("options", [])
                if len(opts) < 3:
                    errors.append(f"{mid} q{i+1}: needs 3+ options")
                if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < len(opts):
                    errors.append(f"{mid} q{i+1}: answer index out of range")
                if len(set(opts)) != len(opts):
                    errors.append(f"{mid} q{i+1}: duplicate options")
            for e in m.get("exercises", []):
                for k in REQ_EX:
                    if k not in e:
                        errors.append(f"{mid}: exercise '{e.get('title')}' missing {k}")
                if e.get("level") not in ("core", "stretch"):
                    errors.append(f"{mid}: exercise level must be core|stretch")
    return errors


STATUS_BADGE = {"strong": "🟢 strong", "partial": "🟡 partial", "gap": "🔴 gap"}


def module_md(p: dict, m: dict) -> str:
    out = [f"# {m['id'].upper()} · {m['title']}", ""]
    out += [f"**Pillar:** [{p['title']}](README.md) · **Time:** ~{m['hours']} h · **Pass mark:** {int(PASS_MARK*100)}% on the quiz", ""]
    out += ["## Learning objectives", ""] + [f"- {o}" for o in m["objectives"]] + [""]
    out += ["## Lesson", "", m["lesson"].strip(), ""]
    out += ["## Readings", "", "| | Reading | Type | Time | Focus on |", "|---|---|---|---|---|"]
    for r in m["readings"]:
        req = "**Required**" if r["required"] else "Optional"
        out.append(f"| {req} | [{r['title']}]({r['url']}) — {r['author']} | {r['type']} | {r['minutes']} min | {r['focus']} |")
    out += ["", "## Quiz", "", "Answer without notes first. Answers are in the collapsible section below.", ""]
    for i, q in enumerate(m["quiz"], 1):
        out.append(f"**Q{i}.** {q['q']}")
        out.append("")
        for j, o in enumerate(q["options"]):
            out.append(f"- {chr(65+j)}) {o}")
        out.append("")
    out += ["<details><summary>Answers and explanations</summary>", ""]
    for i, q in enumerate(m["quiz"], 1):
        out.append(f"- **Q{i}: {chr(65+q['answer'])}** — {q['explain']}")
    out += ["", "</details>", "", "## Exercises", ""]
    for e in m["exercises"]:
        out += [f"### {e['title']} ({e['level']})", "", e["task"], "", f"**Deliverable:** {e['deliverable']}", "", "**Done when:**"]
        out += [f"- [ ] {a}" for a in e["acceptance"]] + [""]
    if m.get("reflection"):
        out += ["## Reflection", ""] + [f"- {r}" for r in m["reflection"]] + [""]
    return "\n".join(out)


def pillar_dir(p: dict) -> str:
    return f"{p['id']}-{slug(p['title'])}"


def pillar_md(p: dict) -> str:
    c = p["capstone"]
    out = [f"# {p['id'].upper()} · {p['title']}", "", f"**Your current level:** {STATUS_BADGE[p['status']]}", ""]
    out += ["## Goal", "", p["goal"].strip(), "", "## Why this matters for you", "", p["why_now"].strip(), ""]
    hours = sum(m["hours"] for m in p["modules"])
    out += ["## Modules", "", f"Total: ~{hours} hours", "", "| Module | Hours | Quiz | Exercises |", "|---|---|---|---|"]
    for m in p["modules"]:
        out.append(f"| [{m['id'].upper()} · {m['title']}]({m['id']}-{slug(m['title'])}.md) | {m['hours']} | {len(m['quiz'])} Qs | {len(m['exercises'])} |")
    out += ["", f"## Capstone: {c['title']}", "", c["brief"].strip(), "", "**Deliverables**", ""]
    out += [f"- [ ] {d}" for d in c["deliverables"]] + ["", "**Graded on**", ""] + [f"- {r}" for r in c["rubric"]] + [""]
    return "\n".join(out)


def curriculum_md(pillars: list[dict]) -> str:
    total_h = sum(m["hours"] for p in pillars for m in p["modules"])
    total_m = sum(len(p["modules"]) for p in pillars)
    total_q = sum(len(m["quiz"]) for p in pillars for m in p["modules"])
    total_e = sum(len(m["exercises"]) for p in pillars for m in p["modules"])
    total_r = sum(len(m["readings"]) for p in pillars for m in p["modules"])
    out = ["# Full curriculum", "", "> Generated from `content/*.yaml` by `scripts/build.py`. Edit the YAML, not this file.", ""]
    out += [f"**{len(pillars)} pillars · {total_m} modules · ~{total_h} hours · {total_r} readings · {total_q} quiz questions · {total_e} exercises · {len(pillars)} capstones**", ""]
    out += ["Recommended order: " + " → ".join(p["id"].upper() for p in pillars if not p.get("parallel")) + " (P6 runs in parallel throughout).", ""]
    for p in pillars:
        out += [f"## [{p['id'].upper()} · {p['title']}](curriculum/{pillar_dir(p)}/README.md) — {STATUS_BADGE[p['status']]}", "", p["goal"].strip(), ""]
        for m in p["modules"]:
            out.append(f"- **[{m['id'].upper()}](curriculum/{pillar_dir(p)}/{m['id']}-{slug(m['title'])}.md) {m['title']}** (~{m['hours']} h)")
            for o in m["objectives"]:
                out.append(f"  - {o}")
        out += ["", f"**Capstone:** {p['capstone']['title']}", ""]
    return "\n".join(out)


def reading_list_md(pillars: list[dict]) -> str:
    out = ["# Reading list", "", "Every reading in the curriculum, by pillar. Required first.", ""]
    for p in pillars:
        out += [f"## {p['id'].upper()} · {p['title']}", ""]
        rows = [(m, r) for m in p["modules"] for r in m["readings"]]
        rows.sort(key=lambda x: (not x[1]["required"], x[0]["id"]))
        for m, r in rows:
            tag = "Required" if r["required"] else "Optional"
            out.append(f"- [ ] [{r['title']}]({r['url']}) — {r['author']} · {r['type']} · {r['minutes']} min · {tag} · {m['id'].upper()}")
        out.append("")
    return "\n".join(out)


def app_json(pillars: list[dict]) -> dict:
    md = markdown.Markdown(extensions=["tables", "fenced_code"])
    data = {"pass_mark": PASS_MARK, "path": PATH, "pillars": []}
    for p in pillars:
        pd = {k: p[k] for k in ("id", "order", "title", "status", "goal", "why_now", "capstone")}
        pd["parallel"] = bool(p.get("parallel"))
        pd["modules"] = []
        for m in p["modules"]:
            md.reset()
            mm = dict(m)
            mm["lesson_html"] = md.convert(m["lesson"])
            del mm["lesson"]
            pd["modules"].append(mm)
        data["pillars"].append(pd)
    return data


def main() -> int:
    pillars = load()
    errors = validate(pillars)
    if errors:
        print("Validation failed:\n" + "\n".join(f"  - {e}" for e in errors))
        return 1
    print(f"OK: {len(pillars)} pillars, {sum(len(p['modules']) for p in pillars)} modules valid")
    if "--check" in sys.argv:
        return 0
    for p in pillars:
        d = OUT / pillar_dir(p)
        d.mkdir(parents=True, exist_ok=True)
        (d / "README.md").write_text(pillar_md(p))
        for m in p["modules"]:
            (d / f"{m['id']}-{slug(m['title'])}.md").write_text(module_md(p, m))
    (ROOT / "CURRICULUM.md").write_text(curriculum_md(pillars))
    (ROOT / "docs").mkdir(exist_ok=True)
    (ROOT / "docs" / "reading-list.md").write_text(reading_list_md(pillars))
    APP_DATA.parent.mkdir(parents=True, exist_ok=True)
    data = app_json(pillars)
    APP_DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    # Self-contained single file (data inlined) for phones / artifact hosting.
    html = (ROOT / "app" / "index.html").read_text()
    inline = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    (ROOT / "app" / "standalone.html").write_text(html.replace("__CURRICULUM_JSON__", inline))
    print("Built curriculum/, CURRICULUM.md, docs/reading-list.md, app/data/curriculum.json, app/standalone.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
