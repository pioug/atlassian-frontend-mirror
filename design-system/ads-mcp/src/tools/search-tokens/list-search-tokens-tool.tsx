/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { searchTokensInputSchema } from './search-tokens-input-schema';

export const listSearchTokensTool: Tool = {
	name: 'ads_search_tokens',
	description: `Searches Atlassian Design System **design tokens** from bundled metadata. Returns JSON objects with **name** and **exampleValue** for each match (search also considers description, usage guidelines, and CSS property hints in metadata).

WHEN TO USE:
**Styling or theming in code**—you need the right \`token('…')\` names for colors, space, typography, etc. Use during layout and visual work when tokens must match ADS. Prefer \`ads_plan\` when you also need icons and components in the same step.

Example:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\``,
	annotations: {
		title: 'Search ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchTokensInputSchema),
};
