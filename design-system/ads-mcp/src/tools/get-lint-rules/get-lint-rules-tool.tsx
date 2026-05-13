/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import type { z } from 'zod';

import { cleanQuery } from '../../helpers/clean-query';

import type { getLintRulesInputSchema } from './get-lint-rules-input-schema';
import {
	lintRulesMcpStructuredContent,
	type LintRuleStructuredContent,
} from './lint-rules-structured-content.codegen';

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
