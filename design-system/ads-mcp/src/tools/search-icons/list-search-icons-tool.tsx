/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { searchIconsInputSchema } from './search-icons-input-schema';

export const listSearchIconsTool: Tool = {
	name: 'ads_search_icons',
	description: `Searches the bundled Atlassian Design System **icon** catalog. Returns JSON with **componentName**, **package**, and **usage** for each match.

WHEN TO USE:
**Choosing an icon** for a control, nav item, empty state, or illustration—find \`@atlaskit/icon\` import paths and usage notes. Prefer \`ads_plan\` when you also need tokens and components together.

Example:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Search ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchIconsInputSchema),
};
