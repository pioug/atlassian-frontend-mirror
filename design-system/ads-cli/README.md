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
default, with the same highlighted property tables and GitHub-dark-like code blocks used by Platform
CLI; `--json` emits a stable, self-describing envelope for machine consumers.

## Commands

The CLI has these commands:

| Command                                  | Description                                                                                                                                                                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`                                   | Set up repository-local ADS guidance and the Atlas CLI ADS plugin. Installs the ADS, UI Styling Standard, and Accessibility Foundation skills when `@atlassian/skills` is available, with a public guidance fallback when it is not.                                    |
| `search <query...>`                      | **Unified** fuzzy-search across components, tokens, icons, and foundations docs at once. Narrow results with `--type component\|token\|icon\|docs`; limit with `--limit N`.                                                                                             |
| `batch --command <command> [args...]...` | Run multiple ADS CLI queries, including different command types, in one process. Repeat `--command` once per child; each keeps its normal arguments, flags, and response envelope. Tokenized requests are canonical; complete quoted requests are also accepted.        |
| `component <name>`                       | Detail for a single component. Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every component.                                                                                                                                                  |
| `token <name>`                           | Full detail for a single token, including usage guidelines. Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every token as a concise summary.                                                                                                    |
| `icon <name>`                            | Detail for a single icon (with a copy-paste import). Exact name → detail; ambiguous → a "did you mean?" list. `--all` lists every icon.                                                                                                                                 |
| `lint-rules [term...]`                   | ADS ESLint rules. A term that matches one rule (exactly or uniquely) prints its docs; several matches show a "did you mean?" list. Bare `lint-rules` prints every rule; `--limit N` caps the candidate list.                                                            |
| `docs <topic...>`                        | Read ADS reference docs. Three forms:<br>• `docs <term...>` — foundations guidelines (spacing, color, …)<br>• `docs a11y [topic]` — accessibility guidance (optional topic e.g. `buttons`, `forms`, `colors`)<br>• `docs migration <id>` — a structured migration guide |
| `manifest`                               | Describe every command, argument, flag, and JSON response type. Use `--json` for the machine-readable contract.                                                                                                                                                         |

### Global flags

- `--json` — emit a machine-readable JSON envelope on stdout.
- `--help`, `-h` — show help.
- `--version`, `-v` — show the CLI version.

## Examples

```sh
# Set up ADS guidance for coding agents in the current Git repository
npx @atlaskit/ads-cli init

# Unified human-readable search — components, tokens, icons, and docs grouped together
npx @atlaskit/ads-cli search contrast

# Narrow to a single kind
npx @atlaskit/ads-cli search space color --type token
npx @atlaskit/ads-cli search contrast --type docs

# Run multiple queries, including different command types, in one process
npx @atlaskit/ads-cli batch \
  --command component Button \
  --command component Modal \
  --command docs spacing \
  --command search contrast --type docs

# Complete-string compatibility form (tokenized input above remains canonical)
npx @atlaskit/ads-cli batch \
  --command 'component "Inline Dialog"' \
  --command "search contrast" --type docs

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

