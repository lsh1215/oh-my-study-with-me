---
description: First Principles-based study session. Reads a book PDF, extracts core principles, and deepens understanding through Socratic dialogue and type-based verification. Use this skill when the user mentions learning, studying, or study.
argument-hint: "[book name keyword]" or "continue"
user-invocable: true
---

# Deep Study - First Principles Study Skill

## Argument Parsing
- No argument → start from book selection
- `[book name keyword]` → start that book immediately
- `continue` → resume previous study session (refer to progress file)

Argument: $ARGUMENTS

## Phase 0: Book Selection

1. Show the list of subfolders and PDF files under `책 목록/`.
2. When the user selects a book, read the front pages (1–10) of the PDF to **extract the table of contents**.
3. Show the table of contents and ask the user which chapter to start from.

## Phase 1: Chapter Reading + Core Principle Extraction

1. Read the selected chapter's page range from the PDF (20 pages at a time).
2. Extract **core principles** from the content read.
   - No simple summaries. Organize around the question: "What is the fundamental problem this chapter is solving?"
   - Format:
     ```
     ## [Chapter Name]

     ### Fundamental Problem
     What is the core problem this chapter addresses

     ### Core Principles
     - Principle 1: [Include why this approach was chosen]
     - Principle 2: ...

     ### Connections
     - Relationships with other concepts/technologies
     ```
3. Show the extracted principles to the user and move on to Phase 2.

## Phase 2: First Principles Dialogue

Engage in a conversation with the user, drilling down to the bottom of "why?".

### Dialogue Guidelines
- When the user explains something, always ask one level deeper "why?".
- If the user's answer is wrong or incomplete, don't give the answer directly — give a hint instead.
- When a fundamental principle is reached that can no longer be drilled deeper, wrap up the dialogue.
- If something comes up that the user doesn't know during dialogue, re-read the relevant section of the original PDF and explain.

### How to Start the Dialogue
Pick one of the extracted core principles and pose a question:
- "Why do you think this technology chose this design?"
- "What problems would arise if this part didn't exist?"
- "What is the fundamental difference between this and [similar technology]?"

Once you judge the user has understood sufficiently, move on to Phase 3.

## Phase 3: Type-Based Verification

Perform appropriate verification based on the content type of the chapter.

### Type Classification Criteria
- **Theory/Concepts** (distributed systems theory, CS fundamentals, networking, etc.): Feynman Test
- **Code/Implementation** (Java, Kotlin, Spring, JPA, etc.): Code Implementation Challenge
- **Design/Architecture** (system design, DDD, microservices, etc.): Design Problem
- **Operations/Troubleshooting** (Kafka operations, DB tuning, JVM tuning, etc.): Failure Scenario
- If a chapter falls under multiple types, select the most essential type.

### Verification Methods

#### Feynman Test (Theory/Concepts)
- "Imagine you're explaining this concept to a non-developer (or a junior developer). Explain it using an easy analogy."
- Pass if the explanation is accurate and clear. Otherwise, give feedback on what's lacking.

#### Code Implementation Challenge (Code/Implementation)
- Give a small coding task that uses the core concept learned in this chapter.
- When the user implements it, do a code review and suggest improvements.

#### Design Problem (Design/Architecture)
- Give a real service scenario and have the user design a solution.
- Example: "Design a system that handles 10 million orders per day. Apply the principles learned in this chapter."

#### Failure Scenario (Operations/Troubleshooting)
- Present a realistic failure situation.
- Example: "Redis memory suddenly exceeded 90%. When you spot this on the monitoring dashboard, what steps would you take and in what order?"

### Verification Result Handling
- **Pass**: "You have a clear understanding of the core" + proceed to Phase 4
- **Partial Pass**: Feedback on gaps → re-reference the relevant PDF section → re-verify
- **Fail**: Re-explain the core principles → restart from Phase 2

### Auto-Save to Quiz Bank (Slack Daily Review Integration)

Automatically add the verification questions used in Phase 3 to `quizzes/quiz_bank.json`.
(Only works if the quiz system has been set up with `/oh-my-study-with-me:setup-quiz`)

Quiz format to add:
```json
{
  "id": "{category}-{sequence}",
  "category": "Kafka",
  "book": "Kafka: The Definitive Guide",
  "chapter": "Ch3. Producer",
  "type": "concept|code|design|troubleshooting",
  "concept": "The name of the core concept this quiz verifies",
  "question": "The question used in verification",
  "hint": "A hint to guide thinking",
  "answer": "A model answer based on core principles",
  "keywords": ["keyword1", "keyword2"],
  "min_keyword_match": 2,
  "box": 1,
  "next_review": "tomorrow's date",
  "times_asked": 0,
  "times_correct": 0,
  "last_asked": null,
  "slack_message_ts": null
}
```

Rules:
- keywords should be 5–8 items, including both Korean and English (e.g., ["GC", "garbage", "heap", "힙"])
- min_keyword_match is approximately 30% of the keyword count (rounded)
- If the same question already exists, do not add it
- If quiz_bank.json does not exist, skip this step
- The concept must match a concept name in the concept table of `tracking/{category}.md`

### Per-Concept Metacognition Tracking

