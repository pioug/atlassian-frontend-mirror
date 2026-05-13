import type { Rule } from 'eslint';
import { type TaggedTemplateExpression } from 'eslint-codemod-utils';

import { cleanComments } from './clean-comments';
import { getRawExpression } from './get-raw-expression';
import { getValue } from './get-value';
import { splitCssProperties } from './split-css-properties';
import type { ProcessedCSSLines } from './types';

/**
 * Returns an array of tuples representing a processed css within `TaggedTemplateExpression` node.
 * Each element of the array is a tuple `[string, string]`,
 * where the first element is the processed css line with computed values
 * and the second element of the tuple is the original css line from source.
 * @param node TaggedTemplateExpression node.
 * @param context Rule.RuleContext.
 * @example
 * ```
 * `[['padding: 8', 'padding: ${gridSize()}'], ['margin: 6', 'margin: 6px' ]]`
 * ```
 */
export function processCssNode(
	node: TaggedTemplateExpression & Rule.NodeParentExtension,
	context: Rule.RuleContext,
): ProcessedCSSLines | undefined {
	const combinedString = node.quasi.quasis
		.map((q, i) => {
			return `${q.value.raw}${
				node.quasi.expressions[i] ? getValue(node.quasi.expressions[i], context) : ''
			}`;
		})
		.join('');

	const rawString = node.quasi.quasis
		.map((q, i) => {
			return `${q.value.raw}${
				node.quasi.expressions[i]
					? getRawExpression(node.quasi.expressions[i], context)
						? `\${${getRawExpression(node.quasi.expressions[i], context)}}`
						: null
					: ''
			}`;
		})
		.join('');
	const cssProperties = splitCssProperties(cleanComments(combinedString));
	const unalteredCssProperties = splitCssProperties(cleanComments(rawString));
	if (cssProperties.length !== unalteredCssProperties.length) {
		// this means something went wrong with the parsing, the original lines can't be reconciled with the processed lines
		return undefined;
	}
	return cssProperties.map((cssProperty, index): [string, string] => [
		cssProperty,
		unalteredCssProperties[index],
	]);
}
