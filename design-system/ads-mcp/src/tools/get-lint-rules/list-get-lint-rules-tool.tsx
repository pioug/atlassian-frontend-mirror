/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { getLintRulesInputSchema } from './get-lint-rules-input-schema';

export const listGetLintRulesTool: {
	name: string;
	description: string;
	annotations: {
		title: string;
		readOnlyHint: boolean;
		destructiveHint: boolean;
		idempotentHint: boolean;
		openWorldHint: boolean;
	};
	inputSchema: {
		[x: string]: unknown;
		type: 'object';
		properties?: { [x: string]: unknown } | undefined;
		required?: string[] | undefined;
	};
} = {
	name: 'ads_get_lint_rules',
	description: `Returns documentation for **Constellation** (Atlassian Design System) ESLint rules shipped with this MCP—rule purpose, examples, and fixes where available.

WHAT YOU GET:
- No \`terms\`: JSON array of all rule payloads.
- With \`terms\`: fuzzy search (or exact rule name when \`exactName\` is true); JSON for one or more matching rules.

WHEN TO USE:
Explaining or fixing an ESLint message from ADS rules (e.g. \`icon-label\`, \`ensure-proper-xcss-usage\`, \`no-deprecated-apis\`), or browsing rule docs without opening the repo. Prefer this over guessing from rule id alone.

This tool does not run ESLint; it only returns bundled documentation.`,
	annotations: {
		title: 'Get ADS ESLint rule docs',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getLintRulesInputSchema),
};
