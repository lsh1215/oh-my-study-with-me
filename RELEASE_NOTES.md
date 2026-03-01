# Release Notes

## v0.2.0 — Multi-Source & Notion Integration

### New: research skill
- Gather and synthesize information from multiple sources (URLs, GitHub repos, web search)
- 5-phase workflow: Source Collection → Parallel Fetch → Cross-Source Analysis → Research Summary → Save & Connect
- Output saved to `research-notes/{topic}/`

### Enhanced: study skill (multi-source)
- Now accepts web URLs, GitHub repos, and YouTube links in addition to PDF
- Phase 0 auto-detects source type and applies the appropriate fetch flow
- Existing PDF behavior is fully preserved (backward compatible)
- Non-PDF study notes saved to `sources/{category}/{source-name}/`

### Enhanced: study-vault skill (multi-source)
- Supports web URL and GitHub repo as vault sources
- Phase 1 and Phase 2 generalized for multi-source reading

### Enhanced: blog skill (Notion integration)
- Phase 4 now saves directly to Notion via MCP (notion-search, notion-fetch, notion-create-pages)
- Supports existing Notion database or new page creation
- Falls back to local `blog-drafts/{topic}.md` if Notion MCP is unavailable
- Phase 2 enhanced with WebFetch/WebSearch source verification

### Updated: skill-router
- Added research skill with EN + KO keyword/phrase patterns
- Priority order: study-vault > setup-quiz > research > blog > lab > study
- Added Notion-related patterns to blog skill
- Added URL detection patterns to study and study-vault skills

### Metadata
- Version bumped to 0.2.0 in plugin.json and marketplace.json
- Updated descriptions and keywords across all manifests
- All 4 README languages (EN, KO, JA, ZH) updated with new features

---

## v0.1.0 — Initial Release

- study: First Principles learning session with PDF, Socratic dialogue, type-based validation, metacognition tracking
- study-vault: Pre-study structured note generation from PDF
- setup-quiz: Slack daily quiz system with GitHub Actions + Leitner spaced repetition
- blog: Technical blog writing with Orwell + Toulmin + Steel Man
- lab: Docker Compose lab environments with monitoring
- skill-router: OMC-style multi-pattern matching (EN + KO)
