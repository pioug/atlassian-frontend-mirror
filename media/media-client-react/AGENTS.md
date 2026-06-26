# media-client-react — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-client-react`                                                                                             |
| Path     | `media-client-react/`                                                                                                      |
| Owner    | Media Exif                                                                                                                 |
| Purpose  | React bindings for the Media Client — provides hooks, context, and HOCs for consuming media file state in React components |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-client-react.md` **Standards page:**
`.agents/knowledge-index/domains/media/units/atlaskit-media-client-react/standards-and-patterns.md`
**CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/MediaClientProvider.tsx` — React context provider
- `src/useFileState.ts` — primary hook for subscribing to file state
- `src/useMediaClient.ts` — hook to access the MediaClient instance
- `src/useMediaSettings.ts` — hook for media user preferences/settings
- `src/useFileHashes.ts` — hook for file content hashes
- `src/withMediaClient.tsx` — HOC for class components
- `src/withMediaClientAndSettings.tsx` — HOC combining client + settings
- `src/copyIntent/` — cross-client copy intent utilities
- `src/mediaSettings/` — user media preferences management

## Public API (key exports)

`MediaClientProvider`, `useMediaClient`, `useFileState`, `useMediaStore`, `useFileHashes`,
`useMediaSettings`, `withMediaClient`, `withMediaClientAndSettings`, `MediaProvider`,
`getMediaClient`, `MediaFileStateError`, `isMediaFileStateError`, `useCopyIntent`

## Development notes

- React Compiler is enabled for this package
- Peer dependencies: `@atlaskit/analytics-next`, `@atlaskit/media-state`, `react`, `react-dom`
- Key internal dependency: `@atlaskit/media-client`
- 4 feature flags registered, including `platform_media_cross_client_copy`
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
