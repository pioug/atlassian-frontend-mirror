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

import { CLI_BIN_NAME, CLI_DESCRIPTION, globalFlags } from './commands/cli-metadata';
import { commands } from './commands/definitions';
import { getCommand } from './commands/get-command';
import { getVersion } from './commands/get-version';
import { importToolHandler } from './commands/import-tool-handler';
import { runInitCommand } from './commands/init';
import { runTool } from './commands/run-tool';
import type {
	BatchRequest,
	CommandDefinition,
	CommandInput,
	RenderContext,
} from './commands/types';
import { createErrorEnvelope } from './envelope/create-error-envelope';
import { createSuccessEnvelope } from './envelope/create-success-envelope';
import type { Envelope } from './envelope/types';
import { compactResults } from './output/compact-results';
import { createDocSearchResults } from './output/create-doc-search-results';
import { isDisambiguation } from './output/disambiguation';
import { formatGroupedResults } from './output/format-grouped-results';
import { formatHumanResult } from './output/format-human-result';
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
const buildHelpText = (invocation: string): string => {
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
	const examples: Array<{ command: string; comment?: string }> = [
		{ command: 'init', comment: 'set up repository-local frontend skills and the Atlas plugin' },
		{
			command: 'search contrast',
			comment: 'unified: components, tokens, icons & docs',
		},
		{
			command: 'batch --command search button --type icon --command token space.200',
			comment: 'canonical tokenized batch form',
		},
		{
			command: 'batch --command "search button" --type icon --command "token space.200"',
			comment: 'complete-string compatibility form',
		},
		{ command: 'search button --type component' },
		{ command: 'search contrast --type docs' },
		{ command: 'component Button', comment: 'detail for one component' },
		{ command: 'token space.100', comment: 'detail for one token' },
		{ command: 'icon --all', comment: 'list every icon' },
		{ command: 'docs spacing', comment: 'foundations docs' },
		{ command: 'docs a11y buttons', comment: 'accessibility guidance' },
		{ command: 'docs migration motion', comment: 'migration guide' },
		{ command: 'manifest --json', comment: 'machine-readable CLI contract' },
	];
	const exampleCommands = examples.map(({ command }) => `$ ${invocation} ${command}`);
	const exampleWidth = Math.max(...exampleCommands.map((command) => command.length));
	const exampleLines = examples
		.map(({ comment }, index) => {
			const command = exampleCommands[index];
			return `  ${comment ? `${command.padEnd(exampleWidth)}  # ${comment}` : command}`;
		})
		.join('\n');

	return [
		CLI_DESCRIPTION,
		'',
		'Usage',
		`  $ ${invocation} <command> [options]`,
		'',
		'Commands',
		commandLines,
		'',
		'Global options',
		globalFlagLines,
		'',
		'Examples',
		exampleLines,
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
	invocation,
}: {
	command: CommandDefinition;
	input: CommandInput;
	json: boolean;
	writer: Writer;
	invocation: string;
}): Promise<ExitCodeValue> => {
	if (command.action === 'init') {
		return runInitCommand({
			input,
			json,
			writer,
			invocation,
			cwd: process.cwd(),
		});
	}

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
			invocation,
		});
	}

	// Batch requests re-enter the same command registry in-process. Dynamic imports stay cached,
	// requests run concurrently, and each child retains its normal envelope semantics.
	if (resolved.batch) {
		return runBatchRequests({
			command,
			requests: resolved.batch,
			json,
			writer,
			invocation,
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
			invocation,
		});
	}

	return renderSingleResult({
		command,
		input,
		result: results[0],
		meta: resolved.meta ?? {},
		json,
		writer,
		invocation,
	});
};

/**
 * Render a command's already-transformed payload as human-readable text.
 *
 * Tried in order:
 *   1. Compact per-row view when the command declares a result kind (search/list).
 *   2. The command's own `formatHuman` renderer for rich single-object payloads
 *      (component docs, a11y/migration guides, lint-rule markdown).
 *
 * Returns `null` when neither step applies, leaving the caller to choose its own last-resort
 * fallback. Shared by the single-command path and `batch` so the two cannot drift apart.
 */
