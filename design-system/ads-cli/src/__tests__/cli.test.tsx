import { run } from '../cli';
import type { Writer } from '../output/writer';
import { ExitCode, type ToolResult } from '../types';

/**
 * Capture of the last handler dispatch so tests can assert which ADS MCP tool a command
 * resolved to and with what arguments — without importing the real (dataset-heavy) tools.
 */
type DispatchCapture = {
	importPath: string;
	handlerName: string;
	args: unknown;
};

let lastDispatch: DispatchCapture | undefined;

/**
 * All dispatches for the current invocation (unified `search` dispatches to three tools).
 */
let allDispatches: DispatchCapture[] = [];

/**
 * The fake tool result returned by the mocked handler. Individual tests override this to
 * simulate success, error text, or multi-block responses.
 */
let mockToolResult: ToolResult = { content: [{ type: 'text', text: '[]' }] };

/**
 * Per-import-path result overrides, so grouped-search tests can make one kind non-empty.
 * Falls back to {@link mockToolResult} when a path has no override.
 */
let mockResultByPath: Record<string, ToolResult> = {};

// Mock only `importToolHandler`, preserving the real command definitions and `getCommand`.
// This lets us assert real dispatch/resolution logic while intercepting the dynamic import of
// the actual (dataset-heavy) ADS MCP tools. `jest.mock` is hoisted above the imports by the
// test transform, so the mock is in place before `run` is loaded.
jest.mock('../commands/import-tool-handler', () => ({
	importToolHandler: jest.fn(
		async ({ importPath, handlerName }: { importPath: string; handlerName: string }) => {
			return async (args?: unknown): Promise<ToolResult> => {
				const dispatch = { importPath, handlerName, args };
				lastDispatch = dispatch;
				allDispatches.push(dispatch);
				return mockResultByPath[importPath] ?? mockToolResult;
			};
		},
	),
}));

/**
 * A test writer that records stdout/stderr lines separately so we can assert the output
 * contract (data on stdout, diagnostics on stderr).
 */
const createTestWriter = (): Writer & { stdout: string[]; stderr: string[] } => {
	const stdout: string[] = [];
	const stderr: string[] = [];
	return {
		stdout,
		stderr,
		out: (line: string) => stdout.push(line),
		err: (line: string) => stderr.push(line),
	};
};

beforeEach(() => {
	lastDispatch = undefined;
	allDispatches = [];
	mockResultByPath = {};
	mockToolResult = { content: [{ type: 'text', text: '[]' }] };
});

