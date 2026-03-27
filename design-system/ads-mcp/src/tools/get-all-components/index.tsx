/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { loadAllComponents } from './load-all-components';

export const listGetAllComponentsTool: Tool = {
	name: 'ads_get_all_components',
	description: `Returns **every** Atlassian Design System component record as separate JSON text chunks (full catalog; large payload).

WHEN TO USE:
Last resort when \`ads_plan\` / \`ads_search_components\` is insufficient and you must enumerate all components. Prefer search for normal component picking.

No parameters.`,
	annotations: {
		title: 'Get all ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};

export const getAllComponentsTool = async (): Promise<{
	content: {
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: component`
		type: string;
		text: string;
	}[];
}> => {
	return {
		content: loadAllComponents().map((component) => ({
			// NOTE: Ideally one day the MCP would support structured content…
			// eg. `type: 'object', data: component`
			type: 'text',
			text: JSON.stringify(component, null, 2),
		})),
	};
};
