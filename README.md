# oh-my-study-with-me

A First Principles-based technical learning plugin for Claude Code.

Integrates book PDF study, structured note generation, Slack daily quizzes, technical blog writing, and Docker lab environments into a single workflow.

## Skills

| Skill | Invocation | Description |
|-------|------------|-------------|
| **study** | `/oh-my-study-with-me:study` | First Principles learning session (PDF → principle extraction → Socratic dialogue → type-based validation) |
| **study-vault** | `/oh-my-study-with-me:study-vault` | Generate structured study notes from book PDFs (dashboard, quick-reference, concept-compare, practice) |
| **setup-quiz** | `/oh-my-study-with-me:setup-quiz` | Build a GitHub Actions + Slack daily review quiz system (Leitner spaced repetition) |
| **blog** | `/oh-my-study-with-me:blog` | Technical blog writing (Orwell style + Toulmin argumentation + Steel Man rebuttal) |
| **lab** | `/oh-my-study-with-me:lab` | Docker Compose lab environments (Kafka, ES, MySQL, Redis + monitoring) |

## Installation

```bash
# 1. Register marketplace
claude marketplace add oh-my-study-with-me https://github.com/lsh1215/oh-my-study-with-me.git

# 2. Install plugin
claude plugin install oh-my-study-with-me@oh-my-study-with-me
```

## Usage

### Slash Commands

```
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:study-vault kafka Ch3-Ch5
/oh-my-study-with-me:blog kafka producer
/oh-my-study-with-me:lab kafka
/oh-my-study-with-me:setup-quiz
```

### Colon Patterns

```
study : kafka
study-vault : kafka
blog : kafka producer
lab : kafka
```

### Natural Language

```
Let's study the Kafka book
Write a blog post
Spin up a Redis lab environment
Set up a Slack quiz system
Continue from where we left off
```

## Workflow

```
study-vault (pre-study notes) ─── Grasp overall book structure
  └── Dashboard + Quick-Reference + Concept-Compare + Practice

                    ↓
study (learning session) ─── Per-concept metacognition tracking (🟦🟩🟨🟥⬜)
  ├── Phase 3 validation → Auto-save to quiz_bank.json
  │                       ↓
  │   setup-quiz ─── GitHub Actions sends daily Slack quizzes
  │
  ├── "I want to try it hands-on" → lab environment setup
  │                          ↓
  │   lab ─── Docker Compose → Monitoring → Observe → Analyze
  │
  └── Phase 4 study memo → Save to study-notes/
                                ↓
      blog ─── Skeleton → Draft → Kill Your Darlings → Notion
```

## Data Structure

The following directories are created in the project where the plugin is installed:

```
your-project/
├── books/                    # Book PDFs (by category)
├── study-notes/              # Per-chapter study memos
├── study-vault/              # Structured pre-study notes
├── quizzes/quiz_bank.json    # Spaced repetition quiz bank
├── tracking/                 # Per-concept metacognition dashboard
└── labs/                     # Docker lab environments
```

## Plugin Structure

```
oh-my-study-with-me/
├── .claude-plugin/
│   ├── plugin.json           # Plugin manifest
│   └── marketplace.json      # Marketplace manifest
├── skills/
│   ├── index.md              # Skill index + integration relationships
│   ├── study/SKILL.md
│   ├── study-vault/SKILL.md
│   ├── setup-quiz/SKILL.md
│   ├── blog/SKILL.md
│   └── lab/SKILL.md
├── hooks/
│   └── hooks.json            # skill-router hook config
├── scripts/
│   └── skill-router.mjs      # Multi-pattern matching router
└── docs/
    └── ko/                   # Korean reference docs
```

## Pattern Matching

The skill-router supports OMC (oh-my-claudecode) style multi-pattern matching:

1. **Colon patterns** (highest priority): `study : kafka`
2. **Keyword patterns**: `blog`, `lab environment`, `quiz system`, etc.
3. **Phrase patterns**: `Let's study the Kafka book`, `spin up a Redis lab`, etc.

False positive prevention:
- Code blocks (```, ~~~, `` ` ``) are stripped before matching
- Word boundaries (`\b`) are used
- Priority-based matching (study-vault > setup-quiz > blog > lab > study)

## License

[MIT](LICENSE)