describe('run — dispatch', () => {
	it('routes unified `search <q>` (no --type) to entity and docs search tools', async () => {
		const writer = createTestWriter();
		await run(['search', 'avatar'], writer);
		// All four tools are dispatched; assert every one ran with the same args.
		const paths = allDispatches.map((d) => d.importPath).sort();
		expect(paths).toEqual([
			'@atlaskit/ads-mcp/tools/get-guidelines',
			'@atlaskit/ads-mcp/tools/search-components',
			'@atlaskit/ads-mcp/tools/search-icons',
			'@atlaskit/ads-mcp/tools/search-tokens',
		]);
		for (const dispatch of allDispatches) {
			expect(dispatch.args).toEqual({ terms: ['avatar'] });
		}
	});

	it('routes `search --type token` (singular) to only the token search tool', async () => {
		const writer = createTestWriter();
		await run(['search', 'space', '--type', 'token'], writer);
		expect(allDispatches).toHaveLength(1);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/search-tokens');
		expect(lastDispatch?.handlerName).toBe('searchTokensTool');
		expect(lastDispatch?.args).toEqual({ terms: ['space'] });
	});

	it('routes every batch request through its existing command', async () => {
		const writer = createTestWriter();
		await run(
			[
				'batch',
				'--command',
				'component',
				'Button',
				'--command',
				'component',
				'Modal',
				'--command',
				'token',
				'space.100',
				'--command',
				'icon',
				'add',
			],
			writer,
		);

		expect(allDispatches).toHaveLength(4);
		expect(
			allDispatches
				.filter((dispatch) => dispatch.importPath === '@atlaskit/ads-mcp/tools/search-components')
				.map((dispatch) => dispatch.args),
		).toEqual([
			{ terms: ['Button'], limit: 8 },
			{ terms: ['Modal'], limit: 8 },
		]);
		expect(
			allDispatches.find(
				(dispatch) => dispatch.importPath === '@atlaskit/ads-mcp/tools/search-tokens',
			)?.args,
		).toEqual({ terms: ['space.100'], limit: 8, includeMetadata: true });
		expect(
			allDispatches.find(
				(dispatch) => dispatch.importPath === '@atlaskit/ads-mcp/tools/search-icons',
			)?.args,
		).toEqual({ terms: ['add'], limit: 8 });
	});

	it('supports three or more requests of every entity command in one batch', async () => {
		const writer = createTestWriter();
		await run(
			[
				'batch',
				'--command',
				'component',
				'Button',
				'--command',
				'component',
				'Modal',
				'--command',
				'component',
				'Avatar',
				'--command',
				'token',
				'space.100',
				'--command',
				'token',
				'color.text',
				'--command',
				'token',
				'border.width',
				'--command',
				'icon',
				'AddIcon',
				'--command',
				'icon',
				'CloseIcon',
				'--command',
				'icon',
				'SearchIcon',
			],
			writer,
		);

		expect(allDispatches).toHaveLength(9);
		for (const tool of ['search-components', 'search-tokens', 'search-icons']) {
			expect(
				allDispatches.filter(
					(dispatch) => dispatch.importPath === `@atlaskit/ads-mcp/tools/${tool}`,
				),
			).toHaveLength(3);
		}
	});

	it('only dispatches the commands requested by `batch`', async () => {
		const writer = createTestWriter();
		await run(['batch', '--command', 'token', 'color.text'], writer);

		expect(allDispatches).toEqual([
			{
				importPath: '@atlaskit/ads-mcp/tools/search-tokens',
				handlerName: 'searchTokensTool',
				args: { terms: ['color.text'], limit: 8, includeMetadata: true },
			},
		]);
	});

	it('keeps child arguments when a child flag is immediately followed by --command', async () => {
		const writer = createTestWriter();
		await run(
			[
				'batch',
				'--command',
				'search',
				'button',
				'--type',
				'icon',
				'--command',
				'token',
				'space.200',
			],
			writer,
		);

		expect(allDispatches).toEqual([
			{
				importPath: '@atlaskit/ads-mcp/tools/search-icons',
				handlerName: 'searchIconsTool',
				args: { terms: ['button'] },
			},
			{
				importPath: '@atlaskit/ads-mcp/tools/search-tokens',
				handlerName: 'searchTokensTool',
				args: { terms: ['space.200'], limit: 8, includeMetadata: true },
			},
		]);
	});

	it('returns equivalent results for tokenized and complete-string child requests', async () => {
		mockToolResult = {
			content: [{ type: 'text', text: JSON.stringify([{ name: 'Grid' }]) }],
		};
		const tokenizedWriter = createTestWriter();
		const completeStringWriter = createTestWriter();

		await run(
			['batch', '--json', '--command', 'search', 'Grid', '--type', 'component'],
			tokenizedWriter,
		);
		await run(
			['batch', '--json', '--command', 'search Grid', '--type', 'component'],
			completeStringWriter,
		);

		expect(JSON.parse(completeStringWriter.stdout.join('\n'))).toEqual(
			JSON.parse(tokenizedWriter.stdout.join('\n')),
		);
	});

	it('routes multiple complete-string requests with inline and trailing child flags', async () => {
		const writer = createTestWriter();
		const code = await run(
			[
				'batch',
				'--command',
				'search avatar',
				'--command',
				'search icon --type icon --limit 1',
				'--command',
				'search space',
				'--type',
				'token',
			],
			writer,
		);

		expect(code).toBe(ExitCode.Ok);
		expect(allDispatches).toHaveLength(6);
		expect(allDispatches).toEqual(
			expect.arrayContaining([
				{
					importPath: '@atlaskit/ads-mcp/tools/search-components',
					handlerName: 'searchComponentsTool',
					args: { terms: ['avatar'] },
				},
				{
					importPath: '@atlaskit/ads-mcp/tools/search-tokens',
					handlerName: 'searchTokensTool',
					args: { terms: ['avatar'] },
				},
				{
					importPath: '@atlaskit/ads-mcp/tools/search-icons',
					handlerName: 'searchIconsTool',
					args: { terms: ['avatar'] },
				},
				{
					importPath: '@atlaskit/ads-mcp/tools/get-guidelines',
					handlerName: 'getGuidelinesTool',
					args: { terms: ['avatar'] },
				},
				{
					importPath: '@atlaskit/ads-mcp/tools/search-icons',
					handlerName: 'searchIconsTool',
					args: { terms: ['icon'], limit: 1 },
				},
				{
					importPath: '@atlaskit/ads-mcp/tools/search-tokens',
					handlerName: 'searchTokensTool',
					args: { terms: ['space'] },
				},
			]),
		);
	});

	it('batches heterogeneous command shapes, including child flags', async () => {
		const writer = createTestWriter();
		await run(
			[
				'batch',
				'--command',
				'component',
				'Button',
				'--command',
				'docs',
				'spacing',
				'--command',
				'search',
				'contrast',
				'--type',
				'docs',
			],
			writer,
		);

		expect(allDispatches).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					importPath: '@atlaskit/ads-mcp/tools/search-components',
					args: { terms: ['Button'], limit: 8 },
				}),
				expect.objectContaining({
					importPath: '@atlaskit/ads-mcp/tools/get-guidelines',
					args: { terms: ['spacing'] },
				}),
				expect.objectContaining({
					importPath: '@atlaskit/ads-mcp/tools/get-guidelines',
					args: { terms: ['contrast'] },
				}),
			]),
		);
	});

	it('routes `search --type icon` (singular) to only the icon search tool', async () => {
		const writer = createTestWriter();
		await run(['search', 'add', '--type', 'icon'], writer);
		expect(allDispatches).toHaveLength(1);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/search-icons');
		expect(lastDispatch?.handlerName).toBe('searchIconsTool');
	});

	it('routes `search --type docs` to only the foundations docs search tool', async () => {
		const writer = createTestWriter();
		await run(['search', 'contrast', '--type', 'docs'], writer);
		expect(allDispatches).toHaveLength(1);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/get-guidelines');
		expect(lastDispatch?.handlerName).toBe('getGuidelinesTool');
		expect(lastDispatch?.args).toEqual({ terms: ['contrast'] });
	});

	it('rejects the plural `--type` forms as invalid', async () => {
		const writer = createTestWriter();
		const code = await run(['search', 'space', '--type', 'tokens'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(allDispatches).toHaveLength(0);
		expect(writer.stderr.join('\n')).toContain('Must be one of: component, token, icon, docs');
	});

	it('passes a parsed numeric --limit to the tool', async () => {
		const writer = createTestWriter();
		await run(['search', 'avatar', '--limit', '5'], writer);
		expect(lastDispatch?.args).toEqual({ terms: ['avatar'], limit: 5 });
	});

	it('routes `component --all` to getAllComponentsTool with no args', async () => {
		const writer = createTestWriter();
		await run(['component', '--all'], writer);
		expect(lastDispatch).toEqual({
			importPath: '@atlaskit/ads-mcp/tools/get-all-components',
			handlerName: 'getAllComponentsTool',
			args: undefined,
		});
	});

	it('routes `token --all` and `icon --all` to their get-all tools', async () => {
		const writer = createTestWriter();
		await run(['token', '--all'], writer);
		expect(lastDispatch?.handlerName).toBe('getAllTokensTool');
		await run(['icon', '--all'], writer);
		expect(lastDispatch?.handlerName).toBe('getAllIconsTool');
	});

	it('routes `token <name>` to metadata-inclusive search with a candidate window', async () => {
		const writer = createTestWriter();
		await run(['token', 'space.100'], writer);
		expect(lastDispatch).toEqual({
			importPath: '@atlaskit/ads-mcp/tools/search-tokens',
			handlerName: 'searchTokensTool',
			args: { terms: ['space.100'], limit: 8, includeMetadata: true },
		});
	});

	it('routes `icon <name>` to search with a candidate window', async () => {
		const writer = createTestWriter();
		await run(['icon', 'AddIcon'], writer);
		expect(lastDispatch?.handlerName).toBe('searchIconsTool');
		expect(lastDispatch?.args).toEqual({ terms: ['AddIcon'], limit: 8 });
	});

	it('routes `docs <term>` to getGuidelinesTool (foundations default)', async () => {
		const writer = createTestWriter();
		await run(['docs', 'spacing'], writer);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/get-guidelines');
		expect(lastDispatch?.handlerName).toBe('getGuidelinesTool');
		expect(lastDispatch?.args).toEqual({ terms: ['spacing'] });
	});

	it('routes `component <name>` to component search with a candidate window', async () => {
		const writer = createTestWriter();
		await run(['component', 'Avatar'], writer);
		expect(lastDispatch?.handlerName).toBe('searchComponentsTool');
		// A window (not limit 1) so the command can prefer an exact match and detect ambiguity.
		expect(lastDispatch?.args).toEqual({ terms: ['Avatar'], limit: 8 });
	});

	it('routes a fuzzy `lint-rules <term>` to a candidate window so it can disambiguate', async () => {
		const writer = createTestWriter();
		await run(['lint-rules', 'unsafe'], writer);
		expect(lastDispatch?.handlerName).toBe('getLintRulesTool');
		// A window (not the tool default of 1) so `transform` can prefer an exact rule-name match
		// and detect ambiguity.
		expect(lastDispatch?.args).toEqual({ terms: ['unsafe'], limit: 8 });
	});

	it('routes bare `lint-rules` (no term) with no candidate window', async () => {
		const writer = createTestWriter();
		await run(['lint-rules'], writer);
		expect(lastDispatch?.handlerName).toBe('getLintRulesTool');
		// Bare `lint-rules` returns every rule; no window is injected.
		expect(lastDispatch?.args).toEqual({ terms: [] });
	});

	it('honours an explicit --limit as the candidate window for a fuzzy `lint-rules <term>`', async () => {
		const writer = createTestWriter();
		await run(['lint-rules', 'unsafe', '--limit', '3'], writer);
		expect(lastDispatch?.args).toEqual({ terms: ['unsafe'], limit: 3 });
	});

	it('routes `docs a11y` with no topic to the full a11y bundle', async () => {
		const writer = createTestWriter();
		await run(['docs', 'a11y'], writer);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/get-a11y-guidelines');
		expect(lastDispatch?.handlerName).toBe('getA11yGuidelinesTool');
		expect(lastDispatch?.args).toEqual({});
	});

	it('routes `docs a11y <topic>` with the topic', async () => {
		const writer = createTestWriter();
		await run(['docs', 'a11y', 'buttons'], writer);
		expect(lastDispatch?.handlerName).toBe('getA11yGuidelinesTool');
		expect(lastDispatch?.args).toEqual({ topic: 'buttons' });
	});

	it('routes `docs migration <id>` and passes an empty description', async () => {
		const writer = createTestWriter();
		await run(['docs', 'migration', 'jira-spotlight'], writer);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/migration-guides');
		expect(lastDispatch?.handlerName).toBe('migrationGuidesTool');
		expect(lastDispatch?.args).toEqual({ migration: 'jira-spotlight', description: '' });
	});

	it('builds `manifest` from the command registry without dispatching an ADS MCP tool', async () => {
		const writer = createTestWriter();
		const code = await run(['manifest'], writer);
		expect(code).toBe(ExitCode.Ok);
		expect(allDispatches).toHaveLength(0);
	});
});

