/**
 * The command definitions — the single source of truth for the ADS CLI surface.
 *
 * Command dispatch, top-level `--help`, and the self-describing manifest are derived
 * from this one array, so there is no way for the runnable surface and the documented surface
 * to drift apart. Each entry declares:
 *
 *  - which `@atlaskit/ads-mcp/tools/*` subpath to import and which handler it exports,
 *  - how to turn parsed CLI input (positional terms + flags) into the tool's args object,
 *  - the metadata (arguments, flags, response types, and examples) surfaced by `manifest` and
 *    `--help`.
 *
 * The CLI is deliberately a thin layer: it never reimplements search ranking or bundles a
 * copy of the dataset. All heavy lifting stays in `@atlaskit/ads-mcp`.
 */

import { accessibilityGuidelines } from '@atlaskit/ads-mcp/a11y-guidelines';
import { migrationRegistry } from '@atlaskit/ads-mcp/migration-registry';

import { isDisambiguation } from '../output/disambiguation';
import { formatComponent } from '../output/format-component';
import { formatDisambiguation } from '../output/format-disambiguation';
import { formatDocObject } from '../output/format-doc-object';
import { formatIcon } from '../output/format-icon';
import { formatLintRules } from '../output/format-lint-rules';
import { formatManifest } from '../output/format-manifest';
import { formatToken } from '../output/format-token';
import { type LintRule, parseLintRuleRecords } from '../output/parse-lint-rule-records';

import { buildManifest } from './build-manifest';
import { getVersion } from './get-version';
import type { CommandDefinition, CommandFlag, CommandInput, ResolveResult } from './types';

/**
 * Shared `--limit` flag definition reused across the search-style commands.
 */
const limitFlag: CommandFlag = {
	name: 'limit',
	type: 'number',
	alias: 'l',
	description: 'Maximum matches per term.',
};

/**
 * Parse and validate the `--limit` flag.
 *
 * Returns the numeric limit, `undefined` when the flag was not supplied, or `null` when it
 * was supplied but is not a positive integer (a usage error).
 */
const parseLimit = (flags: Record<string, unknown>): number | null | undefined => {
	const raw = flags.limit;
	if (raw === undefined) {
		return undefined;
	}
	const parsed = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
	if (!Number.isInteger(parsed) || parsed < 1) {
		return null;
	}
	return parsed;
};

/**
 * Map of the three `search --type` variants to their ADS MCP tool exports.
 */
const searchKindTools = {
	components: {
		importPath: '@atlaskit/ads-mcp/tools/search-components',
		handlerName: 'searchComponentsTool',
		envelopeType: 'search-components',
	},
	tokens: {
		importPath: '@atlaskit/ads-mcp/tools/search-tokens',
		handlerName: 'searchTokensTool',
		envelopeType: 'search-tokens',
	},
	icons: {
		importPath: '@atlaskit/ads-mcp/tools/search-icons',
		handlerName: 'searchIconsTool',
		envelopeType: 'search-icons',
	},
} as const;

type SearchKind = keyof typeof searchKindTools;

/**
 * Accepted `--type` values (singular, matching the item command names) → the internal (plural)
 * {@link SearchKind}. Everything downstream keys off the plural `SearchKind` (envelope types,
 * grouped JSON keys), so the singular input normalises to it here.
 */
const SEARCH_TYPE_VALUES = {
	component: 'components',
	token: 'tokens',
	icon: 'icons',
} as const satisfies Record<string, SearchKind>;

type SearchTypeValue = keyof typeof SEARCH_TYPE_VALUES;

const isSearchTypeValue = (value: string): value is SearchTypeValue => value in SEARCH_TYPE_VALUES;

/**
 * Resolve the `--type` narrowing for a `search` invocation.
 *
 * Returns the {@link SearchKind} when `--type` is a valid kind, `undefined` when `--type` was
 * omitted (caller should run a unified search), or `null` when `--type` is present but invalid.
 */
const resolveSearchType = (flags: Record<string, unknown>): SearchKind | null | undefined => {
	if (flags.type === undefined) {
		return undefined;
	}
	const value = String(flags.type).toLowerCase();
	return isSearchTypeValue(value) ? SEARCH_TYPE_VALUES[value] : null;
};

/**
 * Map of the three `list <kind>` variants to their ADS MCP tool exports.
 */
