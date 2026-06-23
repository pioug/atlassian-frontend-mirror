/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const listGetAtlaskitHooksTool: Tool = {
	name: 'atlaskit_get_hooks',
	description: `Returns the names and packages of all atlaskit hooks excluding hooks covered by the Atlassian Design System.

WHEN TO USE:
Use this when you want to see what hooks are available without the full metadata payload.

No parameters.`,
	annotations: {
		title: 'Get all Atlaskit hooks',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};
