# icon-file-type — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                 |
| -------- | ------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/icon-file-type`                                                            |
| Path     | `icon-file-type/`                                                                     |
| Owner    | Media Exif                                                                            |
| Purpose  | File type icons used to represent specific types of content across Atlassian products |

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
`.agents/knowledge-index/domains/media/units/atlaskit-icon-file-type.md` **Standards page:**
`.agents/knowledge-index/domains/media/units/atlaskit-icon-file-type/standards-and-patterns.md`
**CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point (exports `default`)
- `src/metadata.ts` — icon metadata definitions
- `src/internal/` — internal implementation details
- `src/entry-points/` — subpath entry points
- `glyph/` — compiled SVG glyph components (one per file type)
- `svgs/` — optimised SVG source files
- `svgs_raw/` — raw SVG source files

## Public API (key exports)

- `default` — main icon component
- Subpath exports: `./internal`, `./metadata`, `./glyph/*`

## Development notes

- No feature flags registered in this package
- No internal Media package dependencies
- Runtime dependencies: `@atlaskit/icon`, `@atlaskit/tokens`, `@babel/runtime`, `@compiled/react`
- Peer dependency: `react`
- Codemods available under `codemods/` for migration between versions
- Adding a new file type: add SVG to `svgs_raw/`, run build to generate `svgs/` and `glyph/`
