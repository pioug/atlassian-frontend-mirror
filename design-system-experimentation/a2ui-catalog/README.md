# @atlaskit/a2ui-catalog

Declarative catalog of [A2UI](https://a2ui.org/) **v0.9** components mapped
to Atlassian Design System packages. Pure data — no React, no runtime.

Consumed by:

- `@atlassian/a2ui-renderer-next` — to bind A2UI props to ADS components.
- A2UI Composer — to validate authored documents.
- MCP / Skills codegen — to surface the catalog to 3P agents (GitHub Copilot,
  Claude, etc.).

## Use a catalog in an external agent

Install this public package in the service that calls your model. Pin the resolved npm version
and commit your lockfile so catalog updates are reviewed alongside the host's supported version:

```sh
npm install --save-exact @atlaskit/a2ui-catalog
```

Load a prebuilt catalog; no React or schema-generation step is needed. For a Node.js CommonJS
agent service:

```js
const catalog = require('@atlaskit/a2ui-catalog/catalogs/ads-v0_9/catalog.json');

const systemPrompt = [
  'Produce A2UI v0.9 JSON messages, without Markdown, HTML, or React code.',
  'Use only the catalog and actions supported by this host.',
  catalog.instructions,
  JSON.stringify(catalog),
].join('\n\n');

// Pass systemPrompt to your model API as system/developer instructions.
// Supply the user's request separately; parse and validate the model's response.
```

For an ESM Node.js service, use `createRequire` from `node:module` with
`const require = createRequire(import.meta.url)` before the same `require(...)` call.
Other languages can read the JSON files from the installed package or from a versioned copy
produced by your build. An LLM cannot load an npm package by name: your integration must actually
provide the catalog content through its prompt, a schema-aware tool, or a resource the agent can
read. Merely mentioning the package name or catalog ID is insufficient.

Choose the catalog implemented by your host:

- `@atlaskit/a2ui-catalog/catalogs/ads-v0_9/catalog.json` contains the ADS base catalog.
- `@atlaskit/a2ui-catalog/catalogs/agentic-jira-v0_9-v1/catalog.json` extends ADS with CodeDiff,
  MultipleChoiceQuestions, RepositoryPicker, and ToolApproval. Use it only when the host supports
  those components.

### What the agent should emit

Start a surface with the selected document's `catalogId`, then send components using names and
properties from that catalog. For example, these two messages produce a simple text surface:

```json
[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "answer",
      "catalogId": "com.atlassian.ads/v0_9"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "answer",
      "components": [
        { "id": "root", "component": "Text", "text": "Hello from your agent" }
      ]
    }
  }
]
```

The array above illustrates message order; use your host's framing (for example, individual
streamed JSON messages). Keep `surfaceId` consistent, give every component a unique ID, and
include a component named `root`. Child slots reference component IDs. For editable values, use
`{ "path": "/field" }` bindings and initialize them through `updateDataModel`. Return subsequent
component/data updates to the same surface rather than generating HTML.

### Responsibilities of the integration

The catalog describes component schemas and agent instructions; it is not a complete response
schema or a renderer. Validate the A2UI message envelope separately and validate component payloads
against the selected catalog. Keep the complete document available when resolving schema references:
`$ref` values can point into both `$defs` and `components`, so extracting a component schema alone
loses its context. Pass validated messages to a host that registers matching component
implementations. Installing this package does not install the internal Atlassian renderer or add
components to another renderer automatically.

Have the host declare which catalog IDs and version it supports; choose a compatible pinned package
version. An npm version and a wire catalog ID are different: changing the npm scope does not change
`com.atlassian.ads/v0_9` or `com.atlassian.agentic-jira/v0_9/v1`. Catalog IDs are identifiers, not
URLs to fetch. Handle user actions in the host, validate and authorize them before executing work,
and return resulting surface/data updates. Client-side functions such as `openUrl` are not currently
included in these JSON documents; do not invent function signatures or assume host support.

Use the website JSON preview for inspection and debugging. Loading the npm asset is the recommended
production workflow because it keeps schemas and instructions in sync with the version you install.