const listKindTools = {
	components: {
		importPath: '@atlaskit/ads-mcp/tools/get-all-components',
		handlerName: 'getAllComponentsTool',
		envelopeType: 'list-components',
	},
	tokens: {
		importPath: '@atlaskit/ads-mcp/tools/get-all-tokens',
		handlerName: 'getAllTokensTool',
		envelopeType: 'list-tokens',
	},
	icons: {
		importPath: '@atlaskit/ads-mcp/tools/get-all-icons',
		handlerName: 'getAllIconsTool',
		envelopeType: 'list-icons',
	},
} as const;

/**
 * Valid ADS accessibility guideline topics accepted by `get-a11y-guidelines`.
 *
 * Derived at runtime from `@atlaskit/ads-mcp`'s `accessibilityGuidelines` object — the same
 * source of truth the tool itself uses (`Object.keys(accessibilityGuidelines)`). Deriving rather
 * than hardcoding keeps the CLI's validation and `--help` enumeration zero-drift: adding or
 * removing a topic in `@atlaskit/ads-mcp` is picked up automatically. Omitting the topic asks the
 * tool for its index response (the list of available topics), rather than a single topic's detail.
 */
const A11Y_TOPICS = Object.keys(
	accessibilityGuidelines,
) as (keyof typeof accessibilityGuidelines)[];

/**
 * Valid migration guide ids accepted by `migration-guides`.
 *
 * Derived at runtime from `@atlaskit/ads-mcp`'s migration registry (keys are the ids each
 * migration declares), so newly-registered guides are exposed by the CLI automatically with no
 * manual sync. The underlying tool only reads the `migration` id (it ignores the schema's paired
 * `description`), so the CLI can pass an empty description and let the user supply just the id.
 */
const MIGRATION_IDS = Object.keys(migrationRegistry) as (keyof typeof migrationRegistry)[];

/**
 * Build the invalid-limit usage error message.
 */
const invalidLimitError = (flags: Record<string, unknown>): { error: string } => ({
	error: `Invalid --limit value "${String(flags.limit)}". Must be a positive integer.`,
});

/**
 * Convenience builder for a command that resolves to exactly one tool call.
 */
const singleTool = ({
	importPath,
	handlerName,
	args,
	meta,
}: {
	importPath: string;
	handlerName: string;
	args?: unknown;
	meta?: Record<string, unknown>;
}): ResolveResult => ({
	tools: [{ key: 'result', importPath, handlerName, args }],
	meta,
});

/**
 * Shared resolver for the narrowed single-type search (`search --type X`) that takes positional
 * terms + `--limit`.
 */
const resolveSearch = ({
	input,
	tool,
}: {
	input: CommandInput;
	tool: { importPath: string; handlerName: string };
}): ResolveResult => {
	const terms = input.positionals;
	if (terms.length === 0) {
		return { error: 'At least one search term is required.' };
	}

	const limit = parseLimit(input.flags);
	if (limit === null) {
		return invalidLimitError(input.flags);
	}

	const args = { terms, ...(limit === undefined ? {} : { limit }) };
	return singleTool({
		importPath: tool.importPath,
		handlerName: tool.handlerName,
		args,
		meta: args,
	});
};

/**
 * The `--all` flag shared by the item commands (`component`, `token`, `icon`), which lists every
 * entry of that kind instead of requiring a name.
 */
const allFlag: CommandFlag = {
	name: 'all',
	type: 'boolean',
	default: false,
	description: 'List every entry of this kind instead of looking up a single name.',
};

/**
 * Per-kind accessors describing how to read the display name and a secondary hint off a raw
 * item record, and how many candidates to fetch when disambiguating.
 *
 * Components/tokens key their name off `name`; icons key theirs off `componentName`.
 */
const itemFields = {
	components: {
		nameOf: (item: Record<string, unknown>) => String(item.name ?? ''),
		hintOf: (item: Record<string, unknown>) => (item.package ? String(item.package) : undefined),
	},
	tokens: {
		nameOf: (item: Record<string, unknown>) => String(item.name ?? ''),
		hintOf: (item: Record<string, unknown>) =>
			item.exampleValue ? `= ${String(item.exampleValue)}` : undefined,
	},
	icons: {
		nameOf: (item: Record<string, unknown>) => String(item.componentName ?? ''),
		hintOf: (item: Record<string, unknown>) => (item.package ? String(item.package) : undefined),
	},
} as const;