describe('run — JSON envelope', () => {
	it('wraps a narrowed (--type) result in a stable success envelope', async () => {
		mockToolResult = { content: [{ type: 'text', text: JSON.stringify([{ name: 'Avatar' }]) }] };
		const writer = createTestWriter();
		const code = await run(['search', 'avatar', '--type', 'component', '--json'], writer);

		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/search-components',
			command: 'search',
			ok: true,
			data: [
				{
					name: 'Avatar',
					propCount: 0,
					exampleCount: 0,
					followUp: 'component Avatar',
				},
			],
		});
		// `count` is auto-derived for array payloads.
		expect(envelope.meta.count).toBe(1);
		expect(envelope.meta.terms).toEqual(['avatar']);
	});

	it('groups unified search into { components, tokens, icons, docs } under one envelope', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [
					{ type: 'text', text: JSON.stringify([{ name: 'Button', package: '@atlaskit/button' }]) },
				],
			},
			'@atlaskit/ads-mcp/tools/search-tokens': {
				content: [
					{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
				],
			},
			'@atlaskit/ads-mcp/tools/get-guidelines': {
				content: [{ type: 'text', text: '# Button contrast\n\nUse color tokens.' }],
			},
			// icons intentionally empty (falls back to mockToolResult '[]')
		};
		const writer = createTestWriter();
		const code = await run(['search', 'button', '--json'], writer);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.type).toBe('ads-cli/search');
		expect(Object.keys(envelope.data)).toEqual(['components', 'tokens', 'icons', 'docs']);
		expect(envelope.data.components).toHaveLength(1);
		expect(envelope.data.components[0]).toEqual({
			name: 'Button',
			package: '@atlaskit/button',
			propCount: 0,
			exampleCount: 0,
			followUp: 'component Button',
		});
		expect(envelope.data.tokens).toHaveLength(1);
		expect(envelope.data.tokens[0]).toEqual({
			name: 'space.100',
			exampleValue: '8px',
			followUp: 'token space.100',
		});
		expect(envelope.data.icons).toEqual([]);
		expect(envelope.data.docs).toEqual([
			{
				title: 'Button',
				summary: 'Button contrast Use color tokens.',
				followUp: 'docs button',
			},
		]);
		// meta.count is the combined total across all groups.
		expect(envelope.meta.count).toBe(3);
	});

	it('returns independent batch items under one stable JSON envelope', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [
					{ type: 'text', text: JSON.stringify([{ name: 'Button', package: '@atlaskit/button' }]) },
				],
			},
			'@atlaskit/ads-mcp/tools/search-icons': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{ componentName: 'AddIcon', package: '@atlaskit/icon/core/add' },
						]),
					},
				],
			},
		};
		const writer = createTestWriter();
		const code = await run(
			['batch', '--json', '--command', 'component', 'Button', '--command', 'icon', 'AddIcon'],
			writer,
		);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/batch',
			command: 'batch',
			ok: true,
			data: [
				{
					request: ['component', 'Button'],
					status: 'success',
					response: {
						type: 'ads-cli/component',
						command: 'component',
						ok: true,
						data: { name: 'Button', package: '@atlaskit/button' },
					},
				},
				{
					request: ['icon', 'AddIcon'],
					status: 'success',
					response: {
						type: 'ads-cli/icon',
						command: 'icon',
						ok: true,
						data: { componentName: 'AddIcon', package: '@atlaskit/icon/core/add' },
					},
				},
			],
			meta: {
				succeeded: 2,
				ambiguous: 0,
				failed: 0,
				count: 2,
			},
		});
	});

	it('keeps successful batch data when another lookup fails', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [{ type: 'text', text: 'Error: No components found for "Missing".' }],
				isError: true,
			},
			'@atlaskit/ads-mcp/tools/search-tokens': {
				content: [
					{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
				],
			},
		};
		const writer = createTestWriter();
		const code = await run(
			['batch', '--json', '--command', 'component', 'Missing', '--command', 'token', 'space.100'],
			writer,
		);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data).toEqual([
			{
				request: ['component', 'Missing'],
				status: 'failure',
				response: {
					type: 'ads-cli/error',
					command: 'component',
					ok: false,
					error: { code: 'NOT_FOUND', message: 'No components found for "Missing".' },
				},
			},
			{
				request: ['token', 'space.100'],
				status: 'success',
				response: expect.objectContaining({
					type: 'ads-cli/token',
					command: 'token',
					ok: true,
					data: expect.objectContaining({ name: 'space.100', exampleValue: '8px' }),
				}),
			},
		]);
		expect(envelope.meta).toEqual({ succeeded: 1, ambiguous: 0, failed: 1, count: 2 });
	});

	it('classifies fuzzy batch candidates as ambiguous rather than resolved', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'Button', package: '@atlaskit/button' },
						{ name: 'ButtonGroup', package: '@atlaskit/button' },
					]),
				},
			],
		};
		const writer = createTestWriter();
		const code = await run(['batch', '--json', '--command', 'component', 'asdasdButton'], writer);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data).toEqual([
			{
				request: ['component', 'asdasdButton'],
				status: 'ambiguous',
				response: expect.objectContaining({
					type: 'ads-cli/component',
					command: 'component',
					ok: true,
					data: {
						ambiguous: true,
						query: 'asdasdButton',
						noun: 'component',
						candidates: [
							{
								name: 'Button',
								hint: '@atlaskit/button',
								followUp: 'component Button',
							},
							{
								name: 'ButtonGroup',
								hint: '@atlaskit/button',
								followUp: 'component ButtonGroup',
							},
						],
					},
				}),
			},
		]);
		expect(envelope.meta).toEqual({ succeeded: 0, ambiguous: 1, failed: 0, count: 1 });
	});

	it("preserves a child command's lone fuzzy-match behavior", async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify([{ name: 'Button', package: '@atlaskit/button' }]) },
			],
		};
		const writer = createTestWriter();
		await run(['batch', '--json', '--command', 'component', 'Butto'], writer);

		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data[0]).toMatchObject({
			request: ['component', 'Butto'],
			status: 'success',
			response: {
				type: 'ads-cli/component',
				ok: true,
				data: { name: 'Button' },
			},
		});
	});

	it('reports the type-specific discriminator for token search', async () => {
		mockToolResult = { content: [{ type: 'text', text: '[]' }] };
		const writer = createTestWriter();
		await run(['search', 'space', '--type', 'token', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.type).toBe('ads-cli/search-tokens');
	});

	it('emits a self-describing capability manifest under --json', async () => {
		const writer = createTestWriter();
		const code = await run(['manifest', '--json'], writer);

		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/manifest',
			command: 'manifest',
			ok: true,
			data: {
				schemaVersion: 2,
				name: '@atlaskit/ads-cli',
				bin: 'ads-cli',
				version: expect.stringMatching(/^\d+\.\d+\.\d+/),
				errorResponseType: 'ads-cli/error',
			},
		});
		const search = envelope.data.commands.find(
			(command: { name: string }) => command.name === 'search',
		);
		expect(search).toMatchObject({
			jsonSupported: true,
			arguments: [{ name: 'query', type: 'string', required: true, variadic: true }],
			responseTypes: [
				'ads-cli/search',
				'ads-cli/search-components',
				'ads-cli/search-tokens',
				'ads-cli/search-icons',
				'ads-cli/search-docs',
			],
		});
		expect(search.flags.find((flag: { name: string }) => flag.name === 'type')).toMatchObject({
			type: 'string',
			choices: ['component', 'token', 'icon', 'docs'],
		});
		expect(search.flags.find((flag: { name: string }) => flag.name === 'limit')).toMatchObject({
			type: 'number',
			default: 2,
			description: 'Maximum matches per term, per result type (default: 2).',
		});
		const init = envelope.data.commands.find(
			(command: { name: string }) => command.name === 'init',
		);
		expect(init).toMatchObject({
			jsonSupported: true,
			arguments: [],
			flags: [],
			responseTypes: ['ads-cli/init'],
		});
		const batch = envelope.data.commands.find(
			(command: { name: string }) => command.name === 'batch',
		);
		expect(batch).toMatchObject({
			jsonSupported: true,
			arguments: [],
			flags: [
				expect.objectContaining({
					name: 'command',
					type: 'string[]',
				}),
			],
			responseTypes: ['ads-cli/batch'],
		});
		expect(envelope.data.commands.map((command: { name: string }) => command.name)).toContain(
			'manifest',
		);
		expect(envelope.meta).not.toHaveProperty('schemaVersion');
	});

	it('reports the type-specific discriminator and concise records for docs search', async () => {
		mockToolResult = {
			content: [{ type: 'text', text: '## Color accessibility\n\nMeet contrast requirements.' }],
		};
		const writer = createTestWriter();
		await run(['search', 'contrast', '--type', 'docs', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.type).toBe('ads-cli/search-docs');
		expect(envelope.data).toEqual([
			{
				title: 'Contrast',
				summary: 'Color accessibility Meet contrast requirements.',
				followUp: 'docs contrast',
			},
		]);
	});

	it('parses each block of a multi-block result into an array', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify({ name: 'Avatar' }) },
				{ type: 'text', text: JSON.stringify({ name: 'Badge' }) },
			],
		};
		const writer = createTestWriter();
		await run(['component', '--all', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data).toEqual([
			{ name: 'Avatar', propCount: 0, exampleCount: 0 },
			{ name: 'Badge', propCount: 0, exampleCount: 0 },
		]);
		expect(envelope.meta.count).toBe(2);
	});

	it('emits an error envelope with NOT_FOUND when the tool returns error text', async () => {
		mockToolResult = {
			content: [{ type: 'text', text: "Error: No ADS components found for 'zzz'." }],
		};
		const writer = createTestWriter();
		const code = await run(['search', 'zzz', '--json'], writer);

		expect(code).toBe(ExitCode.NotFound);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/error',
			command: 'search',
			ok: false,
			error: { code: 'NOT_FOUND' },
		});
	});
});

