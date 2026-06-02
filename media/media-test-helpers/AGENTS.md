# media-test-helpers — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field | Value |
|---|---|
| NPM name | `@atlaskit/media-test-helpers` |
| Path | `media-test-helpers/` |
| Owner | Media Exif |
| Purpose | Collection of test helpers, mocks, fakes, and utilities used in Media component stories and specs |

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
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-test-helpers.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.tsx` — public API entry point
- `src/fakeMediaClient.ts` — `fakeMediaClient()` factory for tests
- `src/mockData/` — MSW mock handlers and routers
- `src/mocks/` — mock database, routers, and WebSocket mocks
- `src/fileStateFactory/` — `FileState` factories and file simulation
- `src/dataURIs/` — sample data URIs for image testing
- `src/featureFlagsWrapper/` — feature flag test wrapper
- `src/utils/` — shared test utilities

## Public API (key exports)

`fakeMediaClient`, `StoryBookAuthProvider`, `generateFilesFromTestData`, and 48 total export subpaths covering mocks, helpers, factories, and data URIs.

## Development notes

- Internal dependencies: `@atlaskit/media-client`, `@atlaskit/media-common`, `@atlaskit/media-state`, `@atlaskit/media-ui`
- Peer dependencies: `@atlaskit/media-core`, `react`, `react-intl`
- 1 feature flag: `should-render-to-parent-should-be-true-media-exif`
- 48 export subpaths — always use subpath imports rather than the root barrel
- Uses MSW (Mock Service Worker) for network-level mocking
