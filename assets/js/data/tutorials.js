// ⚠️ 本文件由 scripts/build_tutorials.py 自动生成，请勿手动编辑！
// 如需增删教程，请修改 tutorials-src/ 下的 Markdown 源文件后重新运行构建脚本。

const tutorialsData = [
  {
    date: "2026-07-18",
    title: "科研 AI 提示词库：代码调试 / 图表规范 / 论文写作全场景模板",
    summary: "整理自 Gemini/Claude/ChatGPT 的科研提示词合集，涵盖 R/Python 代码续写与调试、单细胞分析、图表美化、Nature 风格论文写作等场景，可直接复用。",
    url: "tutorials/4_\u79d1\u7814 AI \u63d0\u793a\u8bcd\u5e93\uff1a\u4ee3\u7801\u8c03\u8bd5,\u56fe\u8868\u89c4\u8303,\u8bba\u6587\u5199\u4f5c\u5168\u573a\u666f\u6a21\u677f.html",
    cover: "https://github.com/JackNg88/jwtools/raw/main/man/figures/logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "jwtools", "AI提示词", "科研效率", "代码调试"]
  },
  {
    date: "2026-07-17",
    title: "如何把新函数整合成jwtools函数",
    summary: "记录如何将新写的 R 函数按 roxygen2 + testthat 规范整合进 jwtools 包，含依赖声明、文档生成与测试流程。",
    url: "tutorials/2_\u5982\u4f55\u628a\u65b0\u51fd\u6570\u6574\u5408\u6210jwtools\u51fd\u6570.html",
    cover: "",
    type: "tutorial",
    tags: ["Jian Wu", "R", "Seurat", "jwtools"]
  },
  {
    date: "2026-07-17",
    title: "build_table1_hlca_format函数",
    summary: "将 LungAgingERV 中构建 Table 1（HLCA 格式）的脚本重构为 jwtools 包函数 build_table1_hlca_format()，支持可配置白名单、可插拔 subject_ID 解析器，跨项目复用。",
    url: "tutorials/3_build_table1_hlca_format\u51fd\u6570.html",
    cover: "",
    type: "tutorial",
    tags: ["Jian Wu", "R", "Seurat", "jwtools"]
  },
  {
    date: "2026-07-16",
    title: "如何查看jwtools包里有哪些可用函数",
    summary: "介绍 6 种在 R 中查找已安装包导出函数的方法，从 ls() 到 NAMESPACE 源码核查，并以自建包 jwtools 为例演示。",
    url: "tutorials/1_\u67e5\u770bjwtools\u6709\u54ea\u4e9b\u51fd\u6570.html",
    cover: "",
    type: "tutorial",
    tags: ["Jian Wu", "R", "jwtools", "R包开发"]
  },
  {
    date: "2026-07-16",
    title: "导出AI已存储的记忆",
    summary: "导出 Claude 中已存储的用户记忆与背景信息，用于迁移至其他 AI 助理。",
    url: "tutorials/50_\u5bfc\u51fa\u5df2\u5b58\u50a8\u7684\u8bb0\u5fc6.html",
    cover: "",
    type: "tutorial",
    tags: ["Jian Wu", "AI", "记忆管理", "工具"]
  },
  {
    date: "2026-07-16",
    title: "将记忆导入Gemini",
    summary: "从 Claude 记忆导出的用户背景摘要，用于迁移到 Gemini 等其他 AI 助理，涵盖研究方向、工作偏好与指令设定。",
    url: "tutorials/51_\u5c06\u8bb0\u5fc6\u5bfc\u5165Gemini.html",
    cover: "",
    type: "tutorial",
    tags: ["Jian Wu", "AI", "记忆管理", "工具"]
  },
  {
    date: "2026-07-16",
    title: "如何上传模版文件",
    summary: "这里写一句话摘要，会显示在列表卡片和搜索引擎摘要里，建议 1-2 句话，不超过 150 字符左右。",
    url: "tutorials/\u5982\u4f55\u4e0a\u4f20\u6a21\u7248\u6587\u4ef6.html",
    cover: "",
    type: "tutorial",
    tags: ["R", "Seurat", "标签3"]
  },
  {
    date: "2025-11-20",
    title: "模版",
    summary: "模版: 这里写一句话摘要，会显示在列表卡片和搜索引擎摘要里，建议 1-2 句话，不超过 150 字符左右。",
    url: "tutorials/\u6a21\u7248.html",
    cover: "",
    type: "tutorial",
    tags: ["R", "Seurat", "标签3"]
  },
  {
    date: "2025-11-13",
    title: "Markdown-to-HTML build pipelines模版",
    summary: "This is a test entry to verify the Markdown-to-HTML build pipeline works correctly.",
    url: "tutorials/Markdown-to-HTML build pipelines\u6a21\u7248.html",
    cover: "",
    type: "tutorial",
    tags: ["Test"]
  }
];
