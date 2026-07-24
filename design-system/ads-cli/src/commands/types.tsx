/**
 * Types for the ADS CLI command registry.
 *
 * Command dispatch, the top-level `--help` text, and the self-describing `manifest` command are
 * derived from the single set of {@link CommandDefinition}s, so the runnable and documented
 * surfaces cannot drift apart.
 */

/**
 * Parsed CLI input handed to a command's `resolve` function.
 */
export type CommandInput = {
	/**
	 * Positional arguments after the command name (e.g. the search terms).
	 */
	positionals: string[];
	/**
	 * Parsed `--flag` values (numbers, strings, booleans, or repeated string arrays).
	 */
	flags: Record<string, unknown>;
};

/**
 * A documented positional argument for a command, surfaced by `manifest`.
 */
export type CommandArgument = {
	name: string;
	type: 'string';
	description: string;
	required: boolean;
	variadic?: boolean;
	choices?: string[];
};

/**
 * A documented flag for a command, surfaced by `manifest` and `--help`.
 */
export type CommandFlag = {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'string[]';
	description: string;
	alias?: string;
	default?: string | number | boolean;
	choices?: string[];
};

/**
 * A single ADS MCP tool invocation. `importPath`/`handlerName` are used to dynamically import
 * the tool at run time, keeping this package a thin dispatcher over the shared exports.
 */
export type ToolCall = {
	/**
	 * A stable key identifying this call within a multi-tool command. For grouped commands
	 * (e.g. unified `search`) this becomes the key in the assembled data object, e.g.
	 * `components` / `tokens` / `icons` / `docs`. Ignored for single-tool commands.
	 */
	key: string;
	importPath: string;
	handlerName: string;
	args?: unknown;
};

/**
 * The successful result of resolving a command: one or more ADS MCP tool calls.
 *
 * Most commands resolve to a single call. Unified commands (e.g. `search` with no `--type`)
 * resolve to several calls whose unwrapped results are grouped by {@link ToolCall.key} into a
 * single data object. `grouped` controls that assembly:
 *   - `grouped: false` (default): single call — `data` is that call's unwrapped result.
 *   - `grouped: true`: `data` is `{ [key]: unwrappedResult }` across all calls.
 */
export type ResolvedCommand = {
	tools: ToolCall[];
	grouped?: boolean;
	meta?: Record<string, unknown>;
};

/**
 * A resolution that produces its data directly, without calling any ADS MCP tool.
 *
 * Used for friendly, exit-0 "landing" responses such as bare `docs` (which lists the available
 * doc namespaces instead of erroring). The `data` flows through the same render pipeline as a
 * tool result — `formatHuman` for human output, or the JSON envelope for `--json`.
 */
export type ResolvedStatic = {
	data: unknown;
	meta?: Record<string, unknown>;
};

/**
 * The result of resolving a command: a {@link ResolvedCommand} (one or more tool calls), a
 * {@link ResolvedStatic} (pre-computed data), or a usage error.
 */
export type ResolveResult = ResolvedCommand | ResolvedStatic | { error: string };

/**
 * The kind of *listable row* a command renders, used by the default (non-`--json`) formatter to
 * pick a compact per-row renderer. Search results include concise documentation matches, while
 * standalone docs, a11y, and lint-rules commands render their full content via
 * {@link CommandDefinition.formatHuman} or the generic fallback.
 */
export type RowKind = 'components' | 'tokens' | 'icons' | 'docs';

/**
 * A single CLI command definition.
 */
export type CommandDefinition = {
	/**
	 * The command name as typed on the CLI, e.g. `search`.
	 */
	name: string;
	/**
	 * The compact result kind for human output. When set, the default renderer prints one
	 * line per result; when omitted, the command uses the generic fallback (JSON for objects,
	 * verbatim for strings — e.g. guideline markdown). May depend on input, so it is a function
	 * of {@link CommandInput} (e.g. `search --type tokens` renders as tokens).
	 */
	resultKind?: (input: CommandInput) => RowKind | undefined;
	/**
	 * One-line summary for `manifest` and `--help`.
	 */
	description: string;
	/**
	 * Usage string, e.g. `search <query...> [--type components|tokens|icons] [--limit N]`.
	 */
	usage: string;
	/**
	 * Structured positional argument metadata for agent discovery.
	 */
	arguments: CommandArgument[];
	/**
	 * Documented flags.
	 */
	flags: CommandFlag[];
	/**
	 * Example invocations.
	 */
	examples: string[];
	/**
	 * Full success-envelope `type` discriminators this command can emit with `--json`.
	 */
	responseTypes: string[];
	/**
	 * The envelope `type` suffix used for this command's JSON output, e.g. `search-components`
	 * produces `type: "ads-cli/search-components"`. May depend on input (e.g. `search --type
	 * tokens` reports `search-tokens`).
	 */
	envelopeType: (input: CommandInput) => string;
	/**
	 * Optional human-readable renderer for this command's (non-grouped) result.
	 *
	 * Commands whose tool returns a single rich object — rather than an array of rows that
	 * {@link resultKind} can render — supply this to produce readable text (e.g. a component
	 * doc, an a11y guide, or lint-rule markdown) instead of falling back to a raw JSON dump.
	 * Returning `null` defers to the generic fallback. Never used for `--json` output.
	 */
	formatHuman?: (data: unknown) => string | null;
	/**
	 * Optional post-processor applied to a single-tool command's unwrapped result before
	 * rendering (both human and `--json`). Used by the item commands (`component`/`token`/`icon`)
	 * to turn a ranked candidate list into an exact-match detail or a disambiguation list —
	 * without re-ranking (it only *selects* an exact name match from the tool's own results, so
	 * the zero-drift contract with `@atlaskit/ads-mcp` holds). Not applied to grouped, static,
	 * or error results.
	 */
	transform?: ({ data, input }: { data: unknown; input: CommandInput }) => unknown;
	/**
	 * Resolve which ADS MCP tool to run and with what arguments. Returning `{ error }` means
	 * the input was invalid (a usage error); the CLI surfaces the message.
	 */
	resolve: (input: CommandInput) => ResolveResult;
};
