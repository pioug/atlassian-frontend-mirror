import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { isDecendantOfGlobalToken } from '../utils/is-decendant-of-global-token';

import type { RuleConfig } from './types';

type Suggestion = {
	shouldReturnSuggestion: boolean;
} & Rule.SuggestionReportDescriptor;

const filterSuggestion = ({ shouldReturnSuggestion }: Suggestion) => shouldReturnSuggestion;

export const getTokenSuggestion = (
	node: Rule.Node,
	reference: string,
	config: RuleConfig,
): Suggestion[] =>
	[
		{
			shouldReturnSuggestion:
				!isDecendantOfGlobalToken(node) && config.shouldEnforceFallbacks === false,
			desc: `Convert to token`,
			fix: (fixer: Rule.RuleFixer) =>
				fixer.replaceText(
					isNodeOfType(node.parent, 'MemberExpression') ? node.parent : node,
					isNodeOfType(node.parent, 'JSXAttribute') ? `{token('')}` : `token('')`,
				),
		},
		{
			shouldReturnSuggestion:
				!isDecendantOfGlobalToken(node) && config.shouldEnforceFallbacks === true,
			desc: `Convert to token with fallback`,
			fix: (fixer: Rule.RuleFixer) =>
				fixer.replaceText(
					isNodeOfType(node.parent, 'MemberExpression') ? node.parent : node,
					isNodeOfType(node.parent, 'JSXAttribute')
						? `{token('', ${reference})}`
						: `token('', ${reference})`,
				),
		},
	].filter(filterSuggestion);
