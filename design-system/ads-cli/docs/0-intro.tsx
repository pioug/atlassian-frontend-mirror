import { md } from '@atlaskit/docs';

const intro: React.ReactElement = md`
	An \`npx\`-runnable command-line tool to query **Atlassian Design System (ADS) structured
	content** — components, tokens, icons, and guidelines — directly from your terminal.

	\`\`\`sh
	npx @atlaskit/ads-cli search button
	\`\`\`

	It is a thin, zero-drift layer over the shared \`@atlaskit/ads-mcp\` tools: the same query
	logic that powers the ADS MCP server and the \`atlassian-design-system\` agent skill. The CLI
	never reimplements search ranking or bundles its own copy of the dataset — there is one
	source of truth.

	## Why

	Distributing ADS structured content through a CLI lets developers **and coding agents** query
	components from the terminal without configuring an MCP client. Human-readable output is the
	default; the \`--json\` flag emits a stable, self-describing envelope for machine consumers.

	## Commands

		- \`search <query...>\` — **unified** fuzzy-search across components, tokens, icons, and
		  foundations docs at once, grouped by kind. Search results include a command for opening the
		  full detail. Narrow results with \`--type component|token|icon|docs\`; limit with
		  \`--limit N\`.
	- \`component <name>\` — detail for a single component; an exact name shows detail, an ambiguous
	  name shows a "did you mean?" list (\`--all\` lists every component).
	- \`token <name>\` — detail for a single token, same exact-vs-ambiguous behaviour (\`--all\` lists
	  every token).
	- \`icon <name>\` — detail for a single icon, including a copy-paste import line (\`--all\` lists
	  every icon).
	- \`lint-rules [term...]\` — ADS ESLint rules. A term matching one rule prints its docs; several
	  matches show a "did you mean?" list. Bare \`lint-rules\` prints every rule; \`--limit N\` caps the
	  candidate list.
	- \`docs <topic...>\` — read ADS reference docs. Three forms:
	    - \`docs <term...>\` — foundations guidelines (spacing, color, …).
	    - \`docs a11y [topic]\` — accessibility guidance; optional topic such as \`buttons\`,
	      \`forms\`, or \`colors\` (omit for the full bundle).
	    - \`docs migration <id>\` — a structured migration guide for a known package or API migration.
	- \`manifest\` — describe every command, argument, flag, and JSON response type. Use \`--json\`
	  for the machine-readable contract.

	### Global flags

	- \`--json\` — emit a machine-readable JSON envelope on stdout.
	- \`--help\`, \`-h\` — show help.
	- \`--version\`, \`-v\` — show the CLI version.

	## Examples

	\`\`\`sh
	# Unified human-readable search — components, tokens, icons, and docs grouped together
	npx @atlaskit/ads-cli search contrast

		# Narrow to a single kind
		npx @atlaskit/ads-cli search space color --type token
		npx @atlaskit/ads-cli search contrast --type docs

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
	\`\`\`

	## Output contract

	- **Data is written to stdout only.** Logs, hints, and errors go to **stderr**, so \`--json\`
	  output stays clean for piping.
	- With \`--json\`, every success prints a success envelope and every failure prints an error
	  envelope. The \`type\` discriminator (\`ads-cli/<command>\` or \`ads-cli/error\`) lets consumers
	  branch without re-parsing:
	- The \`manifest --json\` payload is derived from the live command registry and lists every
	  command, positional argument, flag, example, and success response type.

	\`\`\`json
	{
	  "type": "ads-cli/search-components",
	  "command": "search",
	  "ok": true,
	  "data": [],
	  "meta": { "terms": ["avatar"], "limit": 5, "count": 2 }
	}
	\`\`\`

	## Exit codes

	- \`0\` — success.
	- \`1\` — unexpected runtime error.
	- \`2\` — usage error (invalid arguments or unknown command).
	- \`3\` — no matching results found.

	## Relationship to the ADS MCP server and skill

	This CLI, the \`@atlaskit/ads-mcp\` server, and the \`atlassian-design-system\` agent skill are all
	thin surfaces over the **same** ADS query logic and bundled component dataset. Adding or
	improving a tool in \`@atlaskit/ads-mcp\` is automatically reflected here.
`;

export default intro;
