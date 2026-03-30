import type { Rule } from 'eslint';

import {
	getCreateLintRule,
	getPathSafeName,
	type LintRule,
} from '@atlaskit/eslint-utils/create-rule';

export const createLintRule: (rule: LintRule) => Rule.RuleModule = getCreateLintRule(getRuleUrl);

export function getRuleUrl(ruleName: string) {
	const name = getPathSafeName(ruleName);
	return `https://atlassian.design/components/eslint-plugin-volt-strict-mode/${name}/usage`;
}
