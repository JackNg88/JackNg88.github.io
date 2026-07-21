#!/usr/bin/env python3
"""
================================================================
Cloudflare Web Analytics 批量插入 / 升级脚本
适用: jianwu-atlas.github.io 静态站点
功能:
  1. 对尚未插入过 Cloudflare 代码的页面 -> 插入新版 snippet(含 jw_skip 自跳过逻辑)
  2. 对已存在旧版 Cloudflare snippet 的页面(index.html/contact.html) -> 升级为新版
用法:
  cd /path/to/jianwu-atlas.github.io
  python3 upgrade_cf_analytics.py
  git diff   # 确认改动无误后再 push
================================================================
"""

import re
from pathlib import Path

TOKEN = "ccb5353e9ca04cfcaab486784d4870ff"

NEW_SNIPPET = f"""<!-- Cloudflare Web Analytics (admin self-skip via ?jw_skip=1) -->
<script>
(function () {{
  try {{
    var params = new URLSearchParams(window.location.search);
    if (params.get('jw_skip') === '1') {{
      window.localStorage.setItem('jw_admin_skip_analytics', '1');
    }}
    if (window.localStorage && window.localStorage.getItem('jw_admin_skip_analytics') === '1') {{
      return; // 管理员自用设备，跳过上报
    }}
  }} catch (e) {{}}
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{{"token": "{TOKEN}"}}');
  document.head.appendChild(s);
}})();
</script>
<!-- End Cloudflare Web Analytics -->"""

# 匹配任意旧版 Cloudflare snippet(包括最早的<script type='module' ...>版本)
OLD_SNIPPET_PATTERN = re.compile(
    r"<!-- Cloudflare Web Analytics.*?-->.*?<!-- End Cloudflare Web Analytics -->",
    re.DOTALL
)

# 所有需要处理的页面(新增 + 已存在需升级的)
ALL_PAGES = [
    "index.html", "contact.html",                          # 已存在旧版，需升级
    "experience.html", "publications.html", "conferences.html",
    "expertise.html", "tutorials.html", "news.html", "gallery.html"  # 全新插入
]


def process_file(file_path: Path):
    if not file_path.exists():
        print(f"⚠️  文件不存在，跳过: {file_path.name}")
        return

    text = file_path.read_text(encoding="utf-8")

    # 情况 A：已经是最新版（含 jw_admin_skip_analytics），跳过
    if "jw_admin_skip_analytics" in text:
        print(f"⏭️  已是最新版，跳过: {file_path.name}")
        return

    # 情况 B：存在旧版 snippet -> 替换升级
    if OLD_SNIPPET_PATTERN.search(text):
        new_text = OLD_SNIPPET_PATTERN.sub(NEW_SNIPPET, text)
        file_path.write_text(new_text, encoding="utf-8")
        print(f"🔄 已升级为新版(含自跳过逻辑): {file_path.name}")
        return

    # 情况 C：完全没有 Cloudflare 代码 -> 插入
    if "</body>" not in text:
        print(f"⚠️  未找到 </body>标签，无法插入，请手动检查: {file_path.name}")
        return

    idx = text.rfind("</body>")  # 定位最后一个 </body>，防止多 body 误插
    new_text = text[:idx] + NEW_SNIPPET + "\n" + text[idx:]
    file_path.write_text(new_text, encoding="utf-8")
    print(f"✅ 已插入新版(含自跳过逻辑): {file_path.name}")


if __name__ == "__main__":
    root = Path(".")
    for name in ALL_PAGES:
        process_file(root / name)

    print("\n全部处理完成。请执行以下命令确认 diff 后 push：")
    print("  git diff")
    print("  git add . && git commit -m '为所有页面添加/升级 Cloudflare Web Analytics 自跳过逻辑(jw_skip)' && git push")
