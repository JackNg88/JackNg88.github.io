---
title: "logo 素材"
date: 2026-07-19
summary: "整理 Jian Wu / jwtools 品牌 logo 的全部产出版本，涵盖横排字标、方形字标、竖版组合三大系列及各场合适配尺寸（GitHub、社交媒体、PPT、邮件签名等）。"
type: tutorial
tags: ["Jian Wu", "jwtools", "R", "Seurat", "标签3"]
cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png"
#cover: "https://jianwu-atlas.github.io/assets/img/logos/jwtools_logo_social_preview.png"
#cover: "https://github.com/jianwu-atlas/jwtools/raw/main/man/figures/logo.png"
---

目前一共产出了这些版本,按场合整理如下:

**原始三件套(最初生成的)**

| 文件 | 尺寸 | 场合 |
|---|---|---|
| `horizontal_lockup` | 1400×420 | GitHub README 顶部横幅 / 网站 header |
| `icon_avatar` | 512×512 | GitHub 组织头像 |
| `X_banner` | 1500×500 | X(Twitter)个人主页头图 |

**方形字标衍生尺寸**(均来自 2048 高清母版)

| 文件 | 尺寸 | 场合 |
|---|---|---|
| `favicon.ico` | 16~128多档 | 网站浏览器标签图标 |
| `icon_badge_128` | 128×128 | GitHub README 内嵌小图标、Slack头像、微信头像 |
| `icon_signature_256` | 256×256 | 邮件签名档 |
| `icon_slide_360` | 360×360 | PPT/Keynote 幻灯片角标 |
| `icon_poster_600` | 600×600 | 海报/易拉宝角标(打印前建议再确认DPI,理想仍是矢量) |
| `icon_master_2048` | 2048×2048 | 高清母版,不直接用,需要更大尺寸时从这裁剪缩放 |

**横排组合标衍生尺寸**(来自1400px原图,分辨率上限较低)

| 文件 | 尺寸 | 场合 |
|---|---|---|
| `lockup_email_signature_350` | 350×105 | 邮件签名底部横幅条 |
| `lockup_slide_footer_500` | 500×150 | 幻灯片页脚水印 |

**新版式**

| 文件 | 尺寸 | 场合 |
|---|---|---|
| `stacked_vertical` | ~1160×1062 | 图标居中、文字上下排布——适合方形/竖版位置,比如小红书/知乎封面图、公众号封面、竖版海报主视觉、App 启动页 |

一个提醒:`lockup_*` 系列(横排相关的三个)因为源头只有 1400px 宽且副标题被截断了 "H",清晰度和完整性都不如方形字标系列——需要更高质量的横版场合(比如打印或大尺寸展示),建议优先用 `stacked_vertical` 或单独的 `icon_master_2048`,横排字标那部分暂时还是有缺陷的。
