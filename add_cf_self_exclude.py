#!/usr/bin/env python3
"""
批量插入/升级 Cloudflare Web Analytics（自排除版）到多个 HTML 页面
适用于: jackng88.github.io 静态站点

功能：
1. 如果文件已有"旧版"Cloudflare 代码（无自排除逻辑）→ 自动替换为新版
2. 如果文件完全没有 Cloudflare 代码 → 在 </body> 前插入新版
3. 如果已经是自排除版 → 跳过
4. 如果找不到 </body> → 报错并打印文件末尾内容辅助诊断
"""

import os
import re

# ── 需要处理的页面列表 ──
TARGET_FILES = [
    "experience.html",
    "publications.html",
    "conferences.html",
    "expertise.html",
    "tutorials.html",
    "news.html",
    "gallery.html",
]

CF_TOKEN = "ccb5353e9ca04cfcaab486784d4870ff"

CF_SNIPPET = f"""
<!-- ══════════════════════════════════════════
     Cloudflare Web Analytics (Self-Exclusion Enabled)
     ══════════════════════════════════════════ -->
<script>
(function() {{
  var params = new URLSearchParams(window.location.search);
  if (params.get('notrack') === '1') {{
    localStorage.setItem('cf_notrack', '1');
    console.log('[Analytics] Self-visit tracking disabled for this browser.');
  }}

  if (localStorage.getItem('cf_notrack') !== '1') {{
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', '{{"token": "{CF_TOKEN}"}}');
    document.body.appendChild(s);
  }}
}})();
</script>
<!-- End Cloudflare Web Analytics -->
"""

# 匹配旧版 Cloudflare 代码块的正则（兼容 defer / type='module'，单行或带注释包裹）
OLD_CF_PATTERN = re.compile(
    r"<!--\s*Cloudflare Web Analytics\s*-->.*?</script>\s*(<!--\s*End Cloudflare Web Analytics\s*-->)?",
    re.DOTALL | re.IGNORECASE
)


def process_file(filepath: str) -> str:
    if not os.path.isfile(filepath):
        return f"⚠️  文件不存在，跳过: {filepath}"

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 情况 1：已经是自排除版本 → 跳过
    if "cf_notrack" in content:
        return f"⏭️  已存在自排除版本，跳过: {filepath}"

    # 情况 2：检测到旧版代码 → 自动替换
    if "cloudflareinsights.com" in content:
        new_content, n = OLD_CF_PATTERN.subn(CF_SNIPPET.strip(), content, count=1)
        if n > 0:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            return f"🔄 已自动替换旧版为自排除版: {filepath}"
        else:
            return f"⚠️  检测到 cloudflareinsights.com 字符串但正则未匹配成功，需人工检查: {filepath}"

    # 情况 3：完全没有 Cloudflare 代码 → 尝试在 </body> 前插入（大小写不敏感）
    body_close_pattern = re.compile(r"</body\s*>", re.IGNORECASE)
    if not body_close_pattern.search(content):
        # 诊断信息：打印文件末尾 300 字符，帮助定位问题
        tail_preview = content[-300:] if len(content) > 300 else content
        return (f"❌ 未找到 </body> 标签，无法插入: {filepath}\n"
                f"   ── 文件末尾预览 ──\n{tail_preview}\n"
                f"   ── 预览结束 ──")

    new_content = body_close_pattern.sub(CF_SNIPPET.strip() + "\n</body>", content, count=1)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    return f"✅ 已全新插入 Cloudflare Analytics（自排除版）: {filepath}"


def main():
    print("=" * 60)
    print("Cloudflare Web Analytics 批量插入/升级脚本（自排除版 v2）")
    print("=" * 60)

    for f in TARGET_FILES:
        print(process_file(f))
        print()  # 空行分隔，便于阅读诊断信息

    print("=" * 60)
    print("全部处理完成。请执行以下命令确认 diff 后 push:")
    print("  git diff")
    print("  git add . && git commit -m 'Upgrade Cloudflare analytics to self-exclusion version' && git push")


if __name__ == "__main__":
    main()
