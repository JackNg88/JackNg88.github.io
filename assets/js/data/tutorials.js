// ⚠️ 本文件由 scripts/build_tutorials.py 自动生成，请勿手动编辑！
// 如需增删教程，请修改 tutorials-src/ 下的 Markdown 源文件后重新运行构建脚本。

const tutorialsData = [
  {
    date: "2026-07-30",
    title: "DRAGEN 分析",
    summary: "DRAGEN Single Cell RNA 分析踩坑记录：BaseSpace 表单必填项排查、PIPseq 条码架构解读、UMI 长度异常核实全过程。",
    url: "tutorials/2_3-DRAGEN \u5206\u6790.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "jwtools", "PH project", "DRAGEN", "Illumina"]
  },
  {
    date: "2026-07-29",
    title: "Illumina BaseSpace: scRNA-seq Analysis with the DRAGEN Pipeline",
    summary: "介绍如何在 Illumina BaseSpace 平台上使用 DRAGEN Single Cell RNA 流程分析 scRNA-seq 数据，涵盖账号注册、CLI 安装配置，以及项目文件的上传下载操作。",
    url: "tutorials/2_2-Illumina BaseSpace.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "jwtools", "Illumina", "BaseSpace", "DRAGEN", "scRNA-seq", "CLI"]
  },
  {
    date: "2026-07-18",
    title: "科研 AI 提示词库：代码调试 / 图表规范 / 论文写作全场景模板",
    summary: "科研 AI 提示词库：代码调试 / 图表规范 / 论文写作全场景模板. 整理自 Gemini/Claude/ChatGPT 的科研提示词合集，涵盖 R/Python 代码续写与调试、单细胞分析、图表美化、Nature 风格论文写作等场景，可直接复用。",
    url: "tutorials/4_\u79d1\u7814 AI \u63d0\u793a\u8bcd\u5e93.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "jwtools", "AI提示词", "科研效率", "代码调试"]
  },
  {
    date: "2026-07-17",
    title: "如何把新函数整合成jwtools函数",
    summary: "记录如何将新写的 R 函数按 roxygen2 + testthat 规范整合进 jwtools 包，含依赖声明、文档生成与测试流程。",
    url: "tutorials/2_1-\u5982\u4f55\u628a\u65b0\u51fd\u6570\u6574\u5408\u6210jwtools\u51fd\u6570.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/jwtools_logo_social_preview.png",
    type: "tutorial",
    tags: ["Jian Wu", "R", "Seurat", "jwtools"]
  },
  {
    date: "2026-07-16",
    title: "如何查看jwtools包里有哪些可用函数",
    summary: "介绍 6 种在 R 中查找已安装包导出函数的方法，从 ls() 到 NAMESPACE 源码核查，并以自建包 jwtools 为例演示。",
    url: "tutorials/1_\u67e5\u770bjwtools\u6709\u54ea\u4e9b\u51fd\u6570.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/jwtools_logo_social_preview.png",
    type: "tutorial",
    tags: ["Jian Wu", "R", "jwtools", "R包开发"]
  },
  {
    date: "2026-07-16",
    title: "导出AI已存储的记忆",
    summary: "导出 Claude 中已存储的用户记忆与背景信息，用于迁移至其他 AI 助理。",
    url: "tutorials/50_\u5bfc\u51fa\u5df2\u5b58\u50a8\u7684\u8bb0\u5fc6.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "AI", "记忆管理", "工具"]
  },
  {
    date: "2026-07-16",
    title: "将记忆导入Gemini",
    summary: "从 Claude 记忆导出的用户背景摘要，用于迁移到 Gemini 等其他 AI 助理，涵盖研究方向、工作偏好与指令设定。",
    url: "tutorials/51_\u5c06\u8bb0\u5fc6\u5bfc\u5165Gemini.html",
    cover: "https://jianwu-atlas.github.io/assets/img/logos/Jian_Wu_logo.png",
    type: "tutorial",
    tags: ["Jian Wu", "AI", "记忆管理", "工具"]
  }
];
