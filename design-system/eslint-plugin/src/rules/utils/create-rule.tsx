import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleUrl } from './get-rule-url';

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