/**
 * Number of candidates fetched for an item lookup. One is not enough to detect ambiguity or to
 * prefer an exact name match over a higher-ranked fuzzy hit; a small window is plenty.
 */
const ITEM_LOOKUP_LIMIT = 8;

/**
 * Trim a rule description down to a single-line hint for the disambiguation list. Rule
 * descriptions can be a full sentence; a long hint would wrap and make the list hard to scan.
 */
const truncateHint = (text: string | undefined, max = 72): string | undefined => {
	if (!text) {
		return undefined;
	}
	const oneLine = text.replace(/\s+/g, ' ').trim();
	return oneLine.length > max ? `${oneLine.slice(0, max - 1).trimEnd()}…` : oneLine;
};

/**
 * A representative example name per kind, used in each item command's `--help` examples.
 */
const EXAMPLE_NAME: Record<SearchKind, string> = {
	components: 'Button',
	tokens: 'space.100',
	icons: 'AddIcon',
};

/**
 * Build one of the singular item commands (`component <name>`, `token <name>`, `icon <name>`).
 *
 * All three share the same shape, so they are generated from a single factory to avoid drift:
 *   - `<name>`  → detail view. We fetch a small candidate window (not just the top hit) and then
 *                 (a) render the item whose name matches exactly (case-insensitively), else
 *                 (b) if exactly one candidate, render it, else
 *                 (c) show a "did you mean?" disambiguation list rather than silently guessing.
 *   - `--all`   → list every entry of the kind (via the kind's `get-all-*` tool).
 *   - no args   → a friendly usage error (mirrors bare `docs a11y`/`docs migration` guidance).
 *
 * The exact-match step only *selects* from the tool's own ranked results — it never re-ranks —
 * so the zero-drift contract with `@atlaskit/ads-mcp` is preserved.
 */
const makeItemCommand = ({
	kind,
	name,
	formatHuman,
}: {
	kind: SearchKind;
	name: string;
	formatHuman: (data: unknown) => string | null;
}): CommandDefinition => {
	const searchTool = searchKindTools[kind];
	const listTool = listKindTools[kind];
	const { nameOf, hintOf } = itemFields[kind];

	return {
		name,
		description: `Get details for a single ADS ${name}, or list all with --all.`,
		usage: `${name} <name> | ${name} --all`,
		arguments: [
			{
				name: 'name',
				type: 'string',
				required: false,
				description: `Exact or fuzzy ADS ${name} name. Omit when using --all.`,
			},
		],
		flags: [allFlag],
		examples: [`${name} ${EXAMPLE_NAME[kind]}`, `${name} --all`],
		responseTypes: [`ads-cli/${name}`, `ads-cli/${listTool.envelopeType}`],
		// `--all` returns an array → render it as the compact per-row list for this kind. A single
		// `<name>` lookup is post-processed by `transform` into either one detail object or a
		// disambiguation marker, both handled by `formatHuman`.
		resultKind: (input) => (input.flags.all ? kind : undefined),
		envelopeType: (input) => (input.flags.all ? listTool.envelopeType : name),
		formatHuman: (data) => {
			// Ambiguous lookup → render the "did you mean?" list; otherwise the item detail view.
			if (isDisambiguation(data)) {
				return formatDisambiguation(data);
			}
			return formatHuman(data);
		},
		// Turn the ranked candidate window into an exact match, a lone match, or a disambiguation
		// marker. Skipped for `--all` (that path returns the full array untouched).
		transform: ({ data, input }) => {
			if (input.flags.all) {
				return data;
			}
			const query = input.positionals[0] ?? '';
			const candidates = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];

			// Prefer an exact, case-insensitive name match from the tool's own results.
			const exact = candidates.find((item) => nameOf(item).toLowerCase() === query.toLowerCase());
			if (exact) {
				return exact;
			}
			// A single candidate is unambiguous — show it.
			if (candidates.length === 1) {
				return candidates[0];
			}
			// Otherwise do not guess: surface a disambiguation list.
			return {
				ambiguous: true as const,
				query,
				noun: name,
				candidates: candidates.map((item) => {
					const itemName = nameOf(item);
					return { name: itemName, hint: hintOf(item), followUp: `${name} ${itemName}` };
				}),
			};
		},
		resolve: (input) => {
			// `--all` → list every entry of the kind (the get-all-* tools take no arguments).
			if (input.flags.all) {
				return singleTool({
					importPath: listTool.importPath,
					handlerName: listTool.handlerName,
					meta: { all: true },
				});
			}

			const name_ = input.positionals[0];
			if (!name_) {
				return {
					error: `A ${name} name is required. Try \`${name} <name>\` or \`${name} --all\`.`,
				};
			}

			// Fetch a small candidate window (not just the top hit) so `transform` can prefer an
			// exact name match and detect ambiguity. We never re-rank — only select.
			return singleTool({
				importPath: searchTool.importPath,
				handlerName: searchTool.handlerName,
				args: { terms: [name_], limit: ITEM_LOOKUP_LIMIT },
				meta: { name: name_ },
			});
		},
	};
};

