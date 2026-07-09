"""
域名迁移脚本：jackng88.github.io → jianwu-atlas.eu.org
使用时机：eu.org 域名审批通过、DNS 生效、GitHub Pages 自定义域名配置完成后运行
"""

import re
import pathlib

OLD_DOMAIN = "https://jackng88.github.io"
NEW_DOMAIN = "https://jianwu-atlas.eu.org"

# 需要处理的文件（HTML 页面 + sitemap + robots）
TARGET_FILES = [
    "index.html",
    "experience.html",
    "publications.html",
    "conferences.html",
    "expertise.html",
    "tutorials.html",
    "news.html",
    "gallery.html",
    "contact.html",
    "sitemap.xml",
    "robots.txt",
]

def main():
    total_replacements = 0
    for fname in TARGET_FILES:
        path = pathlib.Path(fname)
        if not path.exists():
            print(f"⚠️  跳过：{fname} 不存在")
            continue

        text = path.read_text(encoding="utf-8")
        new_text, n_subs = re.subn(re.escape(OLD_DOMAIN), NEW_DOMAIN, text)

        if n_subs == 0:
            print(f"⏭️  {fname}: 未发现旧域名引用，跳过")
            continue

        path.write_text(new_text, encoding="utf-8")
        print(f"✅ {fname}: 替换 {n_subs} 处")
        total_replacements += n_subs

    print(f"\n🎉 完成，共替换 {total_replacements} 处域名引用")

if __name__ == "__main__":
    main()