describe('run — output contract', () => {
	it('writes human data to stdout and nothing to stderr on success', async () => {
		mockToolResult = { content: [{ type: 'text', text: JSON.stringify([{ name: 'Avatar' }]) }] };
		const writer = createTestWriter();
		await run(['search', 'avatar'], writer);
		expect(writer.stdout.join('\n')).toContain('Avatar');
		expect(writer.stderr).toEqual([]);
	});

	it('renders narrowed component search as a compact human view, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'Avatar', package: '@atlaskit/avatar', props: [], examples: [] },
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['search', 'avatar', '--type', 'component'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Avatar  @atlaskit/avatar');
		expect(out).toContain('→ ads-cli component Avatar');
		// It must NOT be the raw JSON dump.
		expect(out).not.toContain('"package"');
	});

	it('renders unified search as grouped compact sections', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{ name: 'Button', package: '@atlaskit/button', props: [], examples: [] },
						]),
					},
				],
			},
			'@atlaskit/ads-mcp/tools/search-tokens': {
				content: [
					{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
				],
			},
			'@atlaskit/ads-mcp/tools/get-guidelines': {
				content: [{ type: 'text', text: '# Button contrast\n\nUse color tokens.' }],
			},
		};
		const writer = createTestWriter();
		await run(['search', 'button'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Components (1):');
		expect(out).toContain('Button  @atlaskit/button');
		expect(out).toContain('Tokens (1):');
		expect(out).toContain('space.100\n   ADS  ·  token  ·  = 8px');
		expect(out).toContain('Docs (1):');
		expect(out).toContain('Button\n   ADS  ·  docs\n   Button contrast Use color tokens.');
		// Unified search shows per-row drill-in follow-ups for every kind.
		expect(out).toContain('→ ads-cli component Button');
		expect(out).toContain('→ ads-cli token space.100');
		expect(out).toContain('→ ads-cli docs button');
		expect(out).not.toContain('# Button contrast');
		// The empty icons group is omitted from the human view.
		expect(out).not.toContain('Icons (');
	});

	it('renders full details for each successful batch item', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{ name: 'Button', package: '@atlaskit/button', props: [], examples: [] },
						]),
					},
				],
			},
			'@atlaskit/ads-mcp/tools/search-icons': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{ componentName: 'AddIcon', package: '@atlaskit/icon/core/add' },
						]),
					},
				],
			},
		};
		const writer = createTestWriter();
		await run(
			['batch', '--command', 'component', 'Button', '--command', 'icon', 'AddIcon'],
			writer,
		);

		const out = writer.stdout.join('\n');
		expect(out).toContain('Batch results: 2 succeeded, 0 ambiguous, 0 failed');
		expect(out).toContain('Request: component Button');
		expect(out).toContain('Button');
		expect(out).toContain('@atlaskit/button');
		expect(out).toContain('Props: none');
		expect(out).toContain('Request: icon AddIcon');
		expect(out).toContain("import AddIcon from '@atlaskit/icon/core/add';");
	});

	it('renders ambiguous batch items separately from failures', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'Button', package: '@atlaskit/button' },
						{ name: 'ButtonGroup', package: '@atlaskit/button' },
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['batch', '--command', 'component', 'asdasdButton'], writer);

		const out = writer.stdout.join('\n');
		expect(out).toContain('Batch results: 0 succeeded, 1 ambiguous, 0 failed');
		expect(out).toContain('Multiple components match "asdasdButton"');
		expect(out).toContain('→ ads-cli component Button');
	});

	it('renders token search results as compact name = value lines by default', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
			],
		};
		const writer = createTestWriter();
		await run(['search', 'space', '--type', 'token'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('space.100\n   ADS  ·  token  ·  = 8px');
		expect(out).toContain('→ ads-cli token space.100');
	});

	it('uses the supplied invocation in grouped search follow-up hints', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-components': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{
								name: 'CountrySelect',
								package: '@atlaskit/select',
								props: [],
								examples: [],
							},
						]),
					},
				],
			},
		};
		const writer = createTestWriter();
		await run(['search', 'country'], writer, { invocation: 'atlas ads' });
		const out = writer.stdout.join('\n');
		expect(out).toContain('→ atlas ads component CountrySelect');
		expect(out).not.toContain('→ ads-cli component CountrySelect');
	});

	it('renders `search --type docs` as a concise row with a docs follow-up', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: [
						'Color accessibility guidance explains how to meet contrast requirements without relying',
						'on raw color values and provides implementation details for every supported theme.',
						'',
						'## Full guidance',
						'',
						'A long body.',
					].join('\n'),
				},
			],
		};
		const writer = createTestWriter();
		await run(['search', 'contrast', '--type', 'docs'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain(
			'Contrast\n   ADS  ·  docs\n   Color accessibility guidance explains how to meet contrast requirements',
		);
		expect(out).toContain('…');
		expect(out).toContain('→ ads-cli docs contrast');
		expect(out).not.toContain('Full guidance');
		expect(out).not.toContain('A long body.');
	});

	it('emits the same compact discovery fields under --json as the human row', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{
							name: 'Avatar',
							package: '@atlaskit/avatar',
							props: [{ name: 'size' }],
							examples: ['<Avatar />'],
							designSource: { figmaUrl: 'https://example.com' },
						},
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['search', 'avatar', '--type', 'component', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data[0]).toEqual({
			name: 'Avatar',
			package: '@atlaskit/avatar',
			propCount: 1,
			exampleCount: 1,
			followUp: 'component Avatar',
		});
		expect(envelope.data[0]).not.toHaveProperty('props');
		expect(envelope.data[0]).not.toHaveProperty('examples');
		expect(envelope.data[0]).not.toHaveProperty('designSource');
	});

	it('pretty-prints JSON envelopes while keeping the retrieval payload compact', async () => {
		mockToolResult = { content: [{ type: 'text', text: JSON.stringify([{ name: 'Avatar' }]) }] };
		const writer = createTestWriter();
		await run(['search', 'avatar', '--type', 'component', '--json'], writer);
		expect(writer.stdout).toHaveLength(1);
		expect(writer.stdout[0]).toContain('\n  "data": [\n');
		expect(JSON.parse(writer.stdout[0]).data[0]).toEqual({
			name: 'Avatar',
			propCount: 0,
			exampleCount: 0,
			followUp: 'component Avatar',
		});
	});

	it('includes full token guidance and human-readable actionable fields in exact JSON detail', async () => {
		mockResultByPath = {
			'@atlaskit/ads-mcp/tools/search-tokens': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{
								name: 'space.100',
								exampleValue: '8px',
								usageGuidelines: {
									usage: 'Use for standard spacing.',
									cssProperties: ['gap', 'padding'],
								},
							},
						]),
					},
				],
			},
			'@atlaskit/ads-mcp/tools/search-icons': {
				content: [
					{
						type: 'text',
						text: JSON.stringify([
							{ componentName: 'AddIcon', package: '@atlaskit/icon/core/add' },
						]),
					},
				],
			},
		};
		const tokenWriter = createTestWriter();
		const iconWriter = createTestWriter();

		await run(['token', 'space.100', '--json'], tokenWriter);
		await run(['icon', 'AddIcon', '--json'], iconWriter);

		expect(JSON.parse(tokenWriter.stdout[0]).data).toEqual({
			name: 'space.100',
			exampleValue: '8px',
			usageGuidelines: {
				usage: 'Use for standard spacing.',
				cssProperties: ['gap', 'padding'],
			},
			usage: "token('space.100')",
		});
		expect(JSON.parse(iconWriter.stdout[0]).data).toEqual({
			componentName: 'AddIcon',
			package: '@atlaskit/icon/core/add',
			import: "import AddIcon from '@atlaskit/icon/core/add';",
		});
	});

	it('prints string payloads (e.g. guidelines markdown) verbatim', async () => {
		mockToolResult = { content: [{ type: 'text', text: '# Spacing\n\nUse space tokens.' }] };
		const writer = createTestWriter();
		await run(['docs', 'spacing'], writer);
		expect(writer.stdout.join('\n')).toBe('# Spacing\n\nUse space tokens.');
	});

	it('renders a command catalog by default and reserves structured output for --json', async () => {
		const writer = createTestWriter();
		await run(['manifest'], writer, { invocation: 'npx @atlaskit/ads-cli' });
		const out = writer.stdout.join('\n');
		expect(out).toMatch(/^ads-cli v\d+\.\d+\.\d+.* — 9 commands/);
		expect(out).toContain(
			'  init [--json]\n    Set up the ADS, UI Styling Standard, and Accessibility Foundation skills at the Git repository root and install the Atlas CLI ADS plugin.',
		);
		expect(out).toContain(
			'  search [--json]\n    Fuzzy-search ADS components, tokens, icons, and docs together (or narrow results with --type).',
		);
		expect(out).toContain(
			'  manifest [--json]\n    Describe every CLI command, argument, flag, and JSON response type.',
		);
		expect(out).toContain(
			'Run `npx @atlaskit/ads-cli manifest --json` for the full structured manifest.',
		);
		expect(out).not.toContain('"schemaVersion"');
	});

	it('renders `component <name>` as human-readable docs, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{
							name: 'Avatar',
							package: '@atlaskit/avatar',
							props: [{ name: 'size', type: 'string', description: 'The size.' }],
							examples: [],
						},
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['component', 'Avatar'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Avatar');
		expect(out).toContain('@atlaskit/avatar');
		expect(out).toContain('Props (1)');
		expect(out).not.toContain('"package"');
	});

	it('renders `token <name>` with a `token(...)` usage line, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{
							name: 'space.100',
							exampleValue: '8px',
							usageGuidelines: {
								usage: 'Use for standard spacing.',
								cssProperties: ['gap', 'padding'],
							},
						},
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['token', 'space.100'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('space.100');
		expect(out).toContain('Guidelines:');
		expect(out).toContain('Use for standard spacing.');
		expect(out).toContain('CSS properties:');
		expect(out).toContain('padding');
		expect(out).toContain("token('space.100')");
		expect(out).not.toContain('"exampleValue"');
	});

	it('renders `icon <name>` with a copy-paste import line, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{
							componentName: 'AddIcon',
							package: '@atlaskit/icon/core/add',
							usage: 'Adding an object.',
						},
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['icon', 'AddIcon'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain("import AddIcon from '@atlaskit/icon/core/add';");
		expect(out).not.toContain('"componentName"');
	});

	it('renders `token --all` as a compact per-row list', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify({ name: 'space.100', exampleValue: '8px' }) },
				{ type: 'text', text: JSON.stringify({ name: 'space.200', exampleValue: '16px' }) },
			],
		};
		const writer = createTestWriter();
		await run(['token', '--all'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('space.100\n   ADS  ·  token  ·  = 8px');
		expect(out).toContain('space.200\n   ADS  ·  token  ·  = 16px');
	});

	it('picks the exact name match from many candidates (not the top fuzzy hit)', async () => {
		// The tool ranks a different token first, but the user asked for the exact name `space`.
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'space.negative.025', exampleValue: '-2px' },
						{ name: 'space', exampleValue: '4px' },
						{ name: 'space.100', exampleValue: '8px' },
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['token', 'space'], writer);
		const out = writer.stdout.join('\n');
		// Renders the exact `space` token's detail, not a disambiguation list.
		expect(out).toContain('space');
		expect(out).toContain('Example value: 4px');
		expect(out).not.toContain('Did you mean');
	});

	it('matches an exact name case-insensitively', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'ButtonGroup', package: '@atlaskit/button', props: [], examples: [] },
						{ name: 'Button', package: '@atlaskit/button', props: [], examples: [] },
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['component', 'button'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Button');
		expect(out).toContain('@atlaskit/button');
		expect(out).not.toContain('Did you mean');
	});

	it('shows a disambiguation list when no exact match and several candidates', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ componentName: 'ArrowUpIcon', package: '@atlaskit/icon/core/arrow-up', usage: 'Up.' },
						{
							componentName: 'ArrowDownIcon',
							package: '@atlaskit/icon/core/arrow-down',
							usage: 'Down.',
						},
					]),
				},
			],
		};
		const writer = createTestWriter();
		const code = await run(['icon', 'arrow'], writer);
		const out = writer.stdout.join('\n');
		// Exit 0 (a successful search needing a follow-up), not an error.
		expect(code).toBe(ExitCode.Ok);
		expect(out).toContain('Multiple icons match "arrow"');
		expect(out).toContain('→ ads-cli icon ArrowUpIcon');
		expect(out).toContain('→ ads-cli icon ArrowDownIcon');
	});

	it('renders a lone candidate directly (no disambiguation) even without an exact name', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'AvatarGroup', package: '@atlaskit/avatar-group', props: [], examples: [] },
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['component', 'avatargrp'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('AvatarGroup');
		expect(out).toContain('@atlaskit/avatar-group');
		expect(out).not.toContain('Did you mean');
	});

	it('emits the disambiguation marker under --json with ok:true', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						{ name: 'space.100', exampleValue: '8px' },
						{ name: 'space.200', exampleValue: '16px' },
					]),
				},
			],
		};
		const writer = createTestWriter();
		const code = await run(['token', 'spac', '--json'], writer);
		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.ok).toBe(true);
		expect(envelope.data.ambiguous).toBe(true);
		expect(envelope.data.query).toBe('spac');
		expect(envelope.data.candidates).toHaveLength(2);
		expect(envelope.data.candidates[0]).toMatchObject({
			name: 'space.100',
			followUp: 'token space.100',
		});
	});

	it('renders `docs a11y <topic>` as human-readable text, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						topic: 'buttons',
						title: 'Button Accessibility',
						description: 'Make buttons accessible.',
						guidelines: ['Provide labels'],
					}),
				},
			],
		};
		const writer = createTestWriter();
		await run(['docs', 'a11y', 'buttons'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Button Accessibility');
		expect(out).toContain('Guidelines:');
		expect(out).not.toContain('"topic"');
	});

	it('renders a single `lint-rules` match as markdown, not raw JSON', async () => {
		// The tool double-encodes a single match: the text block is a JSON string literal of the
		// rule record.
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify(JSON.stringify({ ruleName: 'x', content: '# Rule X\n\nBody.' })),
				},
			],
		};
		const writer = createTestWriter();
		await run(['lint-rules', 'x'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('# Rule X');
		expect(out).not.toContain('"ruleName"');
	});

	it('renders multiple `lint-rules` matches as markdown, not raw JSON', async () => {
		// For multiple matches the tool returns an array whose elements are each a JSON string
		// literal of a rule record — the shape bare `lint-rules` and multi-term queries produce.
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						JSON.stringify({ ruleName: 'a', content: '# Rule A\n\nBody A.' }),
						JSON.stringify({ ruleName: 'b', content: '# Rule B\n\nBody B.' }),
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['lint-rules'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('# Rule A');
		expect(out).toContain('# Rule B');
		expect(out).not.toContain('"ruleName"');
	});

	it('disambiguates a fuzzy `lint-rules <term>` that matches several rules with no exact name', async () => {
		// Several fuzzy matches, none named exactly "unsafe" → a "did you mean?" list, not content.
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						JSON.stringify({
							ruleName: 'no-unsafe-selectors',
							description: 'Blocks unsafe CSS selectors.',
							content: '# no-unsafe-selectors\n\nBody.',
						}),
						JSON.stringify({
							ruleName: 'no-unsafe-values',
							description: 'Blocks unsafe values.',
							content: '# no-unsafe-values\n\nBody.',
						}),
					]),
				},
			],
		};
		const writer = createTestWriter();
		const code = await run(['lint-rules', 'unsafe'], writer);
		const out = writer.stdout.join('\n');
		expect(code).toBe(ExitCode.Ok);
		expect(out).toContain('Multiple lint-rules match "unsafe"');
		expect(out).toContain('no-unsafe-selectors');
		expect(out).toContain('→ ads-cli lint-rules no-unsafe-values');
		// A disambiguation list, not the rules' full Markdown content.
		expect(out).not.toContain('Body.');
	});

	it('shows content (not a picker) when a fuzzy `lint-rules <term>` matches a rule name exactly', async () => {
		// Query equals one candidate's rule name → render that rule's docs, even amid other matches.
		mockToolResult = {
			content: [
				{
					type: 'text',
					text: JSON.stringify([
						JSON.stringify({
							ruleName: 'no-unsafe-values',
							content: '# no-unsafe-values\n\nExact body.',
						}),
						JSON.stringify({
							ruleName: 'no-unsafe-selectors',
							content: '# no-unsafe-selectors\n\nOther body.',
						}),
					]),
				},
			],
		};
		const writer = createTestWriter();
		await run(['lint-rules', 'no-unsafe-values'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('# no-unsafe-values');
		expect(out).toContain('Exact body.');
		expect(out).not.toContain('Did you mean');
		expect(out).not.toContain('Other body.');
	});
});

