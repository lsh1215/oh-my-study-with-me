---
description: Pre-generates structured study notes from a book PDF. Creates a Study Vault including a dashboard, quick reference tables, concept comparisons, and practice problems. Use this skill when the user mentions vault, note generation, or pre-study.
argument-hint: "[book-name keyword]" or "[book-name] [chapter-range]"
user-invocable: true
---

# Study Vault - Pre-Note Generation Skill

## Argument Parsing
- No argument → start from book selection
- `[book-name keyword]` → start immediately with that book
- `[book-name] [chapter-range]` → specific chapters only (e.g., `kafka Ch3-Ch5`)

Argument: $ARGUMENTS

---

## Difference from /oh-my-study-with-me:study

| | study | study-vault |
|---|---|---|
| **Approach** | Read and converse interactively to build understanding | Analyze the whole first, then generate notes |
| **Speed** | Slow (interactive) | Fast (auto-generated) |
| **Depth** | Deep (Why? conversation) | Broad (grasp overall structure) |
| **Best for** | Deep diving into key chapters | Bird's-eye view of a new book, structuring concept relationships, review notes |

The two skills are complementary:
1. Use `/oh-my-study-with-me:study-vault` to get an overview of the book's entire structure first.
2. Use `/oh-my-study-with-me:study` to deep dive into key chapters.
3. Review using the vault's practice problems.

---

## Design Principles

1. **Source verification**: Only write notes after actually reading and confirming the content, not just the filename.
2. **Active recall**: Write all answers in collapsed state (details/summary). Make the learner think before expanding.
3. **Concept connections**: Every note cross-references related notes.
4. **Self-review**: Run a quality checklist at the end.

---

## Phase 1: Source Exploration and Structure Analysis

1. Read the PDF of the book the user selected.
   - If over 100MB, use `pdftotext` CLI (specify page range)
   - Extract the table of contents pages first (usually the first 5–15 pages).
2. Build a **topic hierarchy** from the table of contents:
   ```
   Part 1: Basics
   ├── Ch1: Introduction → [Topics: core concepts, architecture]
   ├── Ch2: Installation → [Topics: environment setup] (skip: replaced by lab)
   └── Ch3: Basic operations → [Topics: CRUD, internal structure]
   Part 2: Advanced
   └── ...
   ```
3. Show the topic hierarchy to the user and confirm the scope.
   - User can choose "generate all" vs "specific parts only"
   - Suggest skipping chapters like installation/environment setup, as they can be replaced with the `/oh-my-study-with-me:lab` skill

---

## Phase 2: Content Analysis and Tag Design

1. Read each chapter in the selected scope, 20 pages at a time.
2. Extract from each chapter:
   - **Key concepts** list (name + one-line definition)
   - **Concept dependency relationships** (A must be understood before B)
   - **Real-world connections** (where this concept is actually used)
3. Design **tag standards**:
   - Format: English kebab-case
   - Examples: `#producer`, `#consumer-group`, `#replication`, `#partition`
   - Show the tag list to the user and get approval.

---

## Phase 3: Vault Creation

### Directory Structure
```
study-vault/{category}/{book-name}/
├── 00-dashboard.md
├── 00-quick-reference.md
├── 00-concept-compare.md
├── 01-[topic-name]/
│   ├── concepts.md
│   └── practice.md
├── 02-[topic-name]/
│   ├── concepts.md
│   └── practice.md
└── ...
```

### 3-1. Dashboard (00-dashboard.md)

```markdown
# [Book Name] Study Vault

## Learning Map

[Visualize topic dependency relationships in ASCII]

## Topic List

| # | Topic | # of Key Concepts | # of Practice Problems | Difficulty | Tags |
|---|-------|-------------------|------------------------|------------|------|
| 01 | [topic name] | N | N | ★☆☆ | #tag1, #tag2 |
| 02 | [topic name] | N | N | ★★☆ | #tag3, #tag4 |

## Weak Areas
_(Automatically reflected from the tracking/ metacognition file after studying)_

## References
- Source: [Book Name] ([Author], [Publisher])
- Created: YYYY-MM-DD
- Related skills: Deep dive with `/oh-my-study-with-me:study`, hands-on practice with `/oh-my-study-with-me:lab`
```

### 3-2. Quick Reference (00-quick-reference.md)

```markdown
# Quick Reference

## Key Terms
| Term | Definition | Related Topic |
|------|------------|---------------|

## Key APIs / Commands / Configuration Values
| Item | Description | Default | Notes |
|------|-------------|---------|-------|

## Common Patterns
[Code snippets, configuration examples, etc.]
```

