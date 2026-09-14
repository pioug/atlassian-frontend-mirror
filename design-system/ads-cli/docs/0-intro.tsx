import { md } from '@atlaskit/docs';

const intro: React.ReactElement = md`
	An \`npx\`-runnable command-line tool to query **Atlassian Design System (ADS) structured
	content** — components, tokens, icons, and guidelines — directly from your terminal.

	~~~sh
	npx @atlaskit/ads-cli search button
	~~~

	It is a thin, zero-drift layer over the shared \`@atlaskit/ads-mcp\` tools: the same query logic
	that powers the ADS MCP server and the \`atlassian-design-system\` agent skill. The CLI never
	reimplements search ranking or bundles its own copy of the dataset — there is one source of truth.

	## Why

	Distributing ADS structured content through a CLI lets developers **and coding agents** query
	components from the terminal without configuring an MCP client. Human-readable output is the
	default; the \`--json\` flag emits a stable, self-describing envelope for machine consumers.

	## Commands

	- \`init\` — set up the ADS, UI Styling Standard, and Accessibility Foundation agent skills at
	  the Git repository root and install the Atlas CLI ADS plugin.
	- \`search <query...>\` — **unified** fuzzy-search across components, tokens, icons, and
	  foundations docs at once, grouped by kind. Search results include a command for opening the full
	  detail. Narrow results with \`--type component|token|icon|docs\`; limit with \`--limit N\`.
	- \`batch --command <command> [args...]...\` — run multiple ADS CLI queries, including different
	  command types, in one process. Repeat \`--command\` once per child; each keeps its normal
	  arguments, flags, and response envelope. Tokenized child requests are canonical; complete quoted
	  requests are also accepted and safely normalized to argv without invoking a shell.
	- \`component <name>\` — detail for a single component; an exact name shows detail, an ambiguous
	  name shows a "did you mean?" list (\`--all\` lists every component).
	- \`token <name>\` — detail for a single token, same exact-vs-ambiguous behaviour (\`--all\` lists
	  every token).
	- \`icon <name>\` — detail for a single icon, including a copy-paste import line (\`--all\` lists
	  every icon).
	- \`lint-rules [term...]\` — ADS ESLint rules. A term matching one rule prints its docs; several
	  matches show a "did you mean?" list. Bare \`lint-rules\` prints every rule; \`--limit N\` caps
	  the candidate list.
	- \`docs <topic...>\` — read ADS reference docs. Three forms:
	  - \`docs <term...>\` — foundations guidelines (spacing, color, …).
	  - \`docs a11y [topic]\` — accessibility guidance; optional topic such as \`buttons\`, \`forms\`,
	    or \`colors\` (omit for the full bundle).
	  - \`docs migration <id>\` — a structured migration guide for a known package or API migration.
	- \`manifest\` — describe every command, argument, flag, and JSON response type. Use \`--json\`
	  for the machine-readable contract.

	### Global flags

	- \`--json\` — emit a machine-readable JSON envelope on stdout.
	- \`--help\`, \`-h\` — show help.
	- \`--version\`, \`-v\` — show the CLI version.

	## Examples

	~~~sh
	# Set up ADS guidance for coding agents in the current Git repository
	npx @atlaskit/ads-cli init

	# Unified human-readable search — components, tokens, icons, and docs grouped together
	npx @atlaskit/ads-cli search contrast

		# Narrow to a single kind
		npx @atlaskit/ads-cli search space color --type token
		npx @atlaskit/ads-cli search contrast --type docs

	# Run multiple queries, including different command types, in one process
	# Canonical tokenized form
	npx @atlaskit/ads-cli batch --command search button --type icon --command token space.200

	# Complete-string compatibility form
	npx @atlaskit/ads-cli batch --command "search button" --type icon --command "token space.200"

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
	~~~

	## Output contract

	\`init\` resolves the Git repository root from the current directory, then installs the
	\`atlassian-design-system\`, \`ui-styling-standard\`, and \`a11y-foundation\` skills under the
	repository-local \`.agents/skills\` directory without overwriting a current installation. It then
	creates or safely updates a marked ADS initialization block in the repository-root
	\`AGENTS.md\`, preserving user-authored content and pointing the current agent at
	\`references/get-started.md\`. Re-running \`init\` updates only that block and skips an already
	current file. Malformed markers and symlinked or non-regular targets are refused. Outside a Git
	repository it skips the repository-local skills and \`AGENTS.md\` update, but still performs Atlas
	setup. Whenever Atlas is available and its ADS plugin is missing, \`init\` installs the plugin.
	If repository-local guidance setup fails, Atlas setup is attempted before the error is reported.
	If Atlas is unavailable, the skill setup still succeeds and \`npx @atlaskit/ads-cli\` remains available.

	- **Data is written to stdout only.** Logs, hints, and errors go to **stderr**, so \`--json\`
	  output stays clean for piping.
	- **Batch commands are independent.** They run concurrently and return one item per command,
	  containing the original tokenized request, a \`success\`, \`ambiguous\`, or \`failure\` status,
	  and the child command's unchanged response envelope. Failed or ambiguous commands are reported
	  alongside successful commands, and a syntactically valid batch exits \`0\`.
	- With \`--json\`, every success prints a success envelope and every failure prints an error
	  envelope. The \`type\` discriminator (\`ads-cli/<command>\` or \`ads-cli/error\`) lets consumers
	  branch without re-parsing:
	- The \`manifest --json\` payload is derived from the live command registry and lists every
	  command, positional argument, flag, example, and success response type.

	~~~json
	{
		"type": "ads-cli/search-components",
		"command": "search",
		"ok": true,
		"data": [],
		"meta": { "terms": ["avatar"], "limit": 5, "count": 2 }
	}
	~~~

	## Exit codes

	- \`0\` — success.
	- \`1\` — unexpected runtime error.
	- \`2\` — usage error (invalid arguments or unknown command).
	- \`3\` — no matching results found.

	## Relationship to the ADS MCP server and skill

	This CLI, the \`@atlaskit/ads-mcp\` server, and the \`atlassian-design-system\` agent skill are
	all thin surfaces over the **same** ADS query logic and bundled component dataset. Adding or
	improving a tool in \`@atlaskit/ads-mcp\` is automatically reflected here.
`;

export default intro;
