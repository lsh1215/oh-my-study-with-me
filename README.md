<p align="center">
  <a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a>
</p>

<div align="center">

# oh-my-study-with-me

[![GitHub stars](https://img.shields.io/github/stars/lsh1215/oh-my-study-with-me?style=flat&color=yellow)](https://github.com/lsh1215/oh-my-study-with-me/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**First Principles learning plugin for Claude Code.**

*Read a book. Extract the principles. Validate your understanding. Repeat.*

[Get Started](#get-started) · [Skills](#skills) · [Workflow](#workflow)

</div>

---

## Get Started

**Step 1:** Register the marketplace
```
/plugin marketplace add https://github.com/lsh1215/oh-my-study-with-me
```

**Step 2:** Install the plugin
```
/plugin install oh-my-study-with-me
```

That's it. Start studying. The short alias is **`swm`**.

---

## What It Does

| When You... | It Automatically... |
|-------------|---------------------|
| Open a book PDF | Extracts principles, starts Socratic dialogue |
| Say "study kafka" | Finds the book, picks up where you left off |
| Finish a chapter | Validates with Feynman test, code challenge, or design problem |
| Get something wrong | Tracks the weak concept, revisits it next session |
| Want to write about it | Drafts a blog with Toulmin argumentation |
| Want hands-on practice | Spins up a Docker lab with monitoring |

**You don't need to memorize commands.** Just describe what you want in natural language.

---

## Skills

| Skill | What It Does |
|-------|-------------|
| `study` | Deep learning session — PDF reading, First Principles dialogue, type-based validation, metacognition tracking |
| `study-vault` | Pre-study note generation — dashboard, quick-reference, concept-compare, practice problems |
| `setup-quiz` | ⚠️ *Experimental* — Slack daily quiz system, GitHub Actions + Leitner spaced repetition |
| `blog` | Technical blog writing — Orwell clarity, Toulmin argumentation, Steel Man rebuttal |
| `lab` | Docker lab environments — Kafka, ES, MySQL, Redis with Prometheus + Grafana |

---

## How to Invoke

Four ways to call any skill:

**`swm` prefix** (recommended)
```
swm:study kafka
swm:blog kafka producer
swm:lab redis
```

**Slash commands** (explicit)
```
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:blog kafka producer
```

**Colon patterns** (bare skill name)
```
study : kafka
blog : kafka producer
lab : redis
```

**Natural language** (just talk)
```
Let's study the Kafka book
Write a blog post about producers
Spin up a Redis lab
```

Works in both English and Korean.

---

## Workflow

```
study-vault ─── Grasp the full book structure first
  └── Dashboard + Quick-Reference + Concept-Compare + Practice
                    ↓
study ─── Deep dive into each chapter (🟦🟩🟨🟥⬜ metacognition)
  ├── Validation → quiz_bank.json
  │                    ↓
  │   setup-quiz ─── Daily Slack quizzes via GitHub Actions
  │
  ├── "I want to try it" → lab
  │                          ↓
  │   lab ─── Docker Compose → Monitor → Observe → Analyze
  │
  └── Study memo → study-notes/
                         ↓
      blog ─── Skeleton → Draft → Kill Your Darlings → Notion
```

---

## Metacognition Tracking

Every concept you study is tracked individually:

| Badge | Meaning | Accuracy |
|-------|---------|----------|
| 🟦 | Mastered | 90%+ (3+ attempts) |
| 🟩 | Good | 70-89% |
| 🟨 | Average | 40-69% |
| 🟥 | Weak | 0-39% |
| ⬜ | Not tested | — |

Weak concepts are automatically prioritized in your next session.

---

## Requirements

- [Claude Code](https://docs.anthropic.com/claude-code) CLI
- Book PDFs in your project's `books/` directory
- Docker (for `lab` skill only)
- Slack + GitHub Actions (for `setup-quiz` skill only)

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

**Read deeply. Validate honestly. Write clearly.**

</div>
