# media-viewer — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field | Value |
|---|---|
| NPM name | `@atlaskit/media-viewer` |
| Path | `media-viewer/` |
| Owner | Media Exif |
| Purpose | Full-screen media viewer — powerful and extendable viewer for images, video, audio, documents, SVG, archives, and code files |

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
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-viewer.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/media-viewer.tsx` — root `MediaViewer` component
- `src/viewers/` — per-format viewer implementations (image, video, doc, SVG, code, archive, custom)
- `src/components/` — shared viewer UI components
- `src/analytics/` — analytics event definitions and helpers
- `src/domain/` — domain types and state
- `src/utils/` — shared utilities
- `src/header.tsx` — viewer header bar
- `src/navigation.tsx` — multi-file navigation
- `src/content.tsx` — content area

## Public API (key exports)

`MediaViewer` (default), `MediaViewerExtensions`, `MediaViewerExtensionsActions`,
`MediaViewerProps`, `MediaMessage`, `ViewerOptionsProps`, `CustomRendererConfig`,
`CustomRendererStateProps`, `CustomRendererProps`, `ArchiveFileItem`

## Development notes

- React Compiler is enabled for this package
- Peer dependencies: `@emotion/react`, `react`, `react-intl`
- Export subpaths: `.`, `./classnames`, `./media-viewer-loader`, `./types`, `./viewer-options`
- Supports custom viewer via `CustomRendererConfig`
- Large test suite: 50+ test files under `src/__tests__/`
- All new behaviour changes must be behind a feature gate (`fg()` from `@atlaskit/platform-feature-flags`)
