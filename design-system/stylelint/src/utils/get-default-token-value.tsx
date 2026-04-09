import type valueParser from 'postcss-value-parser';

import tokenDefaultValues from '@atlaskit/tokens/token-default-values';
import tokenNames from '@atlaskit/tokens/token-names';

const invertedTokenNames = Object.entries(tokenNames).reduce<
	Record<string, keyof typeof tokenNames>
>((acc, [name, cssName]) => {
	acc[cssName] = name as keyof typeof tokenNames;
	return acc;
}, {});

export const getDefaultTokenValue = (node: valueParser.Node): string | null => {
	const tokenName = invertedTokenNames[node.value];
	if (!tokenName) {
		return null;
	}
	const defaultValue = tokenDefaultValues[tokenName];
	return defaultValue || null;
};
