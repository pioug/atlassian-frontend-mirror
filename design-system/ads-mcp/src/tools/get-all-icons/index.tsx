/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { icons } from './icons';

export const listGetAllIconsTool: Tool = {
	name: 'ads_get_all_icons',
	description:
		"Fetch all Atlassian Design System icons. Only use when `ads_search_icons` does not return what you're looking for.",
	annotations: {
		title: 'Get all ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};

export const getAllIconsTool = async (): Promise<{
	content: {
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: string;
		text: string;
	}[];
}> => ({
	content: icons.map((icon) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: 'text',
		text: JSON.stringify(icon, null, 2),
	})),
});
