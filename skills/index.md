---
description: Shows the full skill index and integration relationships for the oh-my-study-with-me plugin.
user-invocable: true
---

# oh-my-study-with-me Skill Index

This plugin provides an integrated workflow for First Principles-based technical learning.

---

## Skill Catalog

### 📖 Learning (study)
| Skill | Invocation | Description |
|---|---|---|
| [study](study/SKILL.md) | `/oh-my-study-with-me:study` | First Principles learning session (PDF → principles → dialogue → validation) + per-concept metacognition tracking |
| [study-vault](study-vault/SKILL.md) | `/oh-my-study-with-me:study-vault` | Book PDF → structured study notes (dashboard/quick-reference/concept-compare) |
| [setup-quiz](setup-quiz/SKILL.md) | `/oh-my-study-with-me:setup-quiz` | ⚠️ *Experimental* — Slack daily review quiz system (GitHub Actions + Leitner) |

### ✍️ Writing
| Skill | Invocation | Description |
|---|---|---|
| [blog](blog/SKILL.md) | `/oh-my-study-with-me:blog` | Technical blog writing (Orwell + Toulmin + Steel Man + clean prose) |

### 🔬 Lab
| Skill | Invocation | Description |
|---|---|---|
| [lab](lab/SKILL.md) | `/oh-my-study-with-me:lab` | Docker Compose lab environments (Kafka/ES/MySQL/Redis + monitoring) |

---

## Shortcut Invocation

When the skill-router hook is active, these patterns also work:

```
study : kafka          →  /oh-my-study-with-me:study kafka
study-vault : kafka    →  /oh-my-study-with-me:study-vault kafka
blog : kafka producer  →  /oh-my-study-with-me:blog kafka producer
lab : kafka            →  /oh-my-study-with-me:lab kafka
```

---

## Integration Relationships

```
/study-vault (pre-study notes) ─── Generate structured notes before reading the book
  └── Dashboard + Quick-Reference + Concept-Compare + Concept/Practice Notes
                    ↓ (Deep learning based on notes)
/study (learning session) ─── Per-concept metacognition tracking (🟦🟩🟨🟥⬜)
  ├── Phase 3 validation → Auto-save quizzes to quiz_bank.json
  │                       ↓
  │   /setup-quiz (quiz system)
  │     └── GitHub Actions → Daily Slack review quiz + keyword grading
  │
  ├── Phase 3 validation: "I want to try it hands-on" → /lab environment setup
  │                                          ↓
  │   /lab (lab environment)
  │     └── Docker Compose start → Monitoring → Test → Observe → Analyze
  │
  └── Phase 4 study memo → Save to study-notes/
                                ↓ (When you want to write a blog post)
      /blog (blog writing) ─── Separate invocation
        └── Skeleton → Draft → Kill Your Darlings review → Save to Notion
```

---

## Data Structure

| Path | Purpose | Format |
|------|---------|--------|
| `books/*/` | Book PDFs (organized by category) | PDF |
| `books/*/{book}_progress.md` | Learning progress tracking | Markdown |
| `study-notes/{cat}/{book}/` | Per-chapter study memos | Markdown |
| `study-vault/{cat}/{book}/` | Structured pre-study notes | Markdown |
| `quizzes/quiz_bank.json` | Spaced repetition quiz bank | JSON |
| `tracking/{category}.md` | Per-concept metacognition dashboard | Markdown |
| `labs/{tech}/` | Docker lab environments | Docker Compose |
