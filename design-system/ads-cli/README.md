# @atlaskit/ads-cli

An `npx`-runnable command-line tool to query **Atlassian Design System (ADS) structured content** —
components, tokens, icons, and guidelines — directly from your terminal.

```sh
npx @atlaskit/ads-cli search button
```

It is a thin, zero-drift layer over the shared `@atlaskit/ads-mcp/tools/*` exports: the same query
logic that powers the ADS MCP server and the `atlassian-design-system` agent skill. The CLI never
reimplements search ranking or bundles its own copy of the dataset — there is one source of truth.

## Why

Distributing ADS structured content through a CLI lets developers **and coding agents** query
components from the terminal without configuring an MCP client. Human-readable output is the
default; `--json` emits a stable, self-describing envelope for machine consumers.

## Commands

The CLI has these commands:

| Command                | Description                                                                                                                                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search <query...>`    | **Unified** fuzzy-search across components, tokens, and icons at once. Narrow with `--type component\|token\|icon`; limit with `--limit N`.                                                                                                                             |
| `component <name>`     | Detail for a single component. Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every component.                                                                                                                                                  |
| `token <name>`         | Detail for a single token. Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every token.                                                                                                                                                          |
| `icon <name>`          | Detail for a single icon (with a copy-paste import). Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every icon.                                                                                                                                 |
| `lint-rules [term...]` | ADS ESLint rules. A term that matches one rule (exactly or uniquely) prints its docs; several matches show a "did you mean?" list. Bare `lint-rules` prints every rule; `--limit N` caps the candidate list.                                                            |
| `docs <topic...>`      | Read ADS reference docs. Three forms:<br>• `docs <term...>` — foundations guidelines (spacing, color, …)<br>• `docs a11y [topic]` — accessibility guidance (optional topic e.g. `buttons`, `forms`, `colors`)<br>• `docs migration <id>` — a structured migration guide |

### Global flags

- `--json` — emit a machine-readable JSON envelope on stdout.
- `--help`, `-h` — show help.
- `--version`, `-v` — show the CLI version.

## Examples

```sh
# Unified human-readable search — components, tokens, and icons grouped together
npx @atlaskit/ads-cli search button

# Narrow to a single kind
npx @atlaskit/ads-cli search space color --type token

# Detail for a single component, token, or icon
npx @atlaskit/ads-cli component Avatar
npx @atlaskit/ads-cli token space.100
npx @atlaskit/ads-cli icon AddIcon

# List every entry of a kind
npx @atlaskit/ads-cli icon --all

# Reference docs — foundations, accessibility, migrations
npx @atlaskit/ads-cli docs spacing
npx @atlaskit/ads-cli docs a11y buttons
npx @atlaskit/ads-cli docs migration motion

# Machine-readable envelope for agents / jq
npx @atlaskit/ads-cli search button --json
```

## Output contract

- **Every command is human-readable by default; `--json` is the only path to structured output.**
  `search` and the `--all` listings print one compact line per result (e.g.
  `Avatar  @atlaskit/avatar  (42 props, 1 example)`), and unified `search` groups results into
  `Components` / `Tokens` / `Icons` sections with a `→ ads-cli component Avatar` follow-up hint per
  row. `component`/`token`/`icon` print a readable detail view (the icon view includes a copy-paste
  `import` line); `docs` (foundations, `a11y`, and `migration`) and `lint-rules` print
  prose/Markdown. A raw JSON dump is only ever a last-resort fallback for an unrecognised shape. For
  the **full structured payload**, use `--json`.
- **Lookups never silently guess.** `component`/`token`/`icon <name>` — and a fuzzy
  `lint-rules <term>` — render the entry whose name matches exactly (case-insensitively). If there
  is no exact match but several candidates, they print a `Did you mean?` list (each with a
  `→ ads-cli <command>` follow-up) and exit `0` — under `--json` this is
  `{ "ambiguous": true, "query", "noun", "candidates": [...] }`.
- **Data is written to stdout only.** Logs, hints, and errors go to **stderr**. This keeps `--json`
  output clean for piping.
- With `--json`, every success prints a `SuccessEnvelope` and every failure prints an
  `ErrorEnvelope`:

  ```jsonc
  // success — unified search groups data by kind
  {
    "type": "ads-cli/search",
    "command": "search",
    "ok": true,
    "data": { "components": [ /* … */ ], "tokens": [ /* … */ ], "icons": [ /* … */ ] },
    "meta": { "terms": ["button"], "count": 12 }
  }

  // success — a narrowed (--type) or single-tool command returns a flat array
  {
    "type": "ads-cli/search-components",
    "command": "search",
    "ok": true,
    "data": [ /* tool output */ ],
    "meta": { "terms": ["avatar"], "limit": 5, "count": 2 }
  }

  // failure
  {
    "type": "ads-cli/error",
    "command": "search",
    "ok": false,
    "error": { "code": "NOT_FOUND", "message": "No ADS components found for 'zzz'." }
  }
  ```

  The `type` discriminator (`ads-cli/<command>` or `ads-cli/error`) lets consumers branch without
  re-parsing.

## Exit codes

| Code | Meaning                                             |
| ---- | --------------------------------------------------- |
| `0`  | Success.                                            |
| `1`  | Unexpected runtime error.                           |
| `2`  | Usage error (invalid arguments or unknown command). |
| `3`  | No matching results found.                          |

## Relationship to the ADS MCP server and skill

This CLI, the [`@atlaskit/ads-mcp`](../ads-mcp) server, and the `atlassian-design-system` agent
skill are all thin surfaces over the **same** `@atlaskit/ads-mcp/tools/*` query logic and bundled
`ComponentMcpPayload[]` dataset. Adding or improving a tool in `ads-mcp` is automatically reflected
here.

> **Note:** An `atlas ads` plugin (for the Atlas CLI) is a separate future distribution path. The
> `--json` envelope here is intentionally structured so it can be wrapped by that plugin later
> without changes to this package.
