/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const listGetAtlaskitComponentsTool: Tool = {
	name: 'atlaskit_get_components',
	description: `Returns a compact inventory of public \`@atlaskit/*\` component packages that are not covered by the Atlassian Design System (ADS) component catalog. Output is names and packages only.

WHEN TO USE:
Use this for fallback discovery after ADS component search is not enough, or when you need to see which non-ADS \`@atlaskit/*\` components are available without the full metadata payload. For implementation examples and props, use \`atlaskit_search_components\`.

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
