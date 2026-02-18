import path from 'path';

/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
	getDefaultEnvironment,
	StdioClientTransport,
	/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
} from '@modelcontextprotocol/sdk/client/stdio.js';

import { coreIconMetadata as allIcons } from '@atlaskit/icon/metadata';
import { tokens as allTokens } from '@atlaskit/tokens/token-metadata';

import { components as allComponents } from '../../src/tools/get-components/components';
import { testData } from '../__fixtures__/data';

describe('ADS MCP Server E2E', () => {
	let client: Client;
	let transport: StdioClientTransport;

	beforeEach(async () => {
		const serverPath = path.join(__dirname, '../../index.js');

		transport = new StdioClientTransport({
			command: 'node',
			args: [serverPath],
			env: {
				...getDefaultEnvironment(),
				ADSMCP_ANALYTICS_OPT_OUT: 'true',
				ENABLE_PLATFORM_FF: expect
					.getState()
					.currentTestName?.includes('with feature flags enabled')
					? 'true'
					: 'false',
			},
		});

		client = new Client({ name: 'test-client', version: '1.0.0', capabilities: {} });

		await client.connect(transport);
	});

	afterEach(async () => {
		await client.close();
	});

	it.each([
		'ads_analyze_a11y',
		'ads_analyze_localhost_a11y',
		'ads_suggest_a11y_fixes',
		'ads_get_a11y_guidelines',
		'ads_get_all_icons',
		'ads_get_all_tokens',
		'ads_get_components',
		'ads_plan',
	])('Lists the %s tool', async (toolName) => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).toEqual(
			expect.arrayContaining([expect.objectContaining({ name: toolName })]),
		);
	});

	it('Lists the ads_get_tokens tool with feature flags enabled', async () => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'ads_get_tokens' })]),
		);
	});

	it('Does not list the ads_get_all_tokens tool with feature flags enabled', async () => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).not.toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'ads_get_all_tokens' })]),
		);
	});

	it('Lists the ads_get_icons tool with feature flags enabled', async () => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'ads_get_icons' })]),
		);
	});

	it('Does not list the ads_get_all_icons tool with feature flags enabled', async () => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).not.toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'ads_get_all_icons' })]),
		);
	});

	it('Lists the ads_get_lint_rules tool with feature flags enabled', async () => {
		const listedTools = (await client.listTools()).tools;
		expect(listedTools).toEqual(
			expect.arrayContaining([expect.objectContaining({ name: 'ads_get_lint_rules' })]),
		);
	});

	it('Gets all the tokens', async () => {
		const expectedTokenNames = allTokens.map(({ name }) => expect.objectContaining({ name }));
		const listedTokens = (
			await client.callTool({
				name: 'ads_get_all_tokens',
			})
		).content as { text: string }[];
		const listedTokensData = listedTokens.map((data) => JSON.parse(data.text));
		expect(listedTokensData).toEqual(expect.arrayContaining(expectedTokenNames));
	});

	it('Gets all the components', async () => {
		const expectedComponentNames = allComponents.map(({ name }) =>
			expect.objectContaining({ name }),
		);
		const listedComponents = (await client.callTool({ name: 'ads_get_components' })).content as {
			text: string;
		}[];
		const listedComponentsData = listedComponents.map((data) => JSON.parse(data.text));
		expect(listedComponentsData).toEqual(expect.arrayContaining(expectedComponentNames));
	});

	it('Gets all the icons', async () => {
		const expectedIconNames = Object.values(allIcons).map(({ componentName }) =>
			expect.objectContaining({ componentName }),
		);
		const listedIcons = (await client.callTool({ name: 'ads_get_all_icons' })).content as {
			text: string;
		}[];
		const listedIconsData = listedIcons.map((data) => JSON.parse(data.text));
		expect(listedIconsData).toEqual(expect.arrayContaining(expectedIconNames));
	});

	// Run through some basic smoke tests for each tool. It's probably a bit
	// overkill to completely validate all the data from "get all" tools, so
	// for each tool, just check the first result is what we expect and that
	// there are the expected number of results.
	it.each(testData)(
		'Returns the expected result for %s',
		async (_, { tool, args, expectedFirstResult, expectedLength }) => {
			const result = (await client.callTool({ name: tool, arguments: args })).content as {
				text: string;
			}[];
			expect(result).toHaveLength(expectedLength);
			expect(JSON.parse(result[0].text)).toEqual(expectedFirstResult);
		},
	);

	it('Returns markdown content for ads_get_tokens tool with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_tokens',
				arguments: {
					terms: ['color.text'],
					limit: 1,
					exactName: true,
				},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;

		// With feature flags enabled, returns JSON (structured content)
		const parsed = JSON.parse(text);
		expect(parsed).toHaveProperty('name', 'color.text');
		expect(parsed).toHaveProperty('description');
		expect(parsed.description).toContain('primary text');
	});

	it('Returns markdown content for ads_get_icons tool with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_icons',
				arguments: {
					terms: ['AddIcon'],
					limit: 1,
					exactName: true,
				},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;

		// With feature flags enabled, returns JSON (structured content)
		const parsed = JSON.parse(text);
		expect(parsed).toHaveProperty('componentName', 'AddIcon');
		expect(parsed).toHaveProperty('package', '@atlaskit/icon/core/add');
		expect(parsed).toHaveProperty('keywords');
		expect(Array.isArray(parsed.keywords)).toBe(true);
		expect(parsed).toHaveProperty('usage');
		expect(parsed).toHaveProperty('status', 'published');
	});

	it('Returns all icons as markdown when no search terms provided for ads_get_icons tool with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_icons',
				arguments: {},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;

		// With feature flags enabled, returns JSON array of icon objects
		const parsed = JSON.parse(text);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBeGreaterThan(0);
		expect(parsed[0]).toHaveProperty('componentName');
		expect(parsed[0]).toHaveProperty('package');
		expect(parsed[0]).toHaveProperty('keywords');
		expect(text.length).toBeGreaterThan(100); // Substantial content
	});

	it('Returns JSON with icon package path for ads_get_icons when searching for a core icon with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_icons',
				arguments: {
					terms: ['AddIcon'],
					limit: 1,
					exactName: true,
				},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;
		const parsed = JSON.parse(text);
		expect(parsed).toHaveProperty('componentName', 'AddIcon');
		expect(parsed).toHaveProperty('package');
		expect(parsed.package).toContain('@atlaskit/icon/core/add');
	});

	it('Returns markdown content for ads_get_lint_rules tool with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_lint_rules',
				arguments: {
					terms: ['icon-label'],
					limit: 1,
					exactName: true,
				},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;

		// With feature flags enabled, returns JSON (single rule: may be double-stringified)
		const parsed = JSON.parse(text);
		const rule = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
		expect(rule).toHaveProperty('ruleName', 'icon-label');
		expect(rule).toHaveProperty('description');
		expect(rule).toHaveProperty('content');
		// Inner content is markdown
		expect(rule.content).toContain('# icon-label');
		expect(rule.content).toContain('Icon labels');
		expect(rule.content.length).toBeGreaterThan(50);
	});

	it('Returns all lint rules as JSON array when no search terms provided for ads_get_lint_rules tool with feature flags enabled', async () => {
		const result = (
			await client.callTool({
				name: 'ads_get_lint_rules',
				arguments: {},
			})
		).content as { text: string }[];

		expect(result).toHaveLength(1);
		const text = result[0].text;

		// With feature flags enabled, returns JSON array (elements may be JSON strings)
		const parsed = JSON.parse(text);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBeGreaterThan(0);
		const firstRule = typeof parsed[0] === 'string' ? JSON.parse(parsed[0]) : parsed[0];
		expect(firstRule).toHaveProperty('ruleName');
		expect(firstRule).toHaveProperty('description');
		expect(firstRule).toHaveProperty('content');
		expect(text.length).toBeGreaterThan(100); // Substantial content
	});

	it('Returns a useful error if a tool is called with the wrong arguments', async () => {
		const result = (
			await client.callTool({
				name: 'ads_analyze_a11y',
				arguments: {
					/* There should be a `code` in here */
				},
			})
		).content as { type: 'text'; text: string; isError: boolean }[];
		expect(result[0].isError).toEqual(true);
		const errorText = JSON.parse(result[0].text);
		expect(errorText.error).toEqual('Invalid arguments provided');
		expect(errorText.validationErrors).toBeDefined();
		expect(errorText.expectedSchema).toBeDefined();
		expect(errorText.receivedArguments).toBeDefined();
	});
});
