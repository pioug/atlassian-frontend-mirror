/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { icons } from './icons';

export const listGetAllIconsTool: Tool = {
	name: 'ads_get_all_icons',
	description: `Returns **every** ADS icon record as separate JSON text chunks (full catalog; large payload).

WHEN TO USE:
Last resort when \`ads_plan\` / \`ads_search_icons\` is insufficient and you must enumerate all icons. Prefer search for normal icon picking.

No parameters.`,
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
