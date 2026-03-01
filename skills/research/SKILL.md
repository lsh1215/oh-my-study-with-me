---
description: Multi-source research and synthesis. Gathers information from URLs, GitHub repos, and web searches, then produces a structured research summary. Use this skill when the user mentions research, investigate, or gathering sources.
argument-hint: "[topic]" or "[url1 url2 ...]"
user-invocable: true
---

# Research - Multi-Source Research & Synthesis Skill

## Argument Parsing
- No argument → ask the user for a research topic or URLs
- `[topic]` → use WebSearch to find relevant sources, then synthesize
- `[url1 url2 ...]` → fetch and analyze the provided URLs directly
- `[topic] [url1 url2 ...]` → combine user-provided URLs with additional web research

Argument: $ARGUMENTS

---

## Difference from /oh-my-study-with-me:study

| | research | study |
|---|---|---|
| **Scope** | Multiple sources, broad coverage | Single source, deep dive |
| **Depth** | Wide (cross-source synthesis) | Deep (Why? dialogue) |
| **Interaction** | Mostly autonomous gather + synthesize | Interactive Socratic dialogue |
| **Output** | Research summary with source attribution | Study memo with verification |
| **Best for** | Surveying a topic, comparing approaches, finding consensus | Mastering one book/article in depth |

The two skills are complementary:
1. Use `/oh-my-study-with-me:research` to survey the landscape of a topic.
2. Use `/oh-my-study-with-me:study` to deep dive into the most important source.
3. Use `/oh-my-study-with-me:blog` to write about your findings.

---

## Phase 0: Source Collection

1. **Parse user input** to detect source types:
   - URLs (http/https) → categorize as web article, GitHub repo, or YouTube
   - Plain text topic → will need WebSearch in Phase 1
   - Mixed (topic + URLs) → use both provided URLs and search for more

2. **Classify each source**:
   | Pattern | Type | Fetch Method |
   |---------|------|-------------|
   | `github.com/{owner}/{repo}` | GitHub repo | WebFetch for README + `gh` CLI for repo structure |
   | `youtube.com/watch` or `youtu.be/` | YouTube | WebFetch (best-effort page info, description) |
   | Other `http(s)://` | Web article | WebFetch |
   | No URL | Topic search | WebSearch → collect top results |

3. **Show the source plan** to the user:
   ```
   Research Plan:
   - Topic: [topic]
   - Sources to fetch: [list with types]
   - Additional web search: yes/no
   ```
   Ask the user to confirm or add/remove sources.

---

## Phase 1: Parallel Fetch

1. **Web search** (if topic provided without sufficient URLs):
   - Use WebSearch with the topic to find 3–5 relevant, high-quality sources.
   - Prefer official documentation, reputable tech blogs, and peer-reviewed content.
   - Show found sources to the user and confirm before fetching.

2. **Fetch all sources** using appropriate tools:
   - **Web articles**: WebFetch → extract main content, strip navigation/ads
   - **GitHub repos**: WebFetch for README; use `gh api` or WebFetch for repo tree, key source files
   - **YouTube**: WebFetch for page content (title, description, any available transcript info)
   - **Local files**: Read tool if user provides file paths

3. **Extract key content** from each source:
   - Title, author, date (if available)
   - Main arguments or key points
   - Code examples or configurations (if relevant)
   - Data, benchmarks, or measurements cited

4. **Report progress** to the user as each source is fetched.

---

## Phase 2: Cross-Source Analysis

1. **Identify common themes** across all sources:
   - What concepts appear in multiple sources?
   - Where do sources agree? (consensus points)
   - Where do sources disagree or contradict? (debate points)

2. **Find unique insights** per source:
   - What does each source contribute that others don't?
   - Are there novel approaches or perspectives?

3. **Assess source quality**:
   - Is the information current?
   - Does the source cite evidence or provide benchmarks?
   - Is there potential bias? (e.g., vendor documentation)

4. **Identify knowledge gaps**:
   - What questions remain unanswered across all sources?
   - What aspects need deeper investigation?

---

## Phase 3: Research Summary

Produce a structured research output and present it to the user:

```markdown
# [Topic] Research Summary

## Key Findings
[3–7 bullet points with source attribution]
- Finding 1 [Source A, Source B]
- Finding 2 [Source C]
- ...

## Areas of Consensus
[What most sources agree on]

## Areas of Debate
[Where sources disagree, with each side's argument]

## Unique Insights
[Notable points from individual sources]
- Source A contributes: ...
- Source B contributes: ...

## Knowledge Gaps
[What remains unclear or needs further investigation]

## Recommended Next Steps
- Deep dive: "[specific topic]" with `/swm:study`
- Write about: "[angle]" with `/swm:blog`
- Hands-on: "[technology]" with `/swm:lab`
```

---

## Phase 4: Save & Connect

### Output Directory Structure
```
research-notes/{topic}/
├── summary.md          # Synthesized findings (Phase 3 output)
├── sources.md          # Source list with key excerpts
└── raw/                # Individual source notes (optional, for large research)
    ├── {source-1}.md
    └── {source-2}.md
```

### summary.md
The Phase 3 research summary output.

### sources.md
```markdown
# [Topic] Sources

## Source Index
| # | Title | Type | URL | Key Contribution |
|---|-------|------|-----|-----------------|
| 1 | [title] | Web article | [url] | [one-line summary] |
| 2 | [title] | GitHub repo | [url] | [one-line summary] |

## Detailed Excerpts

### Source 1: [Title]
- **URL**: [url]
- **Author**: [if known]
- **Date**: [if known]
- **Key Points**:
  - ...
- **Notable Quotes/Data**:
  - ...
```

### After saving:
1. Show the saved file paths.
2. Suggest next steps:
   - "Study deeper with `/swm:study [url-or-topic]`"
   - "Write about it with `/swm:blog [topic]`"
   - "Set up a lab with `/swm:lab [technology]`"

---

## Important Notes

- Always attribute findings to their sources. Never present information without citation.
- When sources conflict, present both sides fairly. Do not pick a winner without evidence.
- For GitHub repos, focus on README, architecture, and key design decisions — do not dump entire codebases.
- YouTube fetching is best-effort. If transcript is unavailable, work with title, description, and any page content.
- Report progress as you fetch. Research can take time with many sources.
- If a source fails to fetch, note the failure and continue with remaining sources.
- Freeform text input (no URLs, no clear topic) → ask the user to clarify before proceeding.
