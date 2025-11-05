import path from 'path';

/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
	getDefaultEnvironment,
	StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio';

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
});
