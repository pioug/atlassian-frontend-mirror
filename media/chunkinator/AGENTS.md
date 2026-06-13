# chunkinator — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/chunkinator`                                                                                                                             |
| Path     | `chunkinator/`                                                                                                                                      |
| Owner    | Media Exif                                                                                                                                          |
| Purpose  | Upload large files from the browser with ease — splits files into chunks, hashes them, probes for already-uploaded chunks, and uploads missing ones |

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
`.agents/knowledge-index/domains/media/units/atlaskit-chunkinator.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/chunkinator.ts` — main orchestrator
- `src/domain.ts` — core domain types (`Chunk`, `HashedBlob`, etc.)
- `src/hashinator.ts` — chunk hashing logic
- `src/slicenator.ts` — file slicing into chunks
- `src/uploadinator.ts` — chunk upload pipeline
- `src/processinator.ts` — post-upload processing
- `src/utils.ts` — shared utilities

## Public API (key exports)

`chunkinator`, `Chunkinator`, `ChunkinatorFile`, `ChunkinatorResponse`, `Options`,
`HashingFunction`, `UploadingFunction`, `ProcessingFunction`, `Callbacks`, `Chunk`, `HashedBlob`

## Development notes

- No feature flags registered in this package
- No internal Media package dependencies — standalone upload utility
- Peer dependency: `react`
- Runtime dependencies: `@babel/runtime`, `rxjs`
- Tests live under `src/__tests__/`
