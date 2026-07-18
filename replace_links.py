#!/usr/bin/env python3
"""
批量替换网站源码中的旧 GitHub 用户名/域名为新的
适用场景: JackNg88 -> jianwu-atlas 改名后的全站链接更新

使用方法:
    python3 replace_links.py --dry-run   # 先预览,不实际修改
    python3 replace_links.py             # 确认无误后正式执行
"""

import os
import re
import argparse
from pathlib import Path

# ============ 配置区:按需修改 ============

# 目标目录(你的网站源码根目录)
TARGET_DIR = "."  # 建议 cd 到仓库根目录后运行,这里用当前目录

# 需要处理的文件类型
FILE_EXTENSIONS = {".html", ".md", ".yml", ".yaml", ".json", ".css", ".js", ".Rmd"}

# 替换规则:(旧字符串, 新字符串)
# 注意顺序:先替换更具体/更长的字符串,避免被短字符串的替换污染
REPLACEMENTS = [
    ("jackng88.github.io", "jianwu-atlas.github.io"),
    ("github.com/JackNg88", "github.com/jianwu-atlas"),
    ("JackNg88.github.io", "jianwu-atlas.github.io"),  # 兼容大小写混用情况
    ("JackNg88", "jianwu-atlas"),  # 最后处理裸用户名,放最后避免误伤上面已替换的内容
]

# 需要跳过的目录(避免误改 .git 内部文件、node_modules 等)
SKIP_DIRS = {".git", "node_modules", ".github", "_site", "vendor"}

# ==========================================


def find_target_files(root_dir):
    """遍历目录,找出所有需要检查的文件"""
    target_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 就地修改 dirnames,跳过不需要遍历的目录
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fname in filenames:
            if Path(fname).suffix in FILE_EXTENSIONS:
                target_files.append(os.path.join(dirpath, fname))
    return target_files


def process_file(filepath, dry_run=True):
    """
    处理单个文件:检测并替换旧链接
    返回: (是否有修改, 修改详情列表)
    """
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except (UnicodeDecodeError, PermissionError):
        # 跳过无法用 utf-8 读取的文件(如二进制图片误被扩展名匹配到)
        return False, []

    original_content = content
    changes = []

    for old_str, new_str in REPLACEMENTS:
        count = content.count(old_str)
        if count > 0:
            changes.append(f"  '{old_str}' -> '{new_str}'  (共 {count} 处)")
            content = content.replace(old_str, new_str)

    has_changes = content != original_content

    if has_changes and not dry_run:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

    return has_changes, changes


def main():
    parser = argparse.ArgumentParser(description="批量替换网站源码中的旧 GitHub 链接")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="仅预览将要修改的文件和内容,不实际写入",
    )
    parser.add_argument(
        "--dir",
        default=TARGET_DIR,
        help="指定要扫描的根目录(默认当前目录)",
    )
    args = parser.parse_args()

    root_dir = os.path.abspath(args.dir)
    print(f"📂 扫描目录: {root_dir}")
    print(f"🔍 模式: {'预览 (dry-run)' if args.dry_run else '正式执行'}\n")

    target_files = find_target_files(root_dir)
    print(f"共找到 {len(target_files)} 个候选文件 (扩展名: {FILE_EXTENSIONS})\n")

    modified_files = []

    for filepath in target_files:
        has_changes, changes = process_file(filepath, dry_run=args.dry_run)
        if has_changes:
            modified_files.append(filepath)
            rel_path = os.path.relpath(filepath, root_dir)
            print(f"📝 {rel_path}")
            for c in changes:
                print(c)
            print()

    print("=" * 60)
    if args.dry_run:
        print(f"✅ 预览完成: 共 {len(modified_files)} 个文件包含待替换内容")
        print("👉 确认无误后,去掉 --dry-run 参数重新运行即可正式替换")
    else:
        print(f"✅ 替换完成: 共修改了 {len(modified_files)} 个文件")
        print("👉 建议立即执行 git diff 检查改动,再 git commit")


if __name__ == "__main__":
    main()
