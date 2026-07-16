#!/usr/bin/env python3
"""
scripts/build_tutorials.py
===============================================================
Converts new Markdown tutorial sources (tutorials-src/*.md) into:

  1. A styled HTML page  → tutorials/<slug>.html
     (built from tutorials/template.html)
  2. An appended card entry in assets/js/data/tutorials.js

Design goals:
  - Idempotent: re-running does NOT duplicate entries or
    regenerate unchanged files (compares mtimes / checks for
    existing marker in tutorials.js).
  - Non-destructive: never touches existing hand-written
    tutorials (ep00-intro.html, ep01-scrna-pipeline.html) or
    their existing tutorials.js entries.
  - Zero-config authoring: you only ever create/edit files in
    tutorials-src/*.md — everything else is derived.
===============================================================
"""

import re
import sys
from pathlib import Path

import frontmatter
import markdown

SRC_DIR = Path("tutorials-src")
OUT_DIR = Path("tutorials")
TEMPLATE_PATH = OUT_DIR / "template.html"
TUTORIALS_JS_PATH = Path("assets/js/data/tutorials.js")

MD_EXTENSIONS = ["fenced_code", "tables", "toc", "sane_lists"]

REQUIRED_FRONTMATTER_FIELDS = ["title", "date", "summary"]

TUTORIALS_JS_ENTRY_TEMPLATE = """  {{
    date: "{date}",
    title: "{title}",
    summary: "{summary}",
    url: "tutorials/{slug}.html",
    cover: "{cover}",
    type: "{type}",
    tags: [{tags}]
  }},
"""


def slug_of(md_path: Path) -> str:
    """ep02-trajectory-analysis.md -> ep02-trajectory-analysis"""
    return md_path.stem


def fix_image_paths(html: str) -> str:
    """
    Markdown is authored with root-relative image paths, e.g.:
        src="assets/img/tutorials/ep02-xxx/fig1.png"
    But the generated page lives one directory below site root
    (tutorials/<slug>.html), so we rewrite to:
        src="../assets/img/tutorials/ep02-xxx/fig1.png"
    """
    return re.sub(r'src="assets/', 'src="../assets/', html)


def render_page(template: str, meta: dict, body_html: str) -> str:
    tags = meta.get("tags", [])
    tags_html = "\n          ".join(
        f'<span class="tag tag-g">{t}</span>' for t in tags
    )
    replacements = {
        "{{TITLE}}": str(meta.get("title", "")),
        "{{DATE}}": str(meta.get("date", "")),
        "{{SUMMARY}}": str(meta.get("summary", "")),
        "{{TAGS_HTML}}": tags_html,
        "{{CONTENT}}": body_html,
    }
    html = template
    for placeholder, value in replacements.items():
        html = html.replace(placeholder, value)
    return html


def append_to_tutorials_js(meta: dict, slug: str) -> None:
    js_text = TUTORIALS_JS_PATH.read_text(encoding="utf-8")

    marker = f'url: "tutorials/{slug}.html"'
    if marker in js_text:
        print(f"[skip] tutorials.js already has an entry for '{slug}'")
        return

    tags = meta.get("tags", [])
    tags_str = ", ".join(f'"{t}"' for t in tags)

    entry = TUTORIALS_JS_ENTRY_TEMPLATE.format(
        date=meta.get("date", ""),
        title=str(meta.get("title", "")).replace('"', '\\"'),
        summary=str(meta.get("summary", "")).replace('"', '\\"'),
        slug=slug,
        cover=meta.get("cover", ""),
        type=meta.get("type", "tutorial"),
        tags=tags_str,
    )

    idx = js_text.rfind("];")
    if idx == -1:
        sys.exit("ERROR: could not locate closing '];' in tutorials.js — "
                  "check that the file still ends with `const tutorialsData = [ ... ];`")

    new_js = js_text[:idx] + entry + js_text[idx:]
    TUTORIALS_JS_PATH.write_text(new_js, encoding="utf-8")
    print(f"[ok]  appended '{slug}' to tutorials.js")


def process_one(md_path: Path, template: str) -> None:
    slug = slug_of(md_path)
    out_path = OUT_DIR / f"{slug}.html"

    # Incremental build: skip if output is newer than source
    if out_path.exists() and out_path.stat().st_mtime >= md_path.stat().st_mtime:
        print(f"[skip] '{slug}.html' is already up to date")
        return

    post = frontmatter.load(md_path)
    meta = post.metadata

    missing = [f for f in REQUIRED_FRONTMATTER_FIELDS if f not in meta]
    if missing:
        sys.exit(f"ERROR: {md_path} is missing required front matter field(s): {missing}\n"
                  f"Required: {REQUIRED_FRONTMATTER_FIELDS}")

    body_html = markdown.markdown(post.content, extensions=MD_EXTENSIONS)
    body_html = fix_image_paths(body_html)

    page_html = render_page(template, meta, body_html)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page_html, encoding="utf-8")
    print(f"[ok]  generated '{out_path}'")

    append_to_tutorials_js(meta, slug)


def main() -> None:
    if not SRC_DIR.exists():
        print(f"No '{SRC_DIR}/' folder found — nothing to build.")
        return

    if not TEMPLATE_PATH.exists():
        sys.exit(f"ERROR: template not found at '{TEMPLATE_PATH}'. "
                  f"See the template.html provided alongside this script.")

    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    md_files = sorted(SRC_DIR.glob("*.md"))
    if not md_files:
        print(f"No markdown files found in '{SRC_DIR}/'.")
        return

    for md_path in md_files:
        process_one(md_path, template)


if __name__ == "__main__":
    main()
