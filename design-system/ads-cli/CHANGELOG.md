# @atlaskit/ads-cli

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
