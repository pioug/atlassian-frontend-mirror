import type { Tool } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { components } from './components';

export const listGetComponentsTool: Tool = {
	name: 'ads_get_components',
	description: `Fetch all Atlassian Design System components. Only use when \`ads_search_components\` does not return what you're looking for.`,
	annotations: {
		title: 'Get all ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};

export const getComponentsTool = async (): Promise<{
    content: {
        // NOTE: Ideally one day the MCP would support structured content…
        // eg. `type: 'object', data: component`
        type: string;
        text: string;
    }[];
}> => ({
	content: components.map((component) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: component`
		type: 'text',
		text: JSON.stringify(component, null, 2),
	})),
});
