/**
 * The ADS CLI entrypoint.
 *
 * `run(argv)` parses arguments, resolves the requested command from the shared
 * {@link commands} registry, dispatches to the underlying `@atlaskit/ads-mcp/tools/*`
 * handler, and formats the result (human-readable by default, JSON with `--json`).
 *
 * It never reimplements search ranking or bundles a dataset copy — all query logic lives in
 * `@atlaskit/ads-mcp`, so the MCP server, the ADS skill, and this CLI stay in lock-step.
 */

import { CLI_DESCRIPTION, globalFlags } from './commands/cli-metadata';
import { commands } from './commands/definitions';
import { getCommand } from './commands/get-command';
import { getVersion } from './commands/get-version';
import { importToolHandler } from './commands/import-tool-handler';
import { runTool } from './commands/run-tool';
import type { CommandDefinition, CommandInput } from './commands/types';
import { createErrorEnvelope } from './envelope/create-error-envelope';
import { createSuccessEnvelope } from './envelope/create-success-envelope';
import { formatGroupedResults } from './output/format-grouped-results';
import { formatCompactResults } from './output/format-results';
import { writeHumanError } from './output/write-human-error';
import { writeHumanResult } from './output/write-human-result';
import { writeJsonEnvelope } from './output/write-json-envelope';
import { defaultWriter, type Writer } from './output/writer';
import { parseArgs } from './parse-args';
import { ExitCode, type ExitCodeValue } from './types';

/**
 * Build the top-level help text from the command registry so it can never drift from the
 * runnable surface.
 */
const buildHelpText = (): string => {
	// Width of the usage "gutter"; descriptions align to this column. Usages longer than the
	// gutter wrap onto their own line with the description indented beneath, so a long usage
	// (e.g. `docs`, which lists every topic) never produces a single 130-column line.
	const gutter = 56;
	const commandLines = commands
		.map((command) => {
			if (command.usage.length <= gutter) {
				return `  ${command.usage.padEnd(gutter)} ${command.description}`;
			}
			// Long usage: print it on its own line(s), then the description indented beneath so the
			// two stay visually associated instead of the description drifting far to the right.
			const usageLines = command.usage
				.split('  |  ')
				.map((part, index) => (index === 0 ? `  ${part}` : `      | ${part}`))
				.join('\n');
			return `${usageLines}\n      ${command.description}`;
		})
		.join('\n');
	const globalFlagLines = globalFlags
		.map((flag) => {
			const aliases = flag.alias ? `, -${flag.alias}` : '';
			return `  --${flag.name}${aliases}`.padEnd(18) + flag.description;
		})
		.join('\n');

	return [
		CLI_DESCRIPTION,
		'',
		'Usage',
		'  $ npx @atlaskit/ads-cli <command> [options]',
		'',
		'Commands',
		commandLines,
		'',
		'Global options',
		globalFlagLines,
		'',
		'Examples',
		'  $ npx @atlaskit/ads-cli search button          # unified: components, tokens & icons',
		'  $ npx @atlaskit/ads-cli search button --type component',
		'  $ npx @atlaskit/ads-cli component Button        # detail for one component',
		'  $ npx @atlaskit/ads-cli token space.100         # detail for one token',
		'  $ npx @atlaskit/ads-cli icon --all              # list every icon',
		'  $ npx @atlaskit/ads-cli docs spacing           # foundations docs',
		'  $ npx @atlaskit/ads-cli docs a11y buttons      # accessibility guidance',
		'  $ npx @atlaskit/ads-cli docs migration motion  # migration guide',
		'  $ npx @atlaskit/ads-cli manifest --json        # machine-readable CLI contract',
	].join('\n');
};

/**
 * Execute a registry-backed command: resolve its tool + args, dispatch, and format output.
 */