# Discover the complete CLI contract
npx @atlaskit/ads-cli manifest --json
```

## Output contract

`init` resolves the Git repository root from the current directory. When `@atlassian/skills` can be
resolved and run, it installs three repository-local skills under `.agents/skills`:
`atlassian-design-system`, `ui-styling-standard`, and `a11y-foundation`. Each is installed with
`npx --yes @atlassian/skills add <skill> --universal --yes`. The command is idempotent and leaves
current skills untouched. An older ADS skill missing `references/get-started.md` is updated when the
published skill provides that reference. If the installed skill still lacks the reference, `init`
continues with public repository guidance rather than failing. If a destination exists without a
`SKILL.md`, `init` refuses to overwrite it and continues attempting the other skills.

If `@atlassian/skills` cannot be resolved or run—for example because the package registry is
unavailable or requires Atlassian authentication—`init` skips all repository-local skills after the
first availability failure and continues successfully. `npx @atlaskit/ads-cli` remains available,
and Atlas plugin setup still runs. JSON output reports each skipped skill as `not-installed` with
the stable reason `skills-installer-unavailable`.

In a Git repository, `init` creates or safely updates a marked ADS initialization block in the root
`AGENTS.md`, preserving user-authored content. When skills are installed, the block points to the
three skill entrypoints and the repository-local setup workflow. In public fallback mode, it omits
paths that were not installed. Both modes prefer `atlas ads`, document the `npx @atlaskit/ads-cli`
fallback, and include merge-safe setup snippets for the hosted ADS MCP server for Cursor, VS Code,
and Codex. `init` does not create or merge `.cursor/mcp.json`, `.vscode/mcp.json`, or
`.codex/config.toml`; agents apply those instructions only when a repository does not already
configure ADS MCP. Re-running `init` updates only the marked block and skips the write when it is
already current. Malformed markers and symlinked or non-regular `AGENTS.md` targets are refused
rather than overwritten.

Running `init` outside a Git repository skips the repository-local skills and `AGENTS.md` update and
reports why, but still performs Atlas setup. `init` installs the Atlas CLI ADS plugin whenever Atlas
is available and the plugin is missing. Atlas setup is also attempted before reporting a failure to
install or update the repository-local guidance. When Atlas itself is unavailable, repository setup
still succeeds and the CLI explains that `npx @atlaskit/ads-cli` remains available. Human output
includes the repository-local `references/get-started.md` next step only when that skill workflow
exists; JSON output reports the skills, `AGENTS.md`, Atlas, and next-step status.

- **Every command is human-readable by default; `--json` is the only path to structured output.**
  `search` and the `--all` listings print one compact line per result (e.g.
  `Avatar  @atlaskit/avatar  (42 props, 1 example)`), and unified `search` groups results into
  `Components` / `Tokens` / `Icons` / `Docs` sections. Every `search` row includes a follow-up
  command, such as `→ ads-cli component Avatar` or `→ ads-cli docs contrast`; this also applies to
  narrowed `search --type` output. Documentation search results stay concise, while `docs <query>`
  prints the full matched Markdown. `component`/`token`/`icon` print a readable detail view (the
  icon view includes a copy-paste `import` line); `docs` (`foundations`, `a11y`, and `migration`)
  and `lint-rules` print prose/Markdown. A raw JSON dump is only ever a last-resort fallback for an
  unrecognised shape.
- **Structured output mirrors the human retrieval budget.** Search and `--all` responses contain the
  same compact fields shown by the human rows rather than embedding every component prop and
  example. Each search record includes a machine-readable `followUp`; run that exact detail command
  for the full component, token, or icon data. Exact detail commands retain the information shown by
  their human view, including token `usageGuidelines` and `usage`, and an icon `import`.
  `manifest --json` is the intentional exception: it remains the full CLI contract.
- **Lookups never silently guess.** `component`/`token`/`icon <name>` — and a fuzzy
  `lint-rules <term>` — render the entry whose name matches exactly (case-insensitively). If there
  is no exact match but several candidates, they print a `Did you mean?` list (each with a
  `→ ads-cli <command>` follow-up) and exit `0` — under `--json` this is
  `{ "ambiguous": true, "query", "noun", "candidates": [...] }`.
- **Batch commands are independent.** Each repeated `--command` starts a child request. Passing its
  command and arguments as separate, tokenized argv is the canonical form. A complete quoted request
  is also accepted, including inner quoting and already-tokenized trailing flags; it is normalized
  to argv without invoking a shell. Shell operators, pipes, redirects, environment expansion, and
  command substitution are rejected with a usage error. `batch` runs valid commands concurrently
  through the existing command registry in one CLI process. Each item includes its normalized
  tokenized `request`, a `status` (`success`, `ambiguous`, or `failure`), and the child command's
  unchanged success or error `response` envelope. A failed or ambiguous child does not discard
  successful sibling results. A syntactically valid batch exits `0`; inspect each item's status or
  nested envelope.
- **Data is written to stdout only.** Logs, hints, and errors go to **stderr**. This keeps `--json`
  output clean for piping. `batch` is the one deliberate exception: a child's failure is part of the
  aggregate result rather than a failure of the batch itself, so per-child errors stay inline on
  stdout beside their `Request:` heading instead of being split onto stderr.
- **The manifest is derived from the live command registry.** `manifest --json` lists every command,
  positional argument, flag, example, and success response type without maintaining a separate copy
  of the CLI surface.
- With `--json`, every success prints a formatted `SuccessEnvelope` and every failure prints an
  `ErrorEnvelope`:

  ```jsonc
  // success — unified search groups data by kind
  {
    "type": "ads-cli/search",
    "command": "search",
    "ok": true,
    "data": {
      "components": [
        {
          "name": "Button",
          "package": "@atlaskit/button",
          "propCount": 13,
          "exampleCount": 3,
          "followUp": "component Button"
        }
      ],
      "tokens": [
        {
          "name": "motion.button.hovered",
          "exampleValue": "background-color 150ms cubic-bezier(0.4, 1, 0.6, 1)",
          "followUp": "token motion.button.hovered"
        }
      ],
      "icons": [],
      "docs": [
        {
          "title": "Button",
          "summary": "A concise preview of the leading textual content.",
          "followUp": "docs button"
        }
      ]
    },
    "meta": { "terms": ["button"], "count": 12 }
  }

  // success — a narrowed (--type) or single-tool command returns a flat array
  {
    "type": "ads-cli/search-components",
    "command": "search",
    "ok": true,
    "data": [
      {
        "name": "Avatar",
        "package": "@atlaskit/avatar",
        "propCount": 7,
        "exampleCount": 1,
        "followUp": "component Avatar"
      }
    ],
    "meta": { "terms": ["avatar"], "limit": 5, "count": 2 }
  }

  // success — batch preserves each child command's existing envelope
  {
    "type": "ads-cli/batch",
    "command": "batch",
    "ok": true,
    "data": [
      {
        "request": ["component", "Button"],
        "status": "success",
        "response": {
          "type": "ads-cli/component",
          "command": "component",
          "ok": true,
          "data": { /* full Button data */ },
          "meta": { "name": "Button" }
        }
      },
      {
        "request": ["docs", "missing-topic"],
        "status": "failure",
        "response": {
          "type": "ads-cli/error",
          "command": "docs",
          "ok": false,
          "error": { "code": "NOT_FOUND", "message": "No guidelines found for missing-topic." }
        }
      }
    ],
    "meta": {
      "succeeded": 1,
      "ambiguous": 0,
      "failed": 1,
      "count": 2
    }
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

The `--json` envelope is shared unchanged by the npm and Atlas distributions.

## Atlas CLI distribution

The same command surface is available as `atlas ads`. Its entrypoint delegates directly to `run()`,
so npm and Atlas share command parsing, output, and exit codes.

Build the self-contained JavaScript bundle from the `platform/` directory:

```sh
afm workspace @atlaskit/ads-cli build:atlas
node packages/design-system/ads-cli/build/atlas/ads-cli.js search button
```

The `.atlas-plugin` descriptor declares the `ads` plugin and the `atlas-cli-plugin-ads` Statlas
namespace. Every upload fetches `manifest.toml` from Statlas before adding a release, so the remote
manifest history remains canonical.

Prepare an Atlas-shaped release locally:

```sh
VERSION=local-$(git rev-parse --short HEAD) \
  afm workspace @atlaskit/ads-cli release:atlas:prepare
```

This builds 5 variants under `build/releases/$VERSION`, creates each archive and checksum,
smoke-tests the Linux AMD64 executable when running on Linux AMD64, and adds the release to the
`alpha` channel in the working manifest.

The `ads-cli-build-and-upload-to-statlas` custom pipeline runs the tests and typecheck, prepares the
release, uploads all artifacts, then publishes the manifest. Run it from `master`.

After validating an alpha release, run the `ads-cli-promote-stable-version` custom pipeline from
`master` with `VERSION_TO_PROMOTE` set to its exact version. Promotion updates the canonical remote
manifest without rebuilding or uploading artifacts.

The Statlas namespace authorization and Atlas plugin registry entry are one-time external
prerequisites. Until the registry entry is available, use `atlas atlasdev exec` to exercise a
packaged binary in the Atlas runtime. The AFM package scripts own the Node.js executable build; the
generic `atlas atlasdev plugin build` command doesn't drive this package.
