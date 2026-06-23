/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const listGetAtlaskitUtilitiesTool: Tool = {
	name: 'atlaskit_get_utilities',
	description: `Returns the names and packages of all atlaskit utilities (functions, constants, types) excluding utilities covered by the Atlassian Design System.

WHEN TO USE:
Use this when you want to see what utilities are available without the full metadata payload.

No parameters.`,
	annotations: {
		title: 'Get all Atlaskit utilities',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(z.object({})),
};
