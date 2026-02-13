/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

import {
	lintRulesStructuredContent,
	type LintRuleStructuredContent,
} from './lint-rules-structured-content.codegen';

export const getLintRulesInputSchema: z.ZodObject<{
	terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
	limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	exactName: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}> = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'An array of search terms to find lint rules by name or description, eg. `["icon-label", "xcss", "design token"]`. If empty or not provided, returns all lint rules.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe('Maximum number of results per search term in the array (default: 1)')
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'Enable to explicitly search lint rules by the exact rule name match (when you know the rule name, but need more details)',
		)
		.optional(),
});

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
	description: `Get Atlassian Design System ESLint rule documentation (constellation) with optional search functionality.

- If search parameters are provided, searches for lint rules matching the criteria.
- If no search parameters are provided, returns all lint rules.

Example: use this tool to look up documentation for rules like icon-label, ensure-proper-xcss-usage, or no-deprecated-apis.`,
	annotations: {
		title: 'Get ADS lint rules',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getLintRulesInputSchema),
};

export const getLintRulesTool = async (
	params: z.infer<typeof getLintRulesInputSchema>,
): Promise<CallToolResult> => {
	const { terms = [], limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);
	const ruleDocs = lintRulesStructuredContent;

	// If no search terms provided, return all rules formatted as Markdown
	if (searchTerms.length === 0) {
		const allRulesMarkdown = ruleDocs
			.map((rule: LintRuleStructuredContent) => rule.content)
			.join('\n\n');
		return {
			content: [
				{
					type: 'text',
					text: allRulesMarkdown,
				},
			],
		};
	}

	// Search logic (similar to get-icons / get-tokens)
	if (exactName) {
		const exactNameMatches = searchTerms
			.map((term) => {
				return ruleDocs.find(
					(rule: LintRuleStructuredContent) => rule.ruleName.toLowerCase() === term.toLowerCase(),
				);
			})
			.filter((rule): rule is LintRuleStructuredContent => rule !== undefined);

		const formattedRules = exactNameMatches
			.map((rule: LintRuleStructuredContent) => rule.content)
			.join('\n\n');
		return {
			content: [
				{
					type: 'text',
					text: formattedRules,
				},
			],
		};
	}

	// use Fuse.js to fuzzy-search for the rules
	const fuse = new Fuse(ruleDocs, {
		keys: [
			{
				name: 'ruleName',
				weight: 3,
			},
			{
				name: 'description',
				weight: 2,
			},
			{
				name: 'content',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	const results = searchTerms
		.map((term) => {
			const exactNameMatch = ruleDocs.find(
				(rule: LintRuleStructuredContent) => rule.ruleName.toLowerCase() === term.toLowerCase(),
			);
			if (exactNameMatch) {
				return [{ item: exactNameMatch }];
			}
			return fuse.search(term).slice(0, limit);
		})
		.flat();

	// Remove duplicates based on ruleName
	const uniqueResults = results.filter((result, index, arr) => {
		return (
			arr.findIndex(
				(r) =>
					(r.item as LintRuleStructuredContent).ruleName ===
					(result.item as LintRuleStructuredContent).ruleName,
			) === index
		);
	});

	const matchedRules = uniqueResults.map((result) => result.item as LintRuleStructuredContent);
	const formattedRules = matchedRules
		.map((rule: LintRuleStructuredContent) => rule.content)
		.join('\n\n');

	return {
		content: [
			{
				type: 'text',
				text: formattedRules,
			},
		],
	};
};
