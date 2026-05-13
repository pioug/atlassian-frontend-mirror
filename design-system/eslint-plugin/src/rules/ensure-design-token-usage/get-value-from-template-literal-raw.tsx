import type { Rule } from 'eslint';
import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { getValue } from './get-value';

/**
 * @example
 * ```js
 * `2 ${variable} 0`
 *
 * // results in [2, NaN, 0]
 * ```
 * ```js
 * const variable = 4;
 * `2 ${variable} 0`
 *
 * // results in [2, 4, 0]
 * ```
 */
export const getValueFromTemplateLiteralRaw = (
	node: EslintNode,
	context: Rule.RuleContext,
): string[] | string | null => {
	if (!isNodeOfType(node, `TemplateLiteral`)) {
		return null;
	}

	const combinedString = node.quasis
		.map((q, i) => {
			return `${q.value.raw}${node.expressions[i] ? getValue(node.expressions[i], context) : ''}`;
		})
		.join('')
		.trim();

	const fontFamily = /(sans-serif$)|(monospace$)/;
	if (fontFamily.test(combinedString)) {
		return combinedString;
	}

	return combinedString.split(' ');
};
