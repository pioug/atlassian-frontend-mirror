/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

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
