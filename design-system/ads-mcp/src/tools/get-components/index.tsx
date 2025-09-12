import { emptyInputSchema } from '../../schema';

import { components } from './components';

const componentsList = components.map((c) => ({
	name: c.name,
	description: c.description,
	releasePhase: c.releasePhase,
	category: c.category,
}));

export const listGetComponentsTool = {
	name: 'get_components',
	description: `You MUST use this to fetch all Atlassian Design System components and parse their names, descriptions, and understand how they might be used (provided in JSON format) before working with components.
You should never use a custom component not provided via this API where appropriate, or the custom component is a necessary wrapper around an ADS component.

For a full example, guidelines, list of props, and more information, you should use the \`search_components\` tool passing one or many component names as the 'terms' tool parameter.
`,
	annotations: {
		title: 'Get ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: emptyInputSchema,
};

export const getComponentsTool = async () => ({
	content: componentsList.map((component) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: component`
		type: 'text',
		text: JSON.stringify(component, null, 2),
	})),
});
