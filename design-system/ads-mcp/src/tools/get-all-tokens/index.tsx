/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { tokens } from '@atlaskit/tokens/token-metadata';

import { zodToJsonSchema } from '../../helpers';

const inputSchema = z.object({});

export const listGetAllTokensTool: Tool = {
	name: 'ads_get_all_tokens',
	description: `Returns **every** ADS design token from bundled metadata (name, example value, usage guidelines)—one JSON object per token, **very large** output.

WHEN TO USE:
Last resort when \`ads_plan\` / \`ads_search_tokens\` cannot answer the question and you need the full list (e.g. exhaustive audit). Prefer targeted search for normal development.

No parameters.`,
	annotations: {
		title: 'Get all ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const getAllTokensTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => ({
	content: tokens.map((token) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: token`
		type: 'text',
		text: JSON.stringify(
			{
				name: token.name,
				exampleValue: token.exampleValue,
				usageGuidelines: token.usageGuidelines,
			},
			null,
			2,
		),
	})),
});
