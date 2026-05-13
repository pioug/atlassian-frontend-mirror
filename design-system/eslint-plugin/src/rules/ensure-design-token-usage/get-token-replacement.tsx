import type { SimpleCallExpression, StringableASTNode } from 'eslint-codemod-utils';

import { findTokenNameByPropertyValue } from './find-token-name-by-property-value';
import { getTokenNodeForValue } from './get-token-node-for-value';
import { normaliseValue } from './normalise-value';

/**
 * Returns a stringifiable node with the token expression corresponding to its matching token.
 * If no token found for the pair the function returns undefined.
 * @param propertyName string camelCased css property.
 * @param value The computed value e.g '8px' -> '8'.
 */
export function getTokenReplacement(
	propertyName: string,
	value: string,
): StringableASTNode<SimpleCallExpression> | undefined {
	const tokenName = findTokenNameByPropertyValue(propertyName, value);

	if (!tokenName) {
		return undefined;
	}

	const fallbackValue = normaliseValue(propertyName, value);

	return getTokenNodeForValue(propertyName, fallbackValue);
}
