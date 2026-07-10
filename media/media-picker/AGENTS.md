# media-picker — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Package identity

| Field    | Value                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| NPM name | `@atlaskit/media-picker`                                                                                                            |
| Path     | `media-picker/`                                                                                                                     |
| Owner    | Media Exif                                                                                                                          |
| Purpose  | File selection and upload components — Browser (file dialog), Dropzone, and Clipboard picker variants with upload progress tracking |

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
`.agents/knowledge-index/domains/media/units/atlaskit-media-picker.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

## Key source files

- `src/index.ts` — public API entry point
- `src/components/browser.tsx` — file dialog picker component
- `src/components/dropzone.tsx` — drag-and-drop dropzone component
- `src/components/clipboard.tsx` — clipboard paste picker component
- `src/components/errorFlagGroup.tsx` — error flag display
- `src/domain/` — domain types and upload state
- `src/popup/` — popup picker (legacy)
- `src/service/` — upload service layer
- `src/util/` — shared utilities
- `playbooks/testing.md` — testing guidance specific to this package

## Development notes

- React Compiler is enabled for this package
- Peer dependencies: `@atlaskit/media-core`, `react`, `react-dom`, `react-intl`
- 2 feature flags: `platform_media_picker_upload_batching`,
  `should-render-to-parent-should-be-true-media-exif`
- Export subpaths: `.`, `./browser`, `./clipboard`, `./components/types`, `./dropzone`, `./plugin`,
  `./preview`, `./types`
- All new behaviour changes must be behind a feature gate (`fg()` from
  `@atlaskit/platform-feature-flags`)
