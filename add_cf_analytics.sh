#!/bin/bash
# ================================================
# Cloudflare Web Analytics 批量插入脚本
# 适用于: jianwu-atlas.github.io 静态站点
# 已知已插入: index.html, contact.html（跳过，避免重复插入）
# ================================================

TOKEN="ccb5353e9ca04cfcaab486784d4870ff"
CF_SNIPPET="<!-- Cloudflare Web Analytics -->\n<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{\"token\": \"${TOKEN}\"}'></script>\n<!-- End Cloudflare Web Analytics -->"

for file in experience.html publications.html conferences.html expertise.html tutorials.html news.html gallery.html; do
  if [ ! -f "$file" ]; then
    echo "⚠️  文件不存在，跳过: $file"
    continue
  fi

  if grep -q "cloudflareinsights.com" "$file"; then
    echo "⏭️  已存在 Cloudflare 代码，跳过: $file"
    continue
  fi

  # 在最后一个 </body> 之前插入代码块（macOS BSD sed 兼容写法）
  sed -i '' "s#</body>#${CF_SNIPPET}\n</body>#" "$file"
  echo "✅ 已插入 Cloudflare Analytics: $file"
done

echo ""
echo "全部处理完成。请执行以下命令确认 diff 后 push:"
echo "  git diff"
echo "  git add . && git commit -m 'Add Cloudflare Web Analytics to all pages' && git push"
