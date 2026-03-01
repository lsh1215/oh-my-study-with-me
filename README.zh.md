<p align="center">
  <a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · 中文
</p>

<div align="center">

# oh-my-study-with-me

[![GitHub stars](https://img.shields.io/github/stars/lsh1215/oh-my-study-with-me?style=flat&color=yellow)](https://github.com/lsh1215/oh-my-study-with-me/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**适用于 Claude Code 的 First Principles 学习插件。**

*读书。提炼原理。验证理解。反复循环。*

[快速开始](#快速开始) · [技能](#技能) · [工作流程](#工作流程)

</div>

---

## 快速开始

**第一步：** 注册插件市场
```
/plugin marketplace add https://github.com/lsh1215/oh-my-study-with-me
```

**第二步：** 安装插件
```
/plugin install oh-my-study-with-me
```

就这些。开始学习吧。短别名为 **`swm`**。

---

## 功能简介

| 当你… | 它会自动… |
|-------|----------|
| 打开一本书的 PDF | 提取原理，开启苏格拉底式对话 |
| 说"study kafka" | 找到对应的书，从上次进度继续 |
| 完成一个章节 | 用 Feynman 测试、代码挑战或设计题进行验证 |
| 答错某个概念 | 记录薄弱点，下次学习时优先复习 |
| 想写技术博客 | 用 Toulmin 论证框架起草博客文章 |
| 想动手实践 | 启动带监控的 Docker 实验环境 |

**无需记忆命令。** 用自然语言描述你想做的事即可。

---

## 技能

| 技能 | 功能说明 |
|------|---------|
| `study` | 深度学习会话 — PDF 阅读、First Principles 对话、基于类型的验证、元认知追踪 |
| `study-vault` | 预习笔记生成 — 仪表盘、速查手册、概念对比、练习题 |
| `setup-quiz` | ⚠️ *实验性* — Slack 每日测验系统，GitHub Actions + Leitner 间隔重复 |
| `blog` | 技术博客写作 — Orwell 清晰原则、Toulmin 论证、Steel Man 反驳 |
| `lab` | Docker 实验环境 — Kafka、ES、MySQL、Redis，配合 Prometheus + Grafana |

---

## 调用方式

共有四种调用任意技能的方式：

**`swm` 前缀**（推荐）
```
swm:study kafka
swm:blog kafka producer
swm:lab redis
```

**斜杠命令**（显式调用）
```
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:blog kafka producer
```

**冒号模式**（直接技能名）
```
study : kafka
blog : kafka producer
lab : redis
```

**自然语言**（直接说话）
```
Let's study the Kafka book
Write a blog post about producers
Spin up a Redis lab
```

支持英语和韩语。

---

## 工作流程

```
study-vault ─── 先把握全书结构
  └── 仪表盘 + 速查手册 + 概念对比 + 练习题
                    ↓
study ─── 深入每个章节（🟦🟩🟨🟥⬜ 元认知）
  ├── 验证 → quiz_bank.json
  │                    ↓
  │   setup-quiz ─── 通过 GitHub Actions 每日推送 Slack 测验
  │
  ├── "我想动手试试" → lab
  │                          ↓
  │   lab ─── Docker Compose → 监控 → 观察 → 分析
  │
  └── 学习备忘 → study-notes/
                         ↓
      blog ─── 骨架 → 草稿 → 删除冗余 → Notion
```

---

## 元认知追踪

你学习的每个概念都会被单独追踪：

| 徽章 | 含义 | 正确率 |
|------|------|--------|
| 🟦 | 已掌握 | 90% 以上（3 次以上尝试） |
| 🟩 | 良好 | 70–89% |
| 🟨 | 一般 | 40–69% |
| 🟥 | 薄弱 | 0–39% |
| ⬜ | 未测试 | — |

薄弱概念会在下次学习时自动优先复习。

---

## 环境要求

- [Claude Code](https://docs.anthropic.com/claude-code) CLI
- 书籍 PDF 放置在项目的 `books/` 目录下
- Docker（仅 `lab` 技能需要）
- Slack + GitHub Actions（仅 `setup-quiz` 技能需要）

---

## 许可证

MIT — 详见 [LICENSE](LICENSE)

---

<div align="center">

**深度阅读。诚实验证。清晰表达。**

</div>