describe('run — usage & exit codes', () => {
	it('returns UsageError and prints help when no command is given', async () => {
		const writer = createTestWriter();
		const code = await run([], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stdout.join('\n')).toContain('Usage');
	});

	it('returns Ok and prints help for --help', async () => {
		const writer = createTestWriter();
		const code = await run(['--help'], writer);
		expect(code).toBe(ExitCode.Ok);
		expect(writer.stdout.join('\n')).toContain('Commands');
	});

	it('returns UsageError for an unknown command', async () => {
		const writer = createTestWriter();
		const code = await run(['frobnicate'], writer, { invocation: 'atlas ads' });
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown command');
		expect(writer.stderr.join('\n')).toContain('Run `atlas ads --help`');
	});

	it('returns UsageError when search is given no terms', async () => {
		const writer = createTestWriter();
		const code = await run(['search'], writer);
		expect(code).toBe(ExitCode.UsageError);
	});

	it('returns UsageError when batch is given no command requests', async () => {
		const writer = createTestWriter();
		const code = await run(['batch'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('At least one command request is required.');
	});

	it('returns UsageError when a batch request omits its leading --command marker', async () => {
		const writer = createTestWriter();
		const code = await run(['batch', 'component', 'Button'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Each batch request must start with `--command`.');
	});

	it('returns UsageError when --command has no following request', async () => {
		const writer = createTestWriter();
		const code = await run(['batch', '--command', 'component', 'Button', '--command'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain(
			'`--command` must be followed by a non-empty command request.',
		);
	});

	it('returns UsageError for consecutive --command markers', async () => {
		const writer = createTestWriter();
		const code = await run(['batch', '--command', '--command', 'component', 'Button'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain(
			'`--command` must be followed by a non-empty command request.',
		);
	});

	it.each([
		['search Grid | cat', 'the `|` operator'],
		['search Grid > output.txt', 'the `>` operator'],
		['search $QUERY', 'environment expansion'],
		['search $(whoami)', 'command substitution'],
	])('returns UsageError for unsafe batch request %p', async (request, expectedError) => {
		const writer = createTestWriter();
		const code = await run(['batch', '--command', request], writer);

		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain(expectedError);
		expect(allDispatches).toHaveLength(0);
	});

	it('returns UsageError for malformed complete-string input', async () => {
		const writer = createTestWriter();
		const code = await run(['batch', '--command', 'component "Inline Dialog'], writer);

		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('unterminated " quote');
		expect(allDispatches).toHaveLength(0);
	});

	// A request made entirely of flags parses to no command name. The batch stays valid (exit 0)
	// and reports the problem as that child's own failure, like any other bad child request.
	it('reports a flag-only request as a batch failure rather than a batch-level error', async () => {
		const writer = createTestWriter();
		const code = await run(['batch', '--json', '--command', '--all'], writer);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.meta).toEqual({ succeeded: 0, ambiguous: 0, failed: 1, count: 1 });
		expect(envelope.data).toEqual([
			{
				request: ['--all'],
				status: 'failure',
				response: {
					type: 'ads-cli/error',
					command: 'batch',
					ok: false,
					error: {
						code: 'USAGE_ERROR',
						message: 'A batch request must start with a command name.',
					},
				},
			},
		]);
	});

	it('reports unknown and nested commands as independent batch failures', async () => {
		const writer = createTestWriter();
		const code = await run(
			['batch', '--json', '--command', 'frobnicate', '--command', 'batch', 'component', 'Button'],
			writer,
		);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.meta).toEqual({ succeeded: 0, ambiguous: 0, failed: 2, count: 2 });
		expect(envelope.data).toEqual([
			{
				request: ['frobnicate'],
				status: 'failure',
				response: {
					type: 'ads-cli/error',
					command: 'frobnicate',
					ok: false,
					error: { code: 'USAGE_ERROR', message: 'Unknown command "frobnicate".' },
				},
			},
			{
				request: ['batch', 'component', 'Button'],
				status: 'failure',
				response: {
					type: 'ads-cli/error',
					command: 'batch',
					ok: false,
					error: { code: 'USAGE_ERROR', message: 'Nested batch requests are not supported.' },
				},
			},
		]);
	});

	it('returns UsageError for a non-positive --limit', async () => {
		const writer = createTestWriter();
		const code = await run(['search', 'avatar', '--limit', '0'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Invalid --limit');
	});

	it('returns UsageError for an invalid --type', async () => {
		const writer = createTestWriter();
		const code = await run(['search', 'avatar', '--type', 'bogus'], writer);
		expect(code).toBe(ExitCode.UsageError);
	});

	it('reports every unified search domain when no results are found', async () => {
		const writer = createTestWriter();
		const code = await run(['search', 'zzznope'], writer);
		expect(code).toBe(ExitCode.NotFound);
		expect(writer.stderr.join('\n')).toContain(
			'No components, tokens, icons, or docs found for "zzznope".',
		);
	});

	it('reports failed batch commands per item and still exits successfully', async () => {
		mockToolResult = {
			content: [{ type: 'text', text: 'Error: No components found for "zzznope".' }],
			isError: true,
		};
		const writer = createTestWriter();
		const code = await run(['batch', '--command', 'component', 'zzznope'], writer);
		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		expect(writer.stdout.join('\n')).toContain('Batch results: 0 succeeded, 0 ambiguous, 1 failed');
		expect(writer.stdout.join('\n')).toContain('Error: No components found for "zzznope".');
	});

	it('returns UsageError when an item command is given neither a name nor --all', async () => {
		for (const name of ['component', 'token', 'icon']) {
			const writer = createTestWriter();
			const code = await run([name], writer);
			expect(code).toBe(ExitCode.UsageError);
			expect(writer.stderr.join('\n')).toContain('--all');
		}
	});

	it('returns a friendly exit-0 index (not an error) when docs is given no topic', async () => {
		const writer = createTestWriter();
		const code = await run(['docs'], writer);
		// Bare `docs` is a discoverable landing page, mirroring `docs a11y` with no topic —
		// exit 0, human-readable, listing the available namespaces, with nothing on stderr.
		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Choose a topic');
		expect(out).toContain('docs a11y');
		expect(out).toContain('docs migration');
		expect(out).not.toContain('Error:');
	});

	it('emits the docs index as a structured envelope under --json (exit 0)', async () => {
		const writer = createTestWriter();
		const code = await run(['docs', '--json'], writer);
		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.ok).toBe(true);
		expect(envelope.command).toBe('docs');
		expect(envelope.data).toHaveProperty('message');
	});

	it('returns UsageError for an unknown docs a11y topic', async () => {
		const writer = createTestWriter();
		const code = await run(['docs', 'a11y', 'bogus'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown a11y topic');
	});

	it('returns a friendly exit-0 index (not an error) when docs migration is given no id', async () => {
		const writer = createTestWriter();
		const code = await run(['docs', 'migration'], writer);
		// Consistent with bare `docs a11y` and bare `docs`: a discoverable landing page, not an error.
		expect(code).toBe(ExitCode.Ok);
		expect(writer.stderr).toEqual([]);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Specify a migration id');
		expect(out).toContain('jira-spotlight');
		expect(out).not.toContain('Error:');
	});

	it('returns UsageError for an unknown docs migration id', async () => {
		const writer = createTestWriter();
		const code = await run(['docs', 'migration', 'not-a-migration'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown migration id');
	});

	it('treats an empty-string tool result as NOT_FOUND (e.g. docs for an unknown foundation)', async () => {
		// `getGuidelinesTool` returns an empty string for an unknown foundation term.
		mockToolResult = { content: [{ type: 'text', text: '' }] };
		const writer = createTestWriter();
		const code = await run(['docs', 'zzznope'], writer);
		expect(code).toBe(ExitCode.NotFound);
		expect(writer.stdout).toEqual([]);
		expect(writer.stderr.join('\n')).toContain('No results found for "zzznope"');
	});

	it('maps an empty-string result to a NOT_FOUND envelope under --json', async () => {
		mockToolResult = { content: [{ type: 'text', text: '   ' }] };
		const writer = createTestWriter();
		const code = await run(['docs', 'zzznope', '--json'], writer);
		expect(code).toBe(ExitCode.NotFound);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/error',
			ok: false,
			error: { code: 'NOT_FOUND' },
		});
	});

	it('surfaces a USAGE_ERROR envelope with --json', async () => {
		const writer = createTestWriter();
		await run(['search', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope).toMatchObject({
			type: 'ads-cli/error',
			ok: false,
			error: { code: 'USAGE_ERROR' },
		});
	});
});

describe('run — version & help', () => {
	it('prints a version string for --version', async () => {
		const writer = createTestWriter();
		const code = await run(['--version'], writer);
		expect(code).toBe(ExitCode.Ok);
		expect(writer.stdout.join('\n')).toMatch(/\d+\.\d+\.\d+/);
	});

	it('lists the current commands in --help', async () => {
		const writer = createTestWriter();
		const code = await run(['--help'], writer);
		expect(code).toBe(ExitCode.Ok);
		const out = writer.stdout.join('\n');
		expect(out).toContain('components, tokens, icons, and docs');
		expect(out).toContain('Returns up to 2 matches per term, per result type by default');
		expect(out).toContain(
			'batch [--json] --command <command> [args...] [--command <command> [args...]]...',
		);
		expect(out).toContain(
			'$ ads-cli batch --command search button --type icon --command token space.200',
		);
		expect(out).toContain('canonical tokenized batch form');
		expect(out).toContain(
			'$ ads-cli batch --command "search button" --type icon --command "token space.200"',
		);
		expect(out).toContain('complete-string compatibility form');

		// Collect the command tokens actually listed under "Commands" — each command entry is a
		// line indented by two spaces whose first word is the command name. Matching on this
		// structure (rather than a loose substring) avoids false hits from words like "list" that
		// legitimately appear inside descriptions ("list all with --all").
		const listedCommands = new Set(
			out
				.split('\n')
				.map((line) => /^ {2}([a-z][a-z-]*)\b/.exec(line)?.[1])
				.filter((name): name is string => Boolean(name)),
		);

		for (const current of [
			'search',
			'batch',
			'component',
			'token',
			'icon',
			'lint-rules',
			'docs',
			'manifest',
		]) {
			expect(listedCommands.has(current)).toBe(true);
		}
	});

	it('uses the supplied invocation throughout --help', async () => {
		const writer = createTestWriter();
		await run(['--help'], writer, { invocation: 'atlas ads' });
		const out = writer.stdout.join('\n');
		const exampleLines = out.split('\n').filter((line) => line.startsWith('  $ atlas ads'));
		const commentColumns = exampleLines
			.filter((line) => line.includes('#'))
			.map((line) => line.indexOf('#'));

		expect(out).toContain('$ atlas ads <command> [options]');
		expect(out).toContain('$ atlas ads search contrast');
		expect(out).not.toContain('npx @atlaskit/ads-cli');
		expect(new Set(commentColumns)).toHaveProperty('size', 1);
		expect(
			exampleLines.filter((line) => !line.includes('#')).every((line) => !line.endsWith(' ')),
		).toBe(true);
	});
});
