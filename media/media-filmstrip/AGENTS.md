# media-filmstrip — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-filmstrip`                                                                          |
| Path     | `media-filmstrip/`                                                                                   |
| Owner    | Media Exif                                                                                           |
| Purpose  | Displays media cards in a horizontal filmstrip layout with navigation arrows and smart deduplication |

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

**Entry point:** `.agents/knowledge-index/INDEX.md`
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-filmstrip.md`
**Standards page:** `.agents/knowledge-index/domains/media/units/atlaskit-media-filmstrip/standards-and-patterns.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.tsx` — public API entry point
- `src/filmstrip.tsx` — main smart filmstrip component
- `src/deduplicatedFilmstrip.tsx` — deduplication wrapper
- `src/filmstripView/` — pure presentational filmstrip view
- `src/utils/` — shared utilities
- `src/dom.ts` — DOM measurement helpers
- `src/types.ts` — shared TypeScript types

## Public API (key exports)

`FilmstripView`, `LeftArrow`, `RightArrow`, `MUTATION_CONFIG`

## Development notes

- React Compiler is enabled for this package
- 1 feature flag: `platform_media_a11y_suppression_fixes`
- Export subpaths: `.`, `./dom`, `./filmstrip`, `./filmstrip-view`, `./types`, `./wrappers`
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
