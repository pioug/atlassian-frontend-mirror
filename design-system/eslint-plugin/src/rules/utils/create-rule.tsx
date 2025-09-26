import { ESLintUtils } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

import {
	getCreateLintRule,
	getPathSafeName,
	type LintRule,
} from '@atlaskit/eslint-utils/create-rule';

/**
 * We are moving to our own small abstraction to create a lint rule that we have the power
 * to change and mold to our own needs.
 *
 * @see createLintRule
 *
 * @private
 * @deprecated
 */
export const createRule: <Options extends readonly unknown[], MessageIds extends string>({
	name,
	meta,
	...rule
}: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds>>) => ESLintUtils.RuleModule<
	MessageIds,
	Options
> = ESLintUtils.RuleCreator((name) => getRuleUrl(name));

/**
 * Tiny wrapped over the ESLint rule module type that ensures
 * there is a docs link to our ESLint plugin documentation page,
 * as well as improving type support.
 */
export const createLintRule: (rule: LintRule) => Rule.RuleModule = getCreateLintRule(getRuleUrl);

function getRuleUrl(ruleName: string) {
	const name = getPathSafeName(ruleName);
	return `https://atlassian.design/components/eslint-plugin-design-system/${name}/usage`;
}
