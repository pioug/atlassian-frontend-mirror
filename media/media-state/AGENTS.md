# media-state — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-state`                                                                                                                              |
| Path     | `media-state/`                                                                                                                                       |
| Owner    | Media Exif                                                                                                                                           |
| Purpose  | Centralised file state store for Media — manages `FileState` objects using Zustand with Immer; declared as a singleton to prevent multiple instances |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-state.md` **Standards page:**
`.agents/knowledge-index/domains/media/units/atlaskit-media-state/standards-and-patterns.md`
**CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/file-state.ts` — `FileState` union type and related types
- `src/store.ts` — Zustand store (`mediaStore`, `createMediaStore`, `MediaStore`)

## Public API (key exports)

`FileState`, `UploadingFileState`, `ProcessingFileState`, `ProcessedFileState`,
`ProcessingFailedState`, `ErrorFileState`, `MediaFileProcessingStatus`, `ProcessingFailReason`,
`MediaRepresentations`, `MediaFileArtifact`, `MediaUserArtifact`, `MediaFileArtifacts`,
`FilePreview`, `mediaStore`, `createMediaStore`, `MediaStore`, `Store`

## Development notes

- **Singleton package** — declared with `"singleton": true` in `package.json`. Only one instance
  must exist in the app at runtime. Do not duplicate or mock the store in non-test code.
- Internal dependency: `@atlaskit/media-common`
- Runtime dependencies: `immer`, `zustand`, `@babel/runtime`
- Export subpaths: `.`, `./file-state`, `./store`
- No feature flags registered
- Changes to `FileState` types affect every consuming package — coordinate carefully
