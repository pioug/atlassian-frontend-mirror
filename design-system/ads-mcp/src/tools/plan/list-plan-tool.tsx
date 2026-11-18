/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';
import { planInputSchema } from './plan-input-schema';

export const listPlanTool: Tool = {
	name: 'ads_plan',
	description: `Runs **ads_search_tokens**, **ads_search_icons**, **ads_search_components**, and optionally **atlaskit_search_components** in one call and returns a single JSON payload (each section only if that list was non-empty). Use this as the default way to discover ADS **tokens**, **icons**, and **components** for a UI task. Component results preserve optional \`references.figmaUrl\`; for Figma work, follow the canonical-source and property-verification guidance in \`ads_search_components\`.

WHEN TO USE:
**Implementing or iterating on a UI**—new screen, feature, or polish—and you need candidate **token** names, **icon** imports, and **ADS component** packages/props in one pass. Also use when exploring ADS building blocks before you write code.

ADS-FIRST ROUTING:
Use \`components\` for canonical ADS components. Use \`atlaskitComponents\` only as explicit fallback research for public \`@atlaskit/*\` packages outside the ADS catalog, or after ADS component search has no useful match. This tool does not auto-populate \`atlaskitComponents\` from \`components\`.

Each of \`tokens\`, \`icons\`, \`components\`, and \`atlaskitComponents\` accepts a search term or an array of terms. A string is treated as one search term, equivalent to a one-item array. Omit unused fields or use \`[]\`; omitted fields default to empty arrays. At least one field must contain a nonblank search term. Categories containing only blank terms are skipped.

Prefer supplying **multiple** terms per non-empty array when you know them—broader queries improve recall. Some queries return no rows where metadata is thin; try alternate wording.

This is equivalent to calling the individual search tools; there are no extra merge semantics beyond concatenating results.

Example request:
\`\`\`json
{
	"tokens": ["spacing", "inverted text", "background primary", "animation"],
	"icons": ["search", "folder", "user"],
	"components": ["button", "input", "select", "heading"],
	"atlaskitComponents": ["editor-core", "onboarding", "page-layout"]
}
\`\`\`

Example token usage:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\`

Example icon usage:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Search ADS tokens, icons, and components to plan what to build',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(planInputSchema),
};
