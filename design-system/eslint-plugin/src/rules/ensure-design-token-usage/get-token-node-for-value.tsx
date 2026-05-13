import {
	callExpression,
	identifier,
	literal,
	type SimpleCallExpression,
	type StringableASTNode,
} from 'eslint-codemod-utils';

import { findTokenNameByPropertyValue } from './find-token-name-by-property-value';

/**
 * Returns a token node for a given value including fallbacks.
 * @param propertyName camelCase CSS property
 * @param value string representing pixel value, or font family, or number representing font weight
 * @example
 * ```
 * propertyName: padding, value: '8px' => token('space.100', '8px')
 * propertyName: fontWeight, value: 400 => token('font.weight.regular', '400')
 * ```
 */
export function getTokenNodeForValue(
	propertyName: string,
	value: string,
): StringableASTNode<SimpleCallExpression> {
	const token = findTokenNameByPropertyValue(propertyName, value);
	const fallbackValue =
		propertyName === 'fontFamily' ? { value: `${value}`, raw: `\`${value}\`` } : `${value}`;

	return callExpression({
		callee: identifier({ name: 'token' }),
		arguments: [
			literal({
				value: `'${token ?? ''}'`,
			}),
			literal(fallbackValue),
		],
		optional: false,
	});
}