const formatCommandHuman = ({
	command,
	input,
	data,
	invocation,
}: {
	command: CommandDefinition;
	input: CommandInput;
	data: unknown;
	invocation: string;
}): string | null => {
	const resultKind = command.resultKind?.(input);
	const compact = resultKind
		? formatCompactResults({
				kind: resultKind,
				data,
				showFollowUp: command.name === 'search',
				invocation,
			})
		: null;
	return compact ?? command.formatHuman?.(data, { invocation }) ?? null;
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
	invocation,
}: {
	command: CommandDefinition;
	input: CommandInput;
	result: { data: unknown; isError: boolean };
	meta: Record<string, unknown>;
	json: boolean;
	writer: Writer;
	invocation: string;
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
		const resultKind = command.resultKind?.(input);
		const outputData = resultKind
			? (compactResults({
					kind: resultKind,
					data,
					showFollowUp: command.name === 'search',
				}) ?? data)
			: data;

		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: command.envelopeType(input),
				command: command.name,
				data: outputData,
				meta,
			}),
			writer,
		});
		return ExitCode.Ok;
	}

	// Default (human) output: the shared renderer, falling back to verbatim strings (e.g.
	// foundations markdown) or pretty JSON so a raw dump is only ever a last resort.
	const human = formatCommandHuman({ command, input, data, invocation });

	if (human !== null) {
		writer.out(human);
	} else {
		writeHumanResult({ data, writer });
	}

	return ExitCode.Ok;
};

type BatchStatus = 'success' | 'ambiguous' | 'failure';

type BatchResponseItem = {
	request: string[];
	status: BatchStatus;
	response: Envelope;
};

const classifyBatchResponse = (response: Envelope): BatchStatus => {
	if (!response.ok) {
		return 'failure';
	}
	return isDisambiguation(response.data) ? 'ambiguous' : 'success';
};

const createCapturedWriter = (): Writer & { stdout: string[]; stderr: string[] } => {
	const stdout: string[] = [];
	const stderr: string[] = [];
	return {
		stdout,
		stderr,
		out: (line) => stdout.push(line),
		err: (line) => stderr.push(line),
	};
};

/**
 * Execute one child argv through the normal CLI pipeline, forcing JSON so the parent can preserve
 * the child's stable envelope without scraping human-readable output.
 *
 * There is deliberately no `--help`/`--version` guard here. Every child token is also a top-level
 * token, so {@link run} already short-circuits the whole invocation to help/version text before a
 * batch is ever resolved — a guard at this level would be unreachable.
 */
const runBatchChild = async ({
	request,
	invocation,
}: {
	request: BatchRequest;
	invocation: string;
}): Promise<BatchResponseItem> => {
	const parsed = parseArgs(request.argv);
	let response: Envelope;

	if (!parsed.command) {
		response = createErrorEnvelope({
			command: 'batch',
			code: 'USAGE_ERROR',
			message: 'A batch request must start with a command name.',
		});
	} else if (parsed.command === 'batch') {
		response = createErrorEnvelope({
			command: 'batch',
			code: 'USAGE_ERROR',
			message: 'Nested batch requests are not supported.',
		});
	} else if (getCommand(parsed.command)?.action) {
		response = createErrorEnvelope({
			command: parsed.command,
			code: 'USAGE_ERROR',
			message: `Action command "${parsed.command}" cannot run inside batch.`,
		});
	} else {
		const captured = createCapturedWriter();
		await run([...request.argv, '--json'], captured, { invocation });
		try {
			response = JSON.parse(captured.stdout.join('\n')) as Envelope;
		} catch {
			response = createErrorEnvelope({
				command: parsed.command,
				code: 'RUNTIME_ERROR',
				message: 'The child command did not produce a valid JSON envelope.',
			});
		}
	}

	return { request: request.argv, status: classifyBatchResponse(response), response };
};

/**
 * Render an already-transformed child success envelope with the same human format as its command.
 */
const formatBatchChildHuman = ({
	item,
	invocation,
}: {
	item: BatchResponseItem;
	invocation: string;
}): string => {
	if (!item.response.ok) {
		return `Error: ${item.response.error.message}`;
	}

	const parsed = parseArgs(item.request);
	const definition = parsed.command ? getCommand(parsed.command) : undefined;
	if (!definition) {
		return formatHumanResult({ data: item.response.data });
	}

	// A unified search spans every kind, so it has no single result kind and needs the grouped
	// formatter instead. This is the same condition `search`'s own resolver uses to choose the
	// grouped path, so the two cannot disagree.
	if (
		definition.name === 'search' &&
		parsed.flags.type === undefined &&
		typeof item.response.data === 'object' &&
		item.response.data !== null
	) {
		return formatGroupedResults({
			groups: item.response.data as Record<string, unknown[]>,
			totalCount: Number(item.response.meta.count ?? 0),
			invocation,
		});
	}

	const human = formatCommandHuman({
		command: definition,
		input: { positionals: parsed.positionals, flags: parsed.flags },
		data: item.response.data,
		invocation,
	});
	return human ?? formatHumanResult({ data: item.response.data });
};

