# media-document-viewer — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field | Value |
|---|---|
| NPM name | `@atlaskit/media-document-viewer` |
| Path | `media-document-viewer/` |
| Owner | Media Exif |
| Purpose | Modern and fast document viewer — renders paginated document previews with annotation and link support |

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
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-document-viewer.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/documentViewer.tsx` — main `DocumentViewer` component
- `src/page.tsx` — individual page rendering
- `src/annotations.tsx` — annotation overlay
- `src/documentLinks.tsx` — document link handling
- `src/usePageContent.ts` — hook for page content fetching
- `src/utils/` — utilities
- `__tests__/playwright/` — Playwright integration tests
- `__tests__/vr-tests/` — visual regression tests

## Public API (key exports)

`DocumentViewer`, `DOCUMENT_SCROLL_ROOT_ID`

## Development notes

- Only internal dependency: `@atlaskit/media-common`
- No feature flags registered in this package
- Peer dependency: `react`
- Has both Playwright and VR test suites
- All new behaviour changes must be behind a feature gate (`fg()` from `@atlaskit/platform-feature-flags`)
