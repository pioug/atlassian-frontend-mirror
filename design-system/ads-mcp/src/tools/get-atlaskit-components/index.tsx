/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { atlaskitComponents } from './atlaskit-components.codegen';

export const listGetAtlaskitComponentsTool: Tool = {
	name: 'atlaskit_get_components',
	description: `Returns the names and packages of all atlaskit components excluding components covered by the Atlassian Design System.

WHEN TO USE:
Use this when you want to see what components are available without the full metadata payload.

No parameters.`,
	annotations: {
		title: 'Get all Atlaskit components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};

export const getAtlaskitComponentsTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const components = atlaskitComponents.map((component) => ({
		name: component.name,
		package: component.package,
	}));

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(components, null, 2),
			},
		],
	};
};
