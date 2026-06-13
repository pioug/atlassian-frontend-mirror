# media-test-data — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-test-data`                                                                                                |
| Path     | `media-test-data/`                                                                                                         |
| Owner    | Media Exif                                                                                                                 |
| Purpose  | Sample file items and binary fixtures for use in Media tests — provides realistic test data without needing a live backend |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-test-data.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/sampleFileItems/` — sample `FileItem` data generators
- `src/itemsWithBinaries/` — items paired with binary content (for upload simulation)

## Public API (key exports)

`generateSampleFileItem`, `FileItemGenerator`, `generateItemWithBinaries`, `createItemWithBinaries`,
`sampleBinaries`, `artifactSets`, `ItemWithBinaries`, `Binaries`, `GeneratedItemWithBinaries`,
`ItemWithBinariesGenerator`

## Development notes

- Internal dependency: `@atlaskit/media-client`
- Runtime dependency: `@babel/runtime`
- Peer dependency: `react`
- No Jest-style test files in `src/` — this package IS test data, not a tested package
- Export subpaths: `.`, `./artifact-sets`, `./create-item-with-binaries`,
  `./items-with-binaries/types`, `./items-with-binaries`, `./sample-binaries`,
  `./sample-file-items`, `./types`
