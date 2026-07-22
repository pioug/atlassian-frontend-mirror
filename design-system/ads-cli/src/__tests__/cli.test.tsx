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
	it('routes unified `search <q>` (no --type) to all three search tools', async () => {
		const writer = createTestWriter();
		await run(['search', 'avatar'], writer);
		// All three tools are dispatched; assert every one ran with the same args.
		const paths = allDispatches.map((d) => d.importPath).sort();
		expect(paths).toEqual([
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

	it('routes `search --type icon` (singular) to only the icon search tool', async () => {
		const writer = createTestWriter();
		await run(['search', 'add', '--type', 'icon'], writer);
		expect(allDispatches).toHaveLength(1);
		expect(lastDispatch?.importPath).toBe('@atlaskit/ads-mcp/tools/search-icons');
		expect(lastDispatch?.handlerName).toBe('searchIconsTool');
	});

	it('rejects the plural `--type` forms as invalid', async () => {
		const writer = createTestWriter();
		const code = await run(['search', 'space', '--type', 'tokens'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(allDispatches).toHaveLength(0);
		expect(writer.stderr.join('\n')).toContain('Must be one of: component, token, icon');
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

	it('routes `token <name>` and `icon <name>` to search with a candidate window', async () => {
		const writer = createTestWriter();
		await run(['token', 'space.100'], writer);
		expect(lastDispatch?.handlerName).toBe('searchTokensTool');
		expect(lastDispatch?.args).toEqual({ terms: ['space.100'], limit: 8 });
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
			data: [{ name: 'Avatar' }],
		});
		// `count` is auto-derived for array payloads.
		expect(envelope.meta.count).toBe(1);
		expect(envelope.meta.terms).toEqual(['avatar']);
	});

	it('groups unified search into { components, tokens, icons } under one envelope', async () => {
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
			// icons intentionally empty (falls back to mockToolResult '[]')
		};
		const writer = createTestWriter();
		const code = await run(['search', 'button', '--json'], writer);

		expect(code).toBe(ExitCode.Ok);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.type).toBe('ads-cli/search');
		expect(Object.keys(envelope.data)).toEqual(['components', 'tokens', 'icons']);
		expect(envelope.data.components).toHaveLength(1);
		expect(envelope.data.tokens).toHaveLength(1);
		expect(envelope.data.icons).toEqual([]);
		// meta.count is the combined total across all groups.
		expect(envelope.meta.count).toBe(2);
	});

	it('reports the type-specific discriminator for token search', async () => {
		mockToolResult = { content: [{ type: 'text', text: '[]' }] };
		const writer = createTestWriter();
		await run(['search', 'space', '--type', 'token', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.type).toBe('ads-cli/search-tokens');
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
		expect(envelope.data).toEqual([{ name: 'Avatar' }, { name: 'Badge' }]);
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
		// A single-kind (`--type`) listing is terse: no per-row drill-in follow-up.
		expect(out).not.toContain('→ ads-cli component Avatar');
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
		};
		const writer = createTestWriter();
		await run(['search', 'button'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('Components (1):');
		expect(out).toContain('Button  @atlaskit/button');
		expect(out).toContain('Tokens (1):');
		expect(out).toContain('space.100 = 8px');
		// Unified search shows per-row drill-in follow-ups for every kind.
		expect(out).toContain('→ ads-cli component Button');
		expect(out).toContain('→ ads-cli token space.100');
		// The empty icons group is omitted from the human view.
		expect(out).not.toContain('Icons (');
	});

	it('renders token search results as compact name = value lines by default', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
			],
		};
		const writer = createTestWriter();
		await run(['search', 'space', '--type', 'token'], writer);
		expect(writer.stdout.join('\n')).toContain('space.100 = 8px');
	});

	it('still emits the full structured payload under --json (narrowed)', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify([{ name: 'Avatar', package: '@atlaskit/avatar' }]) },
			],
		};
		const writer = createTestWriter();
		await run(['search', 'avatar', '--type', 'component', '--json'], writer);
		const envelope = JSON.parse(writer.stdout.join('\n'));
		expect(envelope.data[0]).toEqual({ name: 'Avatar', package: '@atlaskit/avatar' });
	});

	it('prints string payloads (e.g. guidelines markdown) verbatim', async () => {
		mockToolResult = { content: [{ type: 'text', text: '# Spacing\n\nUse space tokens.' }] };
		const writer = createTestWriter();
		await run(['docs', 'spacing'], writer);
		expect(writer.stdout.join('\n')).toBe('# Spacing\n\nUse space tokens.');
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
		expect(out).toContain('Avatar  (@atlaskit/avatar)');
		expect(out).toContain('Props (1):');
		expect(out).not.toContain('"package"');
	});

	it('renders `token <name>` with a `token(...)` usage line, not raw JSON', async () => {
		mockToolResult = {
			content: [
				{ type: 'text', text: JSON.stringify([{ name: 'space.100', exampleValue: '8px' }]) },
			],
		};
		const writer = createTestWriter();
		await run(['token', 'space.100'], writer);
		const out = writer.stdout.join('\n');
		expect(out).toContain('space.100');
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
		expect(out).toContain('space.100 = 8px');
		expect(out).toContain('space.200 = 16px');
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
		expect(out).toContain('Button  (@atlaskit/button)');
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
		expect(out).toContain('AvatarGroup  (@atlaskit/avatar-group)');
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
		const code = await run(['frobnicate'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown command');
	});

	it('returns UsageError when search is given no terms', async () => {
		const writer = createTestWriter();
		const code = await run(['search'], writer);
		expect(code).toBe(ExitCode.UsageError);
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

	it('returns UsageError when an item command is given neither a name nor --all', async () => {
		for (const name of ['component', 'token', 'icon']) {
			const writer = createTestWriter();
			const code = await run([name], writer);
			expect(code).toBe(ExitCode.UsageError);
			expect(writer.stderr.join('\n')).toContain('--all');
		}
	});

	it('treats `list` as an unknown command now that it has been retired', async () => {
		const writer = createTestWriter();
		const code = await run(['list', 'components'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown command');
	});

	it('treats `plan` as an unknown command now that it has been retired', async () => {
		const writer = createTestWriter();
		const code = await run(['plan'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown command');
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

	it('lists the current commands in --help and omits retired ones', async () => {
		const writer = createTestWriter();
		const code = await run(['--help'], writer);
		expect(code).toBe(ExitCode.Ok);
		const out = writer.stdout.join('\n');

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

		for (const current of ['search', 'component', 'token', 'icon', 'lint-rules', 'docs']) {
			expect(listedCommands.has(current)).toBe(true);
		}
		// Retired / consolidated commands must no longer be listed.
		for (const removed of [
			'plan',
			'list',
			'search-icons',
			'search-tokens',
			'get-guidelines',
			'get-lint-rules',
			'get-a11y-guidelines',
			'migration-guides',
			'i18n-conversion',
			'manifest',
		]) {
			expect(listedCommands.has(removed)).toBe(false);
		}
	});

	it('treats `manifest` as an unknown command now that it has been retired', async () => {
		const writer = createTestWriter();
		const code = await run(['manifest'], writer);
		expect(code).toBe(ExitCode.UsageError);
		expect(writer.stderr.join('\n')).toContain('Unknown command');
	});
});
