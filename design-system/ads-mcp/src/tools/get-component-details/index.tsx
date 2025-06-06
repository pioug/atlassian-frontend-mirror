import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { components } from '../get-components/components';

const inputSchema = z.object({
	names: z.array(z.string()).describe('The name of the component(s) to get full details about'),
});

export const listGetComponentDetailsTool = {
	name: 'get_component_details',
	description: `You MUST use this to fetch detailed information about a specific Atlassian Design System component(s) including code examples, props, accessibility guidelines, and other usage guidance.
If you're not sure how to query this, you should use the \`get_components\` tool to get a list of all components and their names before using this tool.
`,
	annotations: {
		title: 'Get ADS component details',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

const cleanName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '');

export const getComponentDetailsTool = async (params: z.infer<typeof inputSchema>) => {
	const names = params.names.filter(Boolean).map(cleanName);

	if (!names.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: Required parameter 'names' is missing. Available components: ${components.map((c) => c.name).join(', ')}`,
				},
			],
		};
	}

	const filteredComponents = components.filter((c) => names.includes(cleanName(c.name)));

	if (!filteredComponents.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: Component not found for '${names.join(', ')}'. Available components: ${components.map((c) => c.name).join(', ')}`,
				},
			],
		};
	}

	return {
		content: filteredComponents.map((component) => ({
			// NOTE: Ideally one day the MCP would support structured content…
			// eg. `type: 'object', data: component`
			type: 'text',
			text: JSON.stringify(component, null, 2),
		})),
	};
};
