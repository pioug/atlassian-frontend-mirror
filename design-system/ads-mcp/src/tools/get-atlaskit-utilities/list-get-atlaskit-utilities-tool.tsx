/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const listGetAtlaskitUtilitiesTool: Tool = {
	name: 'atlaskit_get_utilities',
	description: `Returns a compact inventory of public \`@atlaskit/*\` utilities (functions, constants, types) that are not covered by the Atlassian Design System (ADS) catalog. Output is names and packages only.

WHEN TO USE:
Use this for fallback discovery when you need a non-ADS \`@atlaskit/*\` utility inventory without the full metadata payload. For usage guidance and signatures, use \`atlaskit_search_utilities\`.

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
