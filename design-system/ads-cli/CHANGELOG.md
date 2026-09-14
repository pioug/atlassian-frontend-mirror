# @atlaskit/ads-cli

## 0.11.0

### Minor Changes

- [`9a9bcd8b61613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9a9bcd8b61613) -
  Unify ADS and Platform CLI discovery with shared search formatting, ADS foundation catalogs,
  aligned property tables, dark code blocks, and invocation-aware follow-up commands.

### Patch Changes

- Updated dependencies

## 0.10.0

### Minor Changes

- [`537518b083114`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/537518b083114) -
  Extend `init` with a repository-local ADS setup reference and a managed `AGENTS.md` block. The
  guidance links installed skills when available and documents hosted ADS MCP setup without writing
  MCP client configuration files.

## 0.9.0

### Minor Changes

- [`3d3cd51d49e72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d3cd51d49e72) -
  Add an init command that installs the repository-local ADS, UI Styling Standard, and Accessibility
  Foundation skills and configures the Atlas ADS plugin. When `@atlassian/skills` is unavailable,
  initialization skips skills and continues with Atlas setup.

## 0.8.2

### Patch Changes

- [`d4d571ff39f04`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4d571ff39f04) -
  Document that `ads-cli search` returns up to two matches per term, per result type by default and
  that `--limit` overrides the default.

## 0.8.1

### Patch Changes

- [`d26c33453c778`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d26c33453c778) -
  Refactor grouped search rendering to avoid compacting human-readable results twice.

## 0.8.0

### Minor Changes

- [`7b42e3dbea8db`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b42e3dbea8db) -
  Several updates to the ADS CLI output.

  **`--json` contract change:** `search --json` and `component|token|icon --all --json` now return
  concise summaries for each result.
  - Component JSON summaries replace `props` and `examples` with `propCount` and `exampleCount`, and
    omit `designSource` and other detail-only metadata.
  - Token `--all --json` summaries omit `usageGuidelines`.
  - Icon `--all --json` summaries omit fields such as `keywords`, `categorization`, `team`,
    `status`, and `shouldRecommendSmallIcon`.

  For example, a component result from `ads-cli search avatar --json` changes from a detailed
  record:

  ```jsonc
  {
  	"name": "Avatar",
  	"package": "@atlaskit/avatar",
  	"props": [
  		/* ... */
  	],
  	"examples": [
  		/* ... */
  	],
  	"designSource": {
  		/* ... */
  	},
  }
  ```

  to a compact summary:

  ```json
  {
  	"name": "Avatar",
  	"package": "@atlaskit/avatar",
  	"propCount": 21,
  	"exampleCount": 1,
  	"followUp": "component Avatar"
  }
  ```

  The fields omitted from the summary are available by running the individual command, for example
  `ads-cli component Avatar --json`.

  Other changes:
  - Search JSON summaries include a `followUp` command for retrieving the individual record.
  - Individual token JSON (`token <name> --json`) now includes usage guidelines and an actionable
    `usage` value. Previously, usage guidelines were only available through `token --all --json`.
  - Human-readable token details now surface usage guidelines; the actionable usage line was already
    present.
  - Icon details (`icon <name>`) now include an import statement for `--json` mode.
  - Human-readable migration guides now preserve before/after steps.
  - Large JSON responses are allowed to drain before exit.

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [`70516acb1b138`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/70516acb1b138) -
  Support complete-string child requests in `ads-cli batch` while preserving the canonical tokenized
  form.

  ```sh
  # Canonical tokenized form
  npx @atlaskit/ads-cli batch --command component "Inline Dialog"

  # Complete-string compatibility form
  npx @atlaskit/ads-cli batch --command 'component "Inline Dialog"'
  ```

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`23b45bcd71b5d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23b45bcd71b5d) -
  Add an in-process batch command for running multiple ADS CLI queries with independent results,
  using a repeated `--command` flag to introduce each child request.

  For example:

  ```sh
  npx @atlaskit/ads-cli batch --command search button --type icon --command token space.200
  ```

  For readability, put each `--command` group on its own line — the two forms are equivalent:

  ```sh
  npx @atlaskit/ads-cli batch \
    --command search button --type icon \
    --command token space.200
  ```

## 0.5.0

### Minor Changes

- [`34cfe0f138d1c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/34cfe0f138d1c) -
  Show the active command invocation in ADS CLI help, errors, and follow-up hints. The v2 JSON
  manifest removes the redundant `invocation` field.

## 0.4.2

### Patch Changes

- [`3f494bce2de11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f494bce2de11) -
  Fix the Atlas CLI release pipeline to publish ADS plugin artifacts to the ADS Statlas namespace
  with installable object paths.

## 0.4.1

### Patch Changes

- [`5faf9a7e8dabc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5faf9a7e8dabc) -
  Skip fetching remote release history when the initial Statlas release explicitly uses the
  checked-in seed manifest.

## 0.4.0

### Minor Changes

- [`ccba0c0605171`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ccba0c0605171) -
  Add an Atlas CLI distribution (internal to Atlassian) with bundle-safe ADS MCP loading and Statlas
  release packaging.

  After the plugin is published, internal staff can run the ADS CLI with `atlas ads` instead of
  `npx @atlaskit/ads-cli`. For example:

  ```sh
  atlas ads search avatar
  ```

## 0.3.0

### Minor Changes

- [`d678f1fec09ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d678f1fec09ca) -
  Include concise, query-labelled foundations docs in unified search results, with leading-text
  previews, docs filtering, and detail commands. For example:

  ```sh
  npx @atlaskit/ads-cli search contrast --type docs
  ```

## 0.2.0

### Minor Changes

- [`f37252516ee5d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f37252516ee5d) -
  Add a `manifest` command for discovering ADS CLI commands in human-readable or JSON format.

## 0.1.0

### Minor Changes

- [`a5eabf99c6345`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5eabf99c6345) -
  Add `@atlaskit/ads-cli`: an npx-runnable CLI to query ADS structured content as a thin, zero-drift
  layer over the `@atlaskit/ads-mcp` tools. Commands:
  - `search <query...>` — unified search across components, tokens, and icons at once (grouped by
    kind); narrow with `--type`.
  - `component <name>` / `token <name>` / `icon <name>` — the detail view for a single item; pass
    `--all` to list every entry of that kind (the icon view includes a copy-paste import).
  - `lint-rules [term...]` — ADS ESLint rules; a fuzzy term that matches several rules shows a "did
    you mean?" list (like the item commands), while a unique/exact match prints the rule's docs
    (`--limit` caps the list).
  - `docs <topic...>` — ADS reference docs: `docs <term>` (foundations), `docs a11y [topic]`
    (accessibility), and `docs migration <id>` (migration guides).

  Default output is a compact, human-readable view; `--json` emits a stable envelope with documented
  exit codes (0 ok, 1 runtime, 2 usage, 3 not-found).

  Usage:

  ```sh
  # Unified search across components, tokens, and icons
  npx @atlaskit/ads-cli search button

  # Detail for a single component (machine-readable envelope)
  npx @atlaskit/ads-cli component Button --json

  # Read a foundations doc
  npx @atlaskit/ads-cli docs spacing
  ```