const runRegistryCommand = async ({
	command,
	input,
	json,
	writer,
}: {
	command: CommandDefinition;
	input: CommandInput;
	json: boolean;
	writer: Writer;
}): Promise<ExitCodeValue> => {
	const resolved = command.resolve(input);

	// A resolver returning `{ error }` indicates invalid input (a usage error).
	if ('error' in resolved) {
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({
					command: command.name,
					code: 'USAGE_ERROR',
					message: resolved.error,
				}),
				writer,
			});
		} else {
			writeHumanError({ message: resolved.error, writer });
			writer.err(`Usage: ${command.usage}`);
		}
		return ExitCode.UsageError;
	}

	// A resolver returning pre-computed `data` (no tool calls) is a friendly, exit-0 static
	// response — e.g. bare `docs` listing the available namespaces. Route it through the same
	// single-result renderer so it honours `formatHuman` and `--json` identically.
	if ('data' in resolved) {
		return renderSingleResult({
			command,
			input,
			result: { data: resolved.data, isError: false },
			meta: resolved.meta ?? {},
			json,
			writer,
		});
	}

	// Run every tool call the command resolved to. Single-tool commands have one; unified
	// commands (e.g. `search` with no `--type`) have several that run in parallel.
	const results = await Promise.all(
		resolved.tools.map(async (tool) => {
			const handler = await importToolHandler({
				importPath: tool.importPath,
				handlerName: tool.handlerName,
			});
			return { key: tool.key, ...(await runTool({ handler, args: tool.args })) };
		}),
	);

	if (resolved.grouped) {
		return renderGroupedResult({
			command,
			input,
			results,
			meta: resolved.meta ?? {},
			json,
			writer,
		});
	}

	return renderSingleResult({
		command,
		input,
		result: results[0],
		meta: resolved.meta ?? {},
		json,
		writer,
	});
};

/**
 * Render a single-tool command result (the common case).
 */
const renderSingleResult = ({
	command,
	input,
	result,
	meta,
	json,
	writer,
}: {
	command: CommandDefinition;
	input: CommandInput;
	result: { data: unknown; isError: boolean };
	meta: Record<string, unknown>;
	json: boolean;
	writer: Writer;
}): ExitCodeValue => {
	const { isError } = result;

	// The ADS search tools return an `Error: No … found` text block when nothing matches.
	if (isError) {
		const message =
			typeof result.data === 'string' ? result.data.replace(/^Error:\s*/, '') : 'No results found.';
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({ command: command.name, code: 'NOT_FOUND', message }),
				writer,
			});
		} else {
			writeHumanError({ message, writer });
		}
		return ExitCode.NotFound;
	}

	// Some tools signal "no match" by returning an empty (or whitespace-only) string rather than
	// an `Error:` block — e.g. `docs <term>` for an unknown foundation. Treat that as NOT_FOUND so
	// the user gets a clear miss instead of a silent, empty, exit-0 response.
	if (typeof result.data === 'string' && result.data.trim() === '') {
		const message = `No results found${
			input.positionals.length > 0 ? ` for "${input.positionals.join(' ')}"` : ''
		}.`;
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({ command: command.name, code: 'NOT_FOUND', message }),
				writer,
			});
		} else {
			writeHumanError({ message, writer });
		}
		return ExitCode.NotFound;
	}

	// Optional post-processing (e.g. exact-match vs disambiguation for item commands). Applied
	// before both JSON and human rendering so the envelope and the terminal view stay in sync.
	const data = command.transform ? command.transform({ data: result.data, input }) : result.data;

	if (json) {
		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: command.envelopeType(input),
				command: command.name,
				data,
				meta,
			}),
			writer,
		});
		return ExitCode.Ok;
	}

	// Default (human) output, tried in order:
	//   1. Compact per-row view when the command declares a result kind (search/list).
	//   2. The command's own `formatHuman` renderer for rich single-object payloads
	//      (component docs, a11y/migration guides, lint-rule markdown).
	//   3. The generic fallback: verbatim strings (e.g. foundations markdown) or pretty JSON.
	// Each step returns `null` to defer to the next, so a raw JSON dump is only ever a last resort.
	const resultKind = command.resultKind?.(input);
	const compact = resultKind ? formatCompactResults({ kind: resultKind, data }) : null;
	const human = compact ?? command.formatHuman?.(data) ?? null;

	if (human !== null) {
		writer.out(human);
	} else {
		writeHumanResult({ data, writer });
	}

	return ExitCode.Ok;
};

