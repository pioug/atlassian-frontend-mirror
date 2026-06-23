# media-client — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-client`                                                                                                          |
| Path     | `media-client/`                                                                                                                   |
| Owner    | Media Exif                                                                                                                        |
| Purpose  | Media API Web Client Library — manages file state subscriptions, uploads, downloads, and communication with the Media backend API |

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

**Entry point:** `.agents/knowledge-index/INDEX.md`
**Unit doc:** `.agents/knowledge-index/domains/media/units/atlaskit-media-client.md`
**Standards page:** `.agents/knowledge-index/domains/media/units/atlaskit-media-client/standards-and-patterns.md`
**CLI:** `python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources` first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/client/` — MediaClient implementation and file fetcher
- `src/models/` — data models and error types
- `src/uploader/` — file upload logic
- `src/utils/` — utilities (hashing, polling, request, mobile upload state machine)
- `src/upload-controller.ts` — upload lifecycle controller
- `src/file-streams-cache.ts` — observable file state caching
- `src/identifier.ts` — file/external identifier types

## Development notes

- Peer dependencies: `@atlaskit/media-core`, `@atlaskit/media-state`
- Key internal dependencies: `@atlaskit/chunkinator`, `@atlaskit/media-common`
- 8 feature flags registered (see `package.json` → `platform-feature-flags`)
- Notable flags: `platform_media_cdn_delivery`, `platform_media_cdn_single_host`,
  `platform_media_auth_provider_analytics`
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
