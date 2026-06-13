# media-common — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-common`                                                                                                   |
| Path     | `media-common/`                                                                                                            |
| Owner    | Media Exif                                                                                                                 |
| Purpose  | Shared utilities, analytics helpers, feature flags, media type utilities, and copy-intent logic used across Media packages |

## Knowledge index

> Read, search, edit, investigate, and validate the repository knowledge index at
> `.agents/knowledge-index/`. ALWAYS use this skill before making ANY repo change, or when exploring
> the codebase. The knowledge index is the canonical starting point for every coding task in this
> repo, trigger this skill aggressively whenever the user mentions architecture, conventions,
> packages, modules, services, build, coding, writing code, APIs, feature flags, testing, or
> anything similar. Also trigger when "is the knowledge index up to date?" / "update the knowledge
> index" / "what does the knowledge index say about Y?" — even if they don't say the words
> "knowledge index". Also use it (via the `validate` subcommand) to detect drift between the
> codebase and the docs after any code change. Use the `generate` subcommand to bootstrap the index
> in a new repository.

**Entry point:** `.agents/knowledge-index/INDEX.md` **Unit doc:**
`.agents/knowledge-index/domains/media/units/atlaskit-media-common.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/analytics/` — GASv3/UFO analytics helpers
- `src/copyIntent/` — copy-intent utilities shared across packages
- `src/hooks/` — shared React hooks
- `src/mediaFeatureFlags/` — feature flag definitions and helpers
- `src/mediaTypeUtils/` — MIME type and media type classification utilities
- `src/utils/` — miscellaneous shared utilities
- `src/downloadUrl.ts` — download URL construction

## Development notes

- React Compiler is enabled for this package
- 31+ export subpaths — use subpath imports rather than the root barrel
- No internal Media package dependencies (foundational package)
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
