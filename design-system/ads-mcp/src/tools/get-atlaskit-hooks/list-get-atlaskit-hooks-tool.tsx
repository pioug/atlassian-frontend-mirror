/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const listGetAtlaskitHooksTool: Tool = {
	name: 'atlaskit_get_hooks',
	description: `Returns a compact inventory of public \`@atlaskit/*\` hooks that are not covered by the Atlassian Design System (ADS) catalog. Output is names and packages only.

WHEN TO USE:
Use this for fallback discovery when you need a non-ADS \`@atlaskit/*\` hook inventory without the full metadata payload. For usage guidance, parameters, and return values, use \`atlaskit_search_hooks\`.

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
