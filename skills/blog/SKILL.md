---
description: Technical blog writing session. Writes clear and honest technical content applying Orwell/Zinsser/Graham philosophy, Toulmin argumentation, and Steel Man rebuttal. Use this skill when the user mentions blog, writing, or technical articles.
argument-hint: "[topic]" or "review"
user-invocable: true
---

# Blog - Technical Blog Writing Skill

Argument: $ARGUMENTS

---

## Writing Philosophy

The writing in this skill is grounded in the following principles. Apply them at every stage.

### 1. Writing is the process of completing thought

> "Writing about something, even something you know well, usually reveals that you didn't know it as well as you thought." — Paul Graham

It is natural for a first draft to be a mess. The thinking is not yet complete.
Writing is how thought gets organized. Therefore, the correct order is not
"understand perfectly, then write" — it is "write to complete the understanding."

### 2. Clarity is an ethical choice

> "The great enemy of clear language is insincerity." — George Orwell

Writing vaguely is deceiving the reader.
In technical writing, phrases like "handled appropriately" or "works efficiently" say nothing.
Write concretely. Write in measurable terms.

### 3. Simplicity is not simple thinking

> "The secret of good writing is to strip every sentence to its cleanest components." — William Zinsser

Writing complex ideas simply is the hardest thing of all.
Stripping clutter does not mean reducing content — it means making the content more visible.

### 4. Intellectual honesty creates persuasion

> "A theory that is not refutable by any conceivable event is non-scientific." — Karl Popper

Writing that exposes the weaknesses of its own argument earns more trust.
"This is the best approach" is weaker than "I chose this approach because of X. That said, in Y situations, Z is more appropriate." That is the language of an expert.

---

## Style Rules

### Plain sentences

- **Avoid figurative language.** Use concrete examples and data instead of metaphors.
  - ❌ "Kafka is the highway of data"
  - ✅ "Kafka stores and delivers messages in order between producers and consumers"
- **Question every modifier.** Ask every adjective and adverb: "Why are you here?"
  - ❌ "Processed very quickly"
  - ✅ "Processed within 47ms at the P99 latency threshold"
- **Write in active voice.** Do not hide the actor.
  - ❌ "The configuration was changed"
  - ✅ "The producer changes the acks setting to all"
