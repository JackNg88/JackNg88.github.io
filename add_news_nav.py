"""
批量在所有页面的 nav-links 中插入 "News" 链接
插入位置：紧跟在 <a href="tutorials.html">Tutorials</a> 之后
"""

import re
import pathlib

TARGET_FILES = [
    "index.html",
    "experience.html",
    "publications.html",
    "conferences.html",
    "expertise.html",
    "tutorials.html",
    "gallery.html",
    "contact.html",
]

# 匹配 Tutorials 链接（允许 active class 存在与否）
TUTORIALS_PATTERN = re.compile(r'(<a href="tutorials\.html"[^>]*>Tutorials</a>)')

def main():
    for fname in TARGET_FILES:
        path = pathlib.Path(fname)
        if not path.exists():
            print(f"⚠️  跳过：{fname} 不存在")
            continue

        text = path.read_text(encoding="utf-8")

        if 'href="news.html"' in text:
            print(f"⏭️  {fname}: 已包含 News 链接，跳过")
            continue

        new_text, n_subs = TUTORIALS_PATTERN.subn(
            r'\1\n      <a href="news.html">News</a>',
            text,
            count=1
        )

        if n_subs == 0:
            print(f"❌ {fname}: 未匹配到 Tutorials 链接，请手动检查该文件 <nav> 部分")
            continue

        path.write_text(new_text, encoding="utf-8")
        print(f"✅ {fname}: 成功插入 News 链接（位于 Tutorials 之后）")

if __name__ == "__main__":
    main()