### Migrate from the internal package

Replace `@atlassian/a2ui-catalog` with `@atlaskit/a2ui-catalog` in your package manifest and imports,
keeping the existing subpath (for example, `/v0_9/schemas`). Remove the old dependency and refresh
your lockfile. Wire IDs and component contracts are unchanged.

## Published catalog JSON

Every catalog in `CATALOG_DEFINITIONS` (`src/catalog-json/catalog-definitions.ts`) is published as a
standalone, self-contained JSON Schema (draft 2019-09) document so third-party agents can author
surfaces against it:

| Catalog ID                              | File                                             |
| --------------------------------------- | ------------------------------------------------ |
| `com.atlassian.ads/v0_9`                | `catalogs/ads-v0_9/catalog.json`                 |
| `com.atlassian.agentic-jira/v0_9/v1`    | `catalogs/agentic-jira-v0_9-v1/catalog.json`     |

The files are generated from the Zod schemas with `@a2ui/web_core`'s own inline-catalog
conversion. Common types are bundled under `$defs`, so every `$ref` is local. The catalog
package's Atlaskit documentation shows each public catalog with a JSON preview and copy
button. Catalogs marked `isPrivate` are still published here and omitted from that page.

Each document contains `catalogId`, `instructions` for the agent, `components` (one schema per
component name), and `$defs`. Client-side functions (for example `openUrl`) are not included yet,
because the renderer implements them without convertible schemas.

**Do not edit the files by hand.** After changing a schema or catalog membership, regenerate from
`platform/`:

```sh
afm workspace @atlaskit/a2ui-catalog codegen:catalog-json
```

`src/catalog-json/__tests__/catalog-json.test.ts` fails when the checked-in files are out of date.
When registering or removing a renderer adapter, update the matching
`src/<catalog>/catalog-component-apis.ts` list here before regenerating. Catalog membership is
explicit: keep these lists aligned with the renderer catalogs selected by the host.

To add a catalog, add its component API list and an entry to `CATALOG_DEFINITIONS`, then
regenerate. `@atlaskit/a2ui-catalog/catalog-json` exports `buildCatalogJson()` and
`CATALOG_DEFINITIONS` for tooling that needs the documents programmatically.

## Shipped specs (v0.9)

| Component | ADS mapping |
|-----------|-------------|
| `Button` | `@atlaskit/button` (new) |
| `Text` | `@atlaskit/primitives` Text + `@atlaskit/heading` |
| `Row` | `@atlaskit/primitives` Inline |
| `Column` | `@atlaskit/primitives` Stack |
| `CheckBox` | `@atlaskit/checkbox` (single + group via `group[]`) |
| `Card` | `@atlaskit/card` |
| `TextField` | `@atlaskit/textfield` / `@atlaskit/textarea` (via `variant: longText`) |
| `MultipleChoice` | `@atlaskit/radio-group` / `@atlaskit/dropdown-menu` (via `style: action`) |
| `Form` | `@atlaskit/form` Form |
| `Field` | `@atlaskit/form` Field |
| `FormSection` | `@atlaskit/form` FormSection |
| `FormHeader` | `@atlaskit/form` FormHeader |
| `FormFooter` | `@atlaskit/form` FormFooter |

See `references/registry.md` in the `a2ui-catalog-mapper` skill for the
full per-component deviation notes.

## Spec fidelity

The component prop types and Zod schemas in this package mirror the
on-the-wire shapes defined by the v0.9 spec. They are intentionally NOT a
superset — Atlassian-specific styling knobs live in renderer adapters, not
here. No prop is added to a schema unless it exists in the corresponding AK
component.

Notable spec details that often catch authors out:

- `Button.action` is REQUIRED and uses `name` (not `event`); `context` is
  an array of `{ key, value: ValueObject }` (not a `Record<…>`).
- `Text.text` is a `StringValue` (`{ literalString | path | literal }`),
  not a bare string.
- `Row.children` / `Column.children` is a plain `string[]` of component IDs
  in v0.9 (no template references).
