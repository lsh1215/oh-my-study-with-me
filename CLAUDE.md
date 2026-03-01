# oh-my-study-with-me — Project Conventions

## Branch Workflow

- **main** is the production branch. Never push directly to main.
- All work goes on feature branches: `feat/...`, `fix/...`, `docs/...`, `chore/...`
- Merge to main via Pull Request only (squash merge preferred).
- Delete feature branches after merge.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

### Types
| Type | When |
|------|------|
| `feat` | New feature or skill |
| `fix` | Bug fix |
| `docs` | Documentation only (README, SKILL.md, release notes) |
| `chore` | Maintenance (CI, config, dependencies) |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |

### Scopes
| Scope | What |
|-------|------|
| `study` | study skill |
| `study-vault` | study-vault skill |
| `blog` | blog skill |
| `research` | research skill |
| `lab` | lab skill |
| `setup-quiz` | setup-quiz skill |
| `router` | skill-router.mjs |
| `ci` | GitHub Actions workflows |
| `meta` | plugin.json, marketplace.json, manifests |
| `readme` | README files (all languages) |

### Examples
```
feat(research): add multi-source gathering skill
fix(router): correct Korean pattern matching for blog
docs(readme): add multi-language README (KO, JA, ZH)
chore(ci): add version consistency check workflow
```

## Pull Requests

- Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- PR title follows the same Conventional Commits format as commit messages.
- Keep PRs focused — one logical change per PR.
- All CI checks must pass before merge.

## Versioning

- Version lives in two files that MUST stay in sync:
  - `.claude-plugin/plugin.json` → `version` field
  - `.claude-plugin/marketplace.json` → `plugins[0].version` field
- Follow [Semantic Versioning](https://semver.org/):
  - PATCH (0.2.x): bug fixes, minor doc updates
  - MINOR (0.x.0): new skills, significant feature additions
  - MAJOR (x.0.0): breaking changes to skill interfaces
- Version bump goes in a dedicated commit: `chore(meta): bump version to X.Y.Z`

## Release Notes

- Maintain `RELEASE_NOTES.md` at repo root.
- Each release section format:
  ```
  ## vX.Y.Z — Short Title

  ### New: [skill/feature name]
  - Bullet points describing what's new

  ### Enhanced: [skill/feature name]
  - Bullet points describing changes

  ### Fixed: [description]
  - Bug fixes

  ### Metadata
  - Version, manifest, and doc updates
  ```
- GitHub Releases are auto-created when a `v*` tag is pushed.

## Release Process

1. Update `RELEASE_NOTES.md` with new version section.
2. Bump version in `plugin.json` and `marketplace.json`.
3. Commit: `chore(meta): bump version to X.Y.Z`
4. Tag: `git tag vX.Y.Z`
5. Push: `git push origin main --tags`
6. GitHub Actions auto-creates the GitHub Release.

## File Structure Rules

- Skills live in `skills/{skill-name}/SKILL.md`
- Skill router: `scripts/skill-router.mjs`
- Korean reference docs: `docs/ko/` (gitignored, local only)
- Plugin manifests: `.claude-plugin/`
- CI/CD: `.github/workflows/`

## Language

- All committed files (README, SKILL.md, release notes, manifests) are in **English**.
- Korean docs in `docs/ko/` are local-only reference copies.
- Multi-language READMEs: `README.md` (EN), `README.ko.md` (KO), `README.ja.md` (JA), `README.zh.md` (ZH)