/**
 * Render a grouped (multi-tool) command result, e.g. unified `search`.
 *
 * Each sub-result is keyed by its {@link ToolCall.key}. A sub-search that finds nothing simply
 * contributes an empty array; the command is only treated as NOT_FOUND when every group is empty.
 */
const renderGroupedResult = ({
	command,
	input,
	results,
	meta,
	json,
	writer,
}: {
	command: CommandDefinition;
	input: CommandInput;
	results: Array<{ key: string; data: unknown; isError: boolean }>;
	meta: Record<string, unknown>;
	json: boolean;
	writer: Writer;
}): ExitCodeValue => {
	// Assemble `{ [key]: results }`, coercing "no matches" sub-results to empty arrays so one
	// empty domain does not blank out the others.
	const grouped: Record<string, unknown[]> = {};
	for (const { key, data, isError } of results) {
		grouped[key] = isError || !Array.isArray(data) ? [] : data;
	}

	const totalCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

	if (totalCount === 0) {
		const message = 'No components, tokens, or icons found.';
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({ command: command.name, code: 'NOT_FOUND', message }),
				writer,
			});
		} else {
			writeHumanError({ message, writer });
		}
		return ExitCode.NotFound;
	}

	if (json) {
		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: command.envelopeType(input),
				command: command.name,
				// `data` for grouped commands is `{ components, tokens, icons }` (already counted
				// per group), so `count` is the combined total across groups.
				data: grouped,
				meta: { ...meta, count: totalCount },
			}),
			writer,
		});
		return ExitCode.Ok;
	}

	writer.out(formatGroupedResults({ groups: grouped, totalCount }));
	return ExitCode.Ok;
};

/**
 * Parse and execute a single CLI invocation.
 *
 * @param argv - Arguments after `node <script>` (i.e. `process.argv.slice(2)`).
 * @param writer - Injectable output sink; defaults to console-backed stdout/stderr.
 * @returns The process exit code. The bin wrapper maps this onto `process.exit`.
 */
export const run = async (
	argv: string[] = process.argv.slice(2),
	writer: Writer = defaultWriter,
): Promise<ExitCodeValue> => {
	const { command, positionals, flags } = parseArgs(argv);
	const json = flags.json === true;

	// `--version` / `-v` takes precedence and short-circuits.
	if (flags.version === true) {
		writer.out(getVersion());
		return ExitCode.Ok;
	}

	// `--help` / `-h`, or no command at all, prints help. No command is a usage error so
	// scripts can detect a missing invocation via the exit code.
	if (flags.help === true || command === undefined) {
		writer.out(buildHelpText());
		return command === undefined && flags.help !== true ? ExitCode.UsageError : ExitCode.Ok;
	}

	const definition = getCommand(command);
	if (!definition) {
		const message = `Unknown command "${command}".`;
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({ command, code: 'USAGE_ERROR', message }),
				writer,
			});
		} else {
			writeHumanError({ message, writer });
			writer.err('Run `ads-cli --help` to see available commands.');
		}
		return ExitCode.UsageError;
	}

	try {
		return await runRegistryCommand({
			command: definition,
			input: { positionals, flags },
			json,
			writer,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (json) {
			writeJsonEnvelope({
				envelope: createErrorEnvelope({
					command: definition.name,
					code: 'RUNTIME_ERROR',
					message,
				}),
				writer,
			});
		} else {
			writeHumanError({ message, writer });
		}
		return ExitCode.RuntimeError;
	}
};
