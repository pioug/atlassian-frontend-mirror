# media-card — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field | Value |
|---|---|
| NPM name | `@atlaskit/media-card` |
| Path | `media-card/` |
| Owner | Media Exif |
| Purpose | Card component for displaying media files (images, video, documents) with loading, error, and progress states |

## Knowledge index

> Read, search, edit, investigate, and validate the repository knowledge index at
> `.agents/knowledge-index/`. ALWAYS use this skill before making ANY repo change, or when
> exploring the codebase. The knowledge index is the canonical starting point for every coding task
> in this repo, trigger this skill aggressively whenever the user mentions architecture, conventions,
> packages, modules, services, build, coding, writing code, APIs, feature flags, testing, or
> anything similar. Also trigger when "is the knowledge index up to date?" / "update the knowledge
> index" / "what does the knowledge index say about Y?" — even if they don't say the words
> "knowledge index". Also use it (via the `validate` subcommand) to detect drift between the
> codebase and the docs after any code change. Use the `generate` subcommand to bootstrap the index
> in a new repository.

**Entry point:** `.agents/knowledge-index/INDEX.md`
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-card.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/card/` — main Card component and logic
- `src/inline/` — inline card variant
- `src/utils/` — shared utilities (analytics, performance observer, light cards, global scope)
- `src/types.ts` — shared TypeScript types
- `src/errors.ts` — error definitions

## Development notes

- React Compiler is enabled for this package
- Peer dependencies: `@emotion/react`, `react`, `react-dom`, `react-intl`
- Key internal dependencies: `@atlaskit/media-client`, `@atlaskit/media-client-react`, `@atlaskit/media-ui`, `@atlaskit/media-viewer`
- VR tests exist under `examples/Test-VR-*.tsx`
- Integration tests exist under `examples/Test-Integration-*.tsx`
- All new behaviour changes must be behind a feature gate (`fg()` from `@atlaskit/platform-feature-flags`)
