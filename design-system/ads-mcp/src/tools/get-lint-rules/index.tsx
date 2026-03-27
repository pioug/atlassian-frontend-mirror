/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

import {
	lintRulesMcpStructuredContent,
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
			'Search terms matched against rule name, description, and docs body (fuzzy unless \`exactName\` is true). Example: `["icon-label", "xcss", "design token"]`. Omit or empty: return **all** rules as JSON.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe(
			'Max matches **per term** when searching (default 1). Not used when returning all rules.',
		)
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'If true, resolve each term by **exact** ESLint rule name (case-insensitive). If false, fuzzy search across name, description, and content.',
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

export const getLintRulesTool = async (
	params: z.infer<typeof getLintRulesInputSchema>,
): Promise<CallToolResult> => {
	const { terms = [], limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);
	const ruleDocs = lintRulesMcpStructuredContent;

	// If no search terms provided, return all rules as JSON array
	if (searchTerms.length === 0) {
		const payload = ruleDocs.map((rule: LintRuleStructuredContent) => rule.content);
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(payload),
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

		const payload =
			exactNameMatches.length === 1
				? exactNameMatches[0].content
				: exactNameMatches.map((rule: LintRuleStructuredContent) => rule.content);
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(payload),
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
	const payload =
		matchedRules.length === 1
			? matchedRules[0].content
			: matchedRules.map((rule: LintRuleStructuredContent) => rule.content);

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(payload),
			},
		],
	};
};