Track Phase 3 verification results at the concept level. Go beyond chapter-level "pass/fail" — record precisely which concepts are weak and which are solid.

#### Tracking File Location
`tracking/{category}.md` (e.g., `tracking/Kafka.md`, `tracking/Elasticsearch.md`)

#### File Structure
```markdown
# [Category] Concept Tracking

## Dashboard
| Status | Count |
|--------|-------|
| 🟦 Mastered (90%+) | 0 |
| 🟩 Good (70-89%) | 0 |
| 🟨 Average (40-69%) | 0 |
| 🟥 Weak (0-39%) | 0 |
| ⬜ Not Measured | 0 |

## Per-Concept Status

| Concept | Source | Attempts | Correct | Accuracy | Last Tested | Status |
|---------|--------|----------|---------|----------|-------------|--------|
| acks setting | Kafka: The Definitive Guide Ch3 | 3 | 3 | 100% | 2026-03-01 | 🟦 |
| batch sending | Kafka: The Definitive Guide Ch3 | 2 | 1 | 50% | 2026-02-28 | 🟨 |

## Error Notes

### batch sending
- **Confusion**: Misunderstood the relationship between linger.ms and batch.size in reverse
- **Key**: linger.ms is wait time, batch.size is byte size. Sends when either linger.ms elapses or batch.size is reached
- **Date**: 2026-02-28
```

#### Update Rules

1. **During Phase 3 Verification**: Record each concept covered in verification as an individual row.
   - Verification pass → increment correct +1 for those concepts
   - Partial pass → increment correct +1 for concepts answered correctly, increment attempts only +1 for incorrect ones + write error note
   - Fail → increment attempts only +1 for all concepts + write error note

2. **Writing Error Notes**: For concepts the user answered incorrectly or incompletely:
   - **Confusion**: What the user confused it with
   - **Key**: The correct understanding
   - **Date**: Date the error occurred

3. **Resolving Error Notes**: If the user correctly answers the concept again in a later session, add `✅ Resolved (date)` to the error note.

4. **Status Badge Criteria**:
   - 🟦 Mastered: 90%+ accuracy, minimum 3 attempts
   - 🟩 Good: 70–89% accuracy
   - 🟨 Average: 40–69% accuracy
   - 🟥 Weak: 0–39% accuracy
   - ⬜ Not Measured: 0 attempts

5. **Dashboard Update**: Refresh the dashboard counts at the top whenever the concept table is updated.

6. **If the file does not exist**, create the `tracking/` directory and the category file from scratch.

#### Slack Review Quiz Integration

Also add the `"concept"` field to quizzes in quiz_bank.json:
```json
{
  "concept": "acks setting",
  ...
}
```
When GitHub Actions grades answers, this concept field should be used to also update `tracking/{category}.md`.

#### Use in Phase 2 Dialogue

When resuming a previous study session with `continue`, read the concepts file for that category and:
- If there are concepts with 🟥 Weak status, prioritize those concepts in the Phase 2 dialogue.
- For concepts with error notes, ask about them in a different context (no repeating the same question).

## Phase 4: Study Summary Memo

Once verification is passed, organize what was learned in this session into a short memo.

### Memo Content
```markdown
# [Topic Name] - Study Memo

- **Fundamental Problem**: [The core problem this chapter solves, in one line]
- **Core Principles**: [The principles reached through Phase 2 dialogue, 2–3 lines]
- **Verification Result**: [What verification was done in Phase 3 and how it went]
- **Blog Material**: [Note any points worth writing about. Write later with `/oh-my-study-with-me:blog`]
```

### Saving
- Save as `{chapter name}.md` under `study-notes/{category}/{book name}/`.
- This memo is used as material when writing a blog post later with `/oh-my-study-with-me:blog`.

> **Note**: Full blog post writing is handled separately by calling the `/oh-my-study-with-me:blog` skill. This skill focuses on study only.

## Phase 5: Progress Record

Record the study progress in `books/{category}/{book name}_progress.md`.

```markdown
# [Book Name] Study Progress

## Completed Chapters
- [x] Ch1. [Chapter Name] - Verification: Passed - Memo: Written
- [ ] Ch2. [Chapter Name]

## Concept Status Summary
- 🟦 Mastered: N | 🟩 Good: N | 🟨 Average: N | 🟥 Weak: N
- Weak concepts: [concept1, concept2, ...]
- Details: see `tracking/[category].md`

## Next Study Planned
- Ch2. [Chapter Name]

## Notes
- [Cross-reference points and other observations from the study session]
```

## Phase 6: Next Topic

1. Ask the user whether to continue with the next chapter of the same book, or cross-reference to a related chapter in another book.
2. When suggesting a cross-reference, specify concretely which chapter in the other book connects to the current concepts learned.
   - Example: "Now that you've learned about Kafka producers, diving into Chapter 3 of 'Building Event-Driven Microservices' from an event sourcing perspective could deepen your understanding."

---

## Important Notes

- Never copy-paste book content verbatim.
- If the user says "I don't know," don't give the answer immediately — ask a guiding question first.
- Never skip the verification step. Phase 3 must be completed before moving to Phase 4.
- When reading PDFs, read a maximum of 20 pages at a time. If a chapter is long, read it in segments.
