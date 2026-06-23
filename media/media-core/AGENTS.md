# media-core — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-core`                                                                                                                        |
| Path     | `media-core/`                                                                                                                                 |
| Owner    | Media Exif                                                                                                                                    |
| Purpose  | Core primitive types for Media — authentication types, cache utilities, and chunk hash algorithm definitions shared across all Media packages |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-core.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/auth.ts` — auth types (`ClientBasedAuth`, `AsapBasedAuth`, `AuthProvider`, etc.)
- `src/cache.ts` — `CachedMediaState`, `StateDeferredValue`
- `src/ChunkHashAlgorithm.ts` — hash algorithm type

## Public API (key exports)

`ClientBasedAuth`, `AsapBasedAuth`, `ClientAltBasedAuth`, `Auth`, `AuthContext`, `AuthProvider`,
`MediaApiConfig`, `MediaClientConfig`, `isClientBasedAuth`, `isAsapBasedAuth`, `authToOwner`,
`CachedMediaState`, `StateDeferredValue`, `ChunkHashAlgorithm`

## Development notes

- Knowledge-index standards page: `.agents/knowledge-index/domains/media/units/atlaskit-media-core/standards-and-patterns.md`
- Foundational package — no internal Media package dependencies
- No feature flags registered
- Runtime dependencies: `@babel/runtime`, `eventemitter2`, `lru_map`, `rxjs`
- Peer dependency: `react`
- Export subpaths: `.`, `./auth`, `./cache`, `./chunk-hash-algorithm`
- Changes here affect every other Media package — be conservative