/**
 * Resolver for the unified `search` (no `--type`): fan out to all three search tools in one
 * command. The results are grouped by kind (components/tokens/icons) rather than merged into a
 * single ranked list — each tool ranks its own domain, and re-ranking across domains would
 * mean duplicating ranking logic here (breaking the zero-drift contract with `@atlaskit/ads-mcp`).
 */
const resolveUnifiedSearch = (input: CommandInput): ResolveResult => {
	const terms = input.positionals;
	if (terms.length === 0) {
		return { error: 'At least one search term is required.' };
	}

	const limit = parseLimit(input.flags);
	if (limit === null) {
		return invalidLimitError(input.flags);
	}

	const args = { terms, ...(limit === undefined ? {} : { limit }) };
	return {
		grouped: true,
		tools: [
			{ key: 'components', ...searchKindTools.components, args },
			{ key: 'tokens', ...searchKindTools.tokens, args },
			{ key: 'icons', ...searchKindTools.icons, args },
		],
		meta: args,
	};
};

/**
 * The full set of CLI commands. Order here is the order shown by `manifest` and `--help`.
 */
export const commands: CommandDefinition[] = [
	{
		name: 'search',
		description: 'Fuzzy-search ADS components, tokens, and icons together (or narrow with --type).',
		usage: `search <query...> [--type ${Object.keys(SEARCH_TYPE_VALUES).join('|')}] [--limit N]`,
		arguments: [
			{
				name: 'query',
				type: 'string',
				required: true,
				variadic: true,
				description: 'One or more terms to search for.',
			},
		],
		flags: [
			{
				name: 'type',
				type: 'string',
				alias: 't',
				choices: Object.keys(SEARCH_TYPE_VALUES),
				description: `Narrow the search to a single kind: ${Object.keys(SEARCH_TYPE_VALUES).join(', ')}.`,
			},
			limitFlag,
		],
		examples: [
			'search button',
			'search space color --type token',
			'search add --type icon --limit 5',
		],
		responseTypes: [
			'ads-cli/search',
			...Object.values(searchKindTools).map((tool) => `ads-cli/${tool.envelopeType}`),
		],
		// With `--type`, the result is a single kind (compact per-row rendering). Without it, the
		// result is grouped across all kinds, so there is no single result kind — the grouped
		// formatter handles rendering instead.
		resultKind: (input) => resolveSearchType(input.flags) ?? undefined,
		envelopeType: (input) => {
			const searchType = resolveSearchType(input.flags);
			return searchType ? searchKindTools[searchType].envelopeType : 'search';
		},
		resolve: (input) => {
			// No `--type`: unified search across all three kinds.
			if (input.flags.type === undefined) {
				return resolveUnifiedSearch(input);
			}
			// `--type X`: narrow to a single kind. `undefined` is unreachable here (handled by the
			// bare-`type` guard above), but folding it in with `null` narrows `searchType` to a
			// concrete `SearchKind` so it can index `searchKindTools`.
			const searchType = resolveSearchType(input.flags);
			if (searchType === null || searchType === undefined) {
				return {
					error: `Invalid --type value "${String(input.flags.type)}". Must be one of: ${Object.keys(SEARCH_TYPE_VALUES).join(', ')}.`,
				};
			}
			return resolveSearch({ input, tool: searchKindTools[searchType] });
		},
	},
	makeItemCommand({
		kind: 'components',
		name: 'component',
		formatHuman: formatComponent,
	}),
	makeItemCommand({
		kind: 'tokens',
		name: 'token',
		formatHuman: formatToken,
	}),
	makeItemCommand({
		kind: 'icons',
		name: 'icon',
		formatHuman: formatIcon,
	}),
	{
		name: 'lint-rules',
		description: 'Get ADS ESLint lint rules, optionally filtered by term.',
		usage: 'lint-rules [term...] [--limit N]',
		arguments: [
			{
				name: 'term',
				type: 'string',
				required: false,
				variadic: true,
				description: 'Terms used to filter lint rules.',
			},
		],
		flags: [limitFlag],
		examples: ['lint-rules', 'lint-rules unsafe', 'lint-rules no-unsafe-style-overrides'],
		responseTypes: ['ads-cli/lint-rules'],
		envelopeType: () => 'lint-rules',
		// Ambiguous fuzzy lookup → render the "did you mean?" list; otherwise print each rule's
		// Markdown `content` verbatim rather than JSON.
		formatHuman: (data) =>
			isDisambiguation(data) ? formatDisambiguation(data) : formatLintRules(data),
		// Mirror the item commands: a fuzzy term that matches one rule exactly (or a lone match)
		// shows that rule's docs, but several matches with no exact name surface a disambiguation
		// list instead of dumping every rule's full Markdown. Skipped for bare `lint-rules` (which
		// intentionally returns every rule's content).
		transform: ({ data, input }) => {
			const terms = input.positionals;
			if (terms.length === 0) {
				return data;
			}

			// Only rule records with a name can be disambiguated.
			const candidates = parseLintRuleRecords(data).filter(
				(rule): rule is LintRule =>
					rule !== null && typeof rule === 'object' && typeof rule.ruleName === 'string',
			);
			// Not interpretable as named rule records → defer to the normal renderer / fallback.
			if (candidates.length === 0) {
				return data;
			}

			const query = terms.join(' ');
			const nameOf = (rule: LintRule) => rule.ruleName ?? '';

			// Prefer an exact, case-insensitive rule-name match from the tool's own results.
			const exact = candidates.find((rule) => nameOf(rule).toLowerCase() === query.toLowerCase());
			if (exact) {
				return exact;
			}
			// A single candidate is unambiguous — show it.
			if (candidates.length === 1) {
				return candidates[0];
			}
			// Otherwise do not guess: surface a disambiguation list.
			return {
				ambiguous: true as const,
				query,
				noun: 'lint-rule',
				candidates: candidates.map((rule) => {
					const name = nameOf(rule);
					return { name, hint: truncateHint(rule.description), followUp: `lint-rules ${name}` };
				}),
			};
		},
		resolve: (input) => {
			const terms = input.positionals;
			const limit = parseLimit(input.flags);
			if (limit === null) {
				return invalidLimitError(input.flags);
			}
			// For a fuzzy term lookup, fetch a candidate window (not just the top hit) so `transform`
			// can prefer an exact rule-name match and detect ambiguity. An explicit `--limit` overrides
			// the window (and caps the "did you mean?" list). Bare `lint-rules` passes only what the
			// user supplied.
			const fetchLimit = terms.length > 0 ? (limit ?? ITEM_LOOKUP_LIMIT) : limit;
			return singleTool({
				importPath: '@atlaskit/ads-mcp/tools/get-lint-rules',
				handlerName: 'getLintRulesTool',
				args: {
					terms,
					...(fetchLimit === undefined ? {} : { limit: fetchLimit }),
				},
				// `meta` reports what the user asked for (their explicit `--limit`, if any), not the
				// internal candidate window.
				meta: { terms, ...(limit === undefined ? {} : { limit }) },
			});
		},
	},
	{
		name: 'docs',
		description: 'Read ADS reference docs: foundations, accessibility (a11y), or migrations.',
		usage: `docs <topic...>  |  docs a11y [${A11Y_TOPICS.join('|')}]  |  docs migration <${MIGRATION_IDS.join('|')}>`,
		arguments: [
			{
				name: 'topic',
				type: 'string',
				required: false,
				variadic: true,
				description:
					'Foundation terms, an accessibility topic after a11y, or a migration id after migration.',
			},
		],
		// No `--limit`: every `docs` variant returns a single document (a foundation doc, an a11y
		// guide, or a migration guide), so there is nothing to limit.
		flags: [],
		examples: ['docs spacing', 'docs color contrast', 'docs a11y buttons', 'docs migration motion'],
		responseTypes: ['ads-cli/docs-guidelines', 'ads-cli/docs-a11y', 'ads-cli/docs-migration'],
		envelopeType: (input) => {
			const namespace = input.positionals[0];
			if (namespace === 'a11y') {
				return 'docs-a11y';
			}
			if (namespace === 'migration') {
				return 'docs-migration';
			}
			return 'docs-guidelines';
		},
		// `docs a11y` / `docs migration` return a structured object → render it as readable text.
		// `docs <term>` returns a Markdown string, which `formatDocObject` declines (returns null),
		// so the generic verbatim-string fallback prints it unchanged.
		formatHuman: formatDocObject,
		resolve: (input) => {
			const [namespace, ...rest] = input.positionals;

			// `docs a11y [topic]` → accessibility guidance. The topic is optional; omitting it asks the
			// tool for its index response, which lists the available topics for the user to pick from.
			if (namespace === 'a11y') {
				const topic = rest[0];
				if (topic !== undefined && !(A11Y_TOPICS as readonly string[]).includes(topic)) {
					return {
						error: `Unknown a11y topic "${topic}". Must be one of: ${A11Y_TOPICS.join(', ')}.`,
					};
				}
				return singleTool({
					importPath: '@atlaskit/ads-mcp/tools/get-a11y-guidelines',
					handlerName: 'getA11yGuidelinesTool',
					args: topic === undefined ? {} : { topic },
					meta: topic === undefined ? { namespace } : { namespace, topic },
				});
			}

			// `docs migration <id>` → a structured migration guide.
			if (namespace === 'migration') {
				const migration = rest[0];
				// Bare `docs migration` (no id): return a friendly, exit-0 index of the available
				// ids rather than erroring — consistent with bare `docs a11y` and bare `docs`.
				if (!migration) {
					return {
						data: {
							message: 'Specify a migration id to get the guide:',
							availableIds: MIGRATION_IDS,
						},
						meta: { namespace, index: true },
					};
				}
				if (!(MIGRATION_IDS as readonly string[]).includes(migration)) {
					return {
						error: `Unknown migration id "${migration}". Must be one of: ${MIGRATION_IDS.join(', ')}.`,
					};
				}
				// The underlying tool reads only `migration`; its schema also declares a paired
				// `description` which the handler ignores, so we pass an empty string.
				return singleTool({
					importPath: '@atlaskit/ads-mcp/tools/migration-guides',
					handlerName: 'migrationGuidesTool',
					args: { migration, description: '' },
					meta: { namespace, migration },
				});
			}

			// Bare `docs` (no args): return a friendly, exit-0 index of the available doc
			// namespaces instead of erroring — mirroring how `docs a11y` (no topic) lists its
			// topics. The shape is a doc object (`message` header + labelled lists) so it renders
			// via `formatDocObject` for humans and as a structured envelope under `--json`.
			const terms = input.positionals;
			if (terms.length === 0) {
				return {
					data: {
						message: 'Read ADS reference docs. Choose a topic:',
						foundations:
							'docs <topic...> — e.g. `docs spacing`, `docs color contrast` (any atlassian.design foundation)',
						accessibility: `docs a11y [topic] — topics: ${A11Y_TOPICS.join(', ')}`,
						migrations: `docs migration <id> — ids: ${MIGRATION_IDS.join(', ')}`,
					},
					meta: { namespace: 'index' },
				};
			}
			const args = { terms };
			return singleTool({
				importPath: '@atlaskit/ads-mcp/tools/get-guidelines',
				handlerName: 'getGuidelinesTool',
				args,
				meta: args,
			});
		},
	},
	{
		name: 'manifest',
		description: 'Describe every CLI command, argument, flag, and JSON response type.',
		usage: 'manifest',
		arguments: [],
		flags: [],
		examples: ['manifest --json'],
		responseTypes: ['ads-cli/manifest'],
		envelopeType: () => 'manifest',
		formatHuman: formatManifest,
		resolve: () => ({
			data: buildManifest(commands, getVersion()),
			meta: { schemaVersion: 1 },
		}),
	},
];
