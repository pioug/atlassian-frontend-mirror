import type { Tool } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

import { coreIconMetadata } from '@atlaskit/icon/metadata';

import { zodToJsonSchema } from '../../helpers';

const icons = Object.entries(coreIconMetadata).map(([_key, icon]) => ({
	componentName: icon.componentName,
	package: icon.package,
	categorization: icon.categorization,
	keywords: icon.keywords,
	status: icon.status,
	usage: icon.usage,
	shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
}));

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

export const getAllIconsTool = async () => ({
	content: icons.map((icon) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: 'text',
		text: JSON.stringify(icon, null, 2),
	})),
});
