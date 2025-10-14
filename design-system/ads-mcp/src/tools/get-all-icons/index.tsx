import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { coreIconMetadata } from '@atlaskit/icon/metadata';

const icons = Object.entries(coreIconMetadata).map(([_key, icon]) => ({
	componentName: icon.componentName,
	package: icon.package,
	categorization: icon.categorization,
	keywords: icon.keywords,
	status: icon.status,
	usage: icon.usage,
	type: icon.type,
	shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
}));

export const listGetAllIconsTool = {
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