- **Never use a long word where a short one will do.** (Orwell's Rule 2)

### Handling technical terms

- **Use technical terms only when necessary.** Replace with plain language when possible.
- **Write core technical terms in their original English.**
  - Example: "Kafka's consumer group is a logical grouping of consumers that subscribe to the same topic."
  - Only core concept words like consumer group and topic are written in English. Not every word.
- **Introduce a term with an explanation on first use, then use it without explanation thereafter.**
  - Example: "ISR (In-Sync Replica, a replica that has fully synchronized with the leader) is ..." → After that: "ISR is ..."

### Sentence rhythm

- **Do not repeat sentences of the same length.** Mix short and long sentences.
- **State core claims in short sentences.** Surrounding context can be longer.
- **Each paragraph contains only one idea.** Two to four sentences is the right amount.

---

## Argumentation Structure

### Applying the Toulmin Model

Apply this structure consciously to every technical claim:

```
Claim:    "The Kafka producer's acks must be set to all."
Grounds:  "With acks=1, data loss occurs when the leader fails."
Warrant:  "In the financial domain, message loss equals asset loss."
Qualifier: "However, for cases where some loss is acceptable — such as log collection — acks=1 is also reasonable."
Rebuttal: "acks=all increases latency. In systems where throughput matters, this trade-off must be considered."
```

### Applying Steel Man

When addressing opposing views, reconstruct them in their **strongest form** before rebutting.

- ❌ "Some people use acks=0 without really knowing what they're doing"
- ✅ "The strongest case for choosing acks=0 is latency minimization. In systems like real-time sensor data — where overall throughput matters more than the loss of any individual message — this choice is reasonable. However, in the payment system context of this article ..."

### Skeptical stance

- **Avoid overconfidence.** Prefer "X is judged to be ~ under the current architecture" over "X must always be ~"
- **Write falsifiably.** When making a claim, know under what conditions that claim could be wrong.
- **Cite sources.** Let the reader verify.

---

## Post Structure Templates

### Default Structure (PAS-based)

```markdown
# [Title]

## The Problem
[The fundamental problem this post addresses. Make the reader think "I've wondered about this too."]

## Why This Is a Problem
[The concrete consequences of leaving this problem unsolved]

## The Core Principle
[Unpack the key concepts behind the solution step by step]
[Weave in the Claim → Grounds → Qualifier → Rebuttal structure naturally]

## In Practice
[Implementation code, configuration examples, or architecture diagrams]
[Include specific numbers and measured results]

## Trade-offs
[The limits of this approach and alternatives. The key section for intellectual honesty]

## Summary
[One core sentence. What to read next]
```

### Development Journal / Adoption Story Structure (Story Spine-based)

```markdown
# [Title]

## Background
["Once upon a time, we did _____" — the initial situation]

## Discovering the Problem
["But one day, _____ problem appeared" — the inciting incident]

## Exploration
["So we tried _____" — alternatives considered and their pros and cons]

## The Decision and Implementation
["Finally, we solved it with _____" — the final choice rationale + implementation]

## Results
[Before and after comparison. Concrete numbers]

## Retrospective
[What went well, what fell short, what we would do differently]
```

---

## Phase-by-Phase Workflow

### Phase 1: Framing the Skeleton

1. **Write the core message in one sentence.** If the reader remembers only one thing from this post, what should it be?
2. **Choose the post structure template** (Default / Development Journal).
3. **Write one line for each section's core point.** This is the skeleton of the post.
4. Show the skeleton to the user and collect feedback.

### Phase 2: Writing the Draft

1. Write the draft based on the skeleton.
2. Apply **Style Rules** and **Argumentation Structure** throughout.
3. If content from a `/oh-my-study-with-me:study` session exists, draw on Phase 2–3 conversation content.
4. If code examples are needed, include only the essential parts. Do not paste the entire codebase.

### Phase 3: Self-Review (Kill Your Darlings)

After completing the draft, review it against this checklist:

**Orwell Check**
- [ ] Are there no tired or cliched metaphors?
- [ ] Is there any place where a longer word was used when a shorter one would do?
- [ ] Have all removable words been removed?
- [ ] Are there any places where passive voice can be made active?
- [ ] Is there any place where a technical term was used when plain language would work?

**Argumentation Check**
- [ ] Does every claim have grounds?
- [ ] Are qualifiers used appropriately? (Is there any overconfidence?)
- [ ] Are opposing views addressed with Steel Man?
- [ ] Are trade-offs explicitly stated?

**Readability Check**
- [ ] Does each paragraph contain only one idea?
- [ ] Is there variation in sentence length?
- [ ] Are only core technical terms written in English? (No overuse?)
- [ ] Are first-use terms explained?

**Kill Your Darlings Check**
- [ ] If there is a sentence you feel proud of, is it for the reader or for yourself?
- [ ] Have all sentences written for self-display been deleted?

Show the review results to the user, then present the revised final version.

### Phase 4: Saving

- Once the user confirms, save to Notion.
- Before saving, confirm with the user where in Notion to save it.

---

## Integration with /oh-my-study-with-me:study

When you want to turn learned content into a blog post, invoke this skill separately.
Study notes saved in `study-notes/` from Phase 4 of `/oh-my-study-with-me:study` can be used as source material.
- When given a topic, check `study-notes/` first to see if relevant study notes exist.
- If study notes exist, use the Phase 2–3 conversation content to add depth to the draft.

---

## Important Notes

- Do not copy book content verbatim. Write in the language the user has internalized.
- Do not include unnecessary greetings in the blog post ("Hello, today we're going to learn about ~").
- Do not end with filler phrases like "Thank you" or "I hope this was helpful."
- The tone is "talking with a knowledgeable colleague" — not stiff, but not casual either.