/**
 * Execute heterogeneous registered commands concurrently in the current process and aggregate
 * their existing envelopes. A valid batch exits zero even when individual child commands fail.
 */
const runBatchRequests = async ({
	command,
	requests,
	json,
	writer,
	invocation,
}: {
	command: CommandDefinition;
	requests: BatchRequest[];
	json: boolean;
	writer: Writer;
	invocation: string;
}): Promise<ExitCodeValue> => {
	const items = await Promise.all(
		requests.map((request) => runBatchChild({ request, invocation })),
	);
	const succeeded = items.filter((item) => item.status === 'success').length;
	const ambiguous = items.filter((item) => item.status === 'ambiguous').length;
	const failed = items.length - succeeded - ambiguous;

	if (json) {
		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: command.envelopeType({ positionals: [], flags: {} }),
				command: command.name,
				data: items,
				meta: { succeeded, ambiguous, failed },
			}),
			writer,
		});
		return ExitCode.Ok;
	}

	const summary = `Batch results: ${succeeded} succeeded, ${ambiguous} ambiguous, ${failed} failed`;
	const sections = items.map(
		(item) => `Request: ${item.request.join(' ')}\n${formatBatchChildHuman({ item, invocation })}`,
	);
	writer.out([summary, ...sections].join('\n\n'));
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
	invocation,
}: {
	command: CommandDefinition;
	input: CommandInput;
	results: Array<{ key: string; data: unknown; isError: boolean }>;
	meta: Record<string, unknown>;
	json: boolean;
	writer: Writer;
	invocation: string;
}): ExitCodeValue => {
	// Assemble `{ [key]: results }`, coercing "no matches" sub-results to empty arrays so one
	// empty domain does not blank out the others. The guidelines tool returns full Markdown, so
	// summarize its highest-ranked match for search; `docs <query>` remains the detail view.
	const grouped: Record<string, unknown[]> = {};
	for (const { key, data, isError } of results) {
		if (key === 'docs' && !isError && typeof data === 'string' && data.trim() !== '') {
			grouped[key] = createDocSearchResults({
				data,
				query: input.positionals.join(' '),
			});
		} else {
			grouped[key] = isError || !Array.isArray(data) ? [] : data;
		}
	}

	const totalCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

	if (totalCount === 0) {
		const message = `No components, tokens, icons, or docs found for "${input.positionals.join(' ')}".`;
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
		const compactGrouped = Object.fromEntries(
			(['components', 'tokens', 'icons', 'docs'] as const).map((kind) => [
				kind,
				compactResults({ kind, data: grouped[kind] ?? [], showFollowUp: true }) ?? [],
			]),
		) as Record<string, unknown[]>;

		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: command.envelopeType(input),
				command: command.name,
				// `data` for grouped commands is `{ components, tokens, icons, docs }` (already
				// counted per group), so `count` is the combined total across groups.
				data: compactGrouped,
				meta: { ...meta, count: totalCount },
			}),
			writer,
		});
		return ExitCode.Ok;
	}

	writer.out(formatGroupedResults({ groups: grouped, totalCount, invocation }));
	return ExitCode.Ok;
};

type RunOptions = {
	/**
	 * Exact command prefix to show in human-readable help and follow-up hints.
	 */
	invocation?: RenderContext['invocation'];
};

/**
 * Parse and execute a single CLI invocation.
 *
 * @param argv - Arguments after `node <script>` (i.e. `process.argv.slice(2)`).
 * @param writer - Injectable output sink; defaults to console-backed stdout/stderr.
 * @param options - Distribution-specific rendering options.
 * @returns The process exit code. The bin wrapper maps this onto `process.exit`.
 */
export const run = async (
	argv: string[] = process.argv.slice(2),
	writer: Writer = defaultWriter,
	{ invocation = CLI_BIN_NAME }: RunOptions = {},
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
		writer.out(buildHelpText(invocation));
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
			writer.err(`Run \`${invocation} --help\` to see available commands.`);
		}
		return ExitCode.UsageError;
	}

	try {
		return await runRegistryCommand({
			command: definition,
			input: { positionals, flags, rawArgs: argv },
			json,
			writer,
			invocation,
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
