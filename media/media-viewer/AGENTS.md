# media-viewer — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-viewer`                                                                                                     |
| Path     | `media-viewer/`                                                                                                              |
| Owner    | Media Exif                                                                                                                   |
| Purpose  | Full-screen media viewer — powerful and extendable viewer for images, video, audio, documents, SVG, archives, and code files |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-viewer.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

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
- Peer dependencies: `@emotion/react`, `react`, `react-dom`, `react-intl`
- Export subpaths: `.`, `./classnames`, `./media-viewer-loader`, `./types`, `./viewer-options`
- Supports custom viewer via `CustomRendererConfig`
- Inset presentation: when `extensions.useInsetViewer` is set and the
  `cc_comments_inset_media_viewer` gate is on, `media-viewer.tsx` computes `isInsetViewer` once and
  provides it through `InsetViewerProvider` (`src/insetViewerContext.tsx`). Components read it with
  `useIsInsetViewer()` or, for class components, `withInsetViewer`; don't re-derive it from
  `extensions`.
  - Media header (`src/header.tsx`, rendered by `List` as in the overlay viewer): one-line file name
    and size, the consumer's extra actions, and, while the sidebar is closed, download, the sidebar
    toggle and close.
  - Sidebar column (`SidebarColumn` in `src/styleWrappers.tsx`): holds `extensions.sidebar` next to
    the media, with its own header row (`src/inset-sidebar-header.tsx`: title, download, sidebar
    toggle and close) above the body, in one width animation and one enter/exit motion; when closed
    it stays mounted but is `aria-hidden`.
  - Media footer (`MediaFooterBar`): registers its element through the footer context; zoom controls
    render into it with a portal (`withInsetViewerFooter`).
- Large test suite: 50+ test files under `src/__tests__/`
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
