# oh-my-study-with-me — Project Conventions

## Branch & Commit

- **Never push directly to main.** All work on feature branches → PR → merge.
- Commit format: `type(scope): description` ([Conventional Commits](https://www.conventionalcommits.org/))
- PR title follows the same format. CI enforces valid types and scopes automatically.

## Versioning

- Two files MUST stay in sync: `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
- [SemVer](https://semver.org/): PATCH = bug fix, MINOR = new skill/feature, MAJOR = breaking change
- Release: update `RELEASE_NOTES.md` → bump versions → tag `vX.Y.Z` → push (auto GitHub Release)

## File Structure

- Skills: `skills/{name}/SKILL.md` | Router: `scripts/skill-router.mjs`
- Manifests: `.claude-plugin/` | CI: `.github/workflows/`
- READMEs: EN (default), KO, JA, ZH — keep in sync
- All committed files in **English**. Korean docs in `docs/ko/` (gitignored, local only).