- `CheckBox.group` (not `options`) holds the array of choice objects for
  checkbox-group mode.
- `Field` is a pure layout wrapper — label, child slot, help/error/valid
  messages. It does not manage form state.

## Adding a new component (AI-assisted)

For ADS base-catalog mapping, use the optional
**`a2ui-catalog-mapper` Platform agent skill** when available. It guides schema,
adapter, tests, playground, and wiring, and self-improves after each use. The
skill lives in `platform/.agents/skills/`; agents can load it from there or use
the trigger phrases below where supported. Catalog registration is explicit;
adding files alone does not expose a component to a host.

### Using the skill

Agents with skill auto-loading can use the following requests; otherwise, open
the linked `SKILL.md` directly:

```
add <ComponentName> to a2ui-catalog
```

or equivalently:

```
map @atlaskit/<component> into the v0.9 catalog
```

The skill lives at `platform/.agents/skills/a2ui-catalog-mapper/SKILL.md`.
It guides the following steps:

1. Read the canonical ADS examples from
   `platform/packages/design-system/<component>/examples/` (or fall back to
   the ADS MCP / docs search).
2. Generate the Zod schema in `a2ui-catalog/src/v0_9/schemas.ts`.
3. Wire the API entry in `a2ui-catalog/src/v0_9/apis.ts` and update
   `a2ui-catalog/src/v0_9/index.ts`.
4. Generate the React adapter in
   `a2ui-renderer/src/v0_9/components/<Name>Adapter.tsx`.
5. Register the adapter in `a2ui-renderer/src/v0_9/catalog.ts` and
   `a2ui-renderer/src/v0_9/index.ts`.
6. Generate schema + adapter unit tests.
7. Generate a playground example under `a2ui-renderer/examples/`.
8. Run `tsc` + `eslint` + tests and iterate until clean.
9. Update `references/registry.md` and `references/gotchas.md` so the skill
   improves for the next run.

See the skill's `references/registry.md` for the current component inventory
and any per-component deviations from the upstream spec.

### Manual procedure

If adding by hand, follow the 9-step procedure in
`platform/.agents/skills/a2ui-catalog-mapper/references/operating-procedure.md`.
Key files to touch:

| Step | File |
|------|------|
| Schema | `src/v0_9/schemas.ts` |
| API entry | `src/v0_9/apis.ts` |
| Types and entry points | `src/v0_9/types.ts`, `src/entry-points/`, and `package.json` exports |
| Adapter | `../a2ui-renderer/src/v0_9/components/<Name>Adapter.tsx` |
| Catalog registration | `../a2ui-renderer/src/v0_9/ads-catalog-adapters.ts` |
| Renderer exports | `../a2ui-renderer/src/entry-points/` and `package.json` exports |

## Agentic Jira v0.9 catalog (`com.atlassian.agentic-jira/v0_9/v1`)

A second catalog shipped from `src/agentic-jira-v0_9/` — high-level
agentic-workflow composites modelled on the Jira agent-session tools:

| Component | Modelled on |
|-----------|-------------|
| `MultipleChoiceQuestions` | `@atlassian/agentic-planning` `MultipleChoiceQuestionsTool` |
| `RepositoryPicker` | `@atlassian/repository-choice` `RepositoryChoiceForm` |
| `ToolApproval` | ai-agent-sessions `DefaultMCPActionPlan` |

Import via the `./agentic-jira-v0_9/*` subpaths (`schemas`, `apis`, `types`,
`catalog-id`). The rendering catalog is assembled by
`@atlassian/a2ui-renderer-next/agentic-jira-v0_9/catalog` →
`createAgenticJiraCatalog()`, which registers a superset of the ADS base
catalog: every ADS base adapter plus the three composites. See each schema's
JSDoc for the wire contracts.

The trailing `/v1` in the ID is the catalog's own major version: breaking
schema changes mint a new ID (`…/v2`) registered alongside `v1`, letting
catalog negotiation migrate surfaces with zero downtime (see the versioning
policy in `catalog-id.ts`).