### 3-3. Concept Comparison (00-concept-compare.md)

```markdown
# Comparison of Easily Confused Concepts

## [Concept A] vs [Concept B]

### Structural Differences
| Dimension | Concept A | Concept B |
|-----------|-----------|-----------|
| Problem it solves | ... | ... |
| How it works | ... | ... |
| When to use | ... | ... |
| Trade-offs | ... | ... |

### Why They Get Confused
[Structural explanation of why they appear similar on the surface]

### Key Distinguishing Criterion
[The essential difference that distinguishes them in one line]

### Related Concepts
- [Concept C](../03-topic/concepts.md#concept-c) is a higher-level abstraction of Concept A
- [Concept D](../04-topic/concepts.md#concept-d) is used together with Concept B
```

### 3-4. Concept Notes (concepts.md)

concepts.md in each topic folder:

```markdown
# [Topic Name]

> Source: [Book Name] [Chapter Name] (p.XX-XX)
> Tags: #tag1 #tag2

## The Core Problem This Topic Solves
[One line describing the core problem this topic addresses]

## Overall Structure
[ASCII diagram of how the concepts in this topic fit together]

## Key Concepts

### [Concept 1]

**Definition**: ...

**Why it's needed**: [What problem arises without this concept. Explain its reason for existence structurally]

**How it works**:
[Include an ASCII diagram if helpful]

**Design trade-offs**: [What is gained and what is sacrificed by choosing this approach]

**Related concepts**: [Concept 2](../02-topic-name/concepts.md#concept-2), [Concept 3](#concept-3)
```

Rules:
- Each concept follows the order: **Definition → Why it's needed → How it works → Design trade-offs → Related concepts**
- "Why it's needed" is written as "what goes wrong without it." Explain its reason for existence, not a feature list
- "Design trade-offs" specifies the direction the concept chose and the cost that comes with it. Can be omitted if not applicable
- Visualize concept relationships with an "Overall Structure" diagram at the start of each topic
- Related concepts are cross-linked with in-file anchors or links to other topic files

### 3-5. Practice Problems (practice.md)

practice.md in each topic folder:

```markdown
# [Topic Name] Practice Problems

> Difficulty: ★ Basic / ★★ Applied / ★★★ Advanced

## Problem 1 ★
[Question]

<details>
<summary>Show Answer</summary>

[Answer + explanation of why]

</details>
```

Rules:
- Minimum 8 problems per topic
- Difficulty distribution: Basic 40%, Applied 40%, Advanced 20%
- Type distribution: Recall 60%+, Application 20%+, Analysis 10%+
- **Zero-hint principle**: No answer hints must leak into the problem text
- All answers must be collapsed with `<details><summary>` tags to encourage active recall

---

## Phase 4: Cross-Linking

1. Connect "Related concepts" in all concepts.md files bidirectionally.
2. Link from the topic list in the dashboard to each topic folder.
3. Link from concept-compare to related concepts.md files.
4. Link format: relative path markdown link `[concept name](../01-topic/concepts.md#anchor)`

---

## Phase 5: Self-Review

After generation is complete, run the checklist below. If any item fails, fix it.

### Coverage Review
- [ ] Are the key concepts of all selected chapters included in concepts.md?
- [ ] Does each topic have at least 8 practice problems?
- [ ] Are all major APIs/commands/configuration values included in quick-reference without omission?

### Quality Review
- [ ] Does every concept have a "Why it's needed" section? (Fails if only a plain definition is present)
- [ ] Is the zero-hint principle upheld in all practice problems?
- [ ] Are all answers collapsed with `<details>` tags?

### Link Review
- [ ] Do all cross-reference links point to actual files/anchors?
- [ ] Are all topics linked from the dashboard?

### Source Review
- [ ] Is the source (book name, chapter, page) stated in all concepts.md files?
- [ ] Are only contents actually confirmed from the PDF written? (No guessing)

---

## Integration with /oh-my-study-with-me:study

When deep studying with `/oh-my-study-with-me:study` after vault creation:
1. In Phase 1, reference the vault's concepts.md to supplement principle extraction.
2. Phase 3 verification results are recorded in the same `tracking/` metacognition file.
3. Practice problems from the vault that were answered incorrectly can be automatically added to quiz_bank.json.

---

## Notes

- Do not copy book content verbatim. Extract the essence and restructure from the learner's perspective.
- Read PDFs in 20-page chunks. Use pdftotext for PDFs over 100MB.
- Vault generation takes time. Report progress to the user step by step.
- If a vault already exists, confirm with the user whether to overwrite or append.
