import type { TokenValueMap } from './types';
import { typographyValueToToken } from './typography-value-to-token';

export function findTypographyTokenForValues(
	fontSize: string,
	lineHeight?: string,
): TokenValueMap[] {
	// Match 11px to 12px as this is what happened when transitioning from legacy to refreshed typography
	if (fontSize === '11px') {
		fontSize = '12px';
	}

	let matchingTokens = typographyValueToToken
		.filter((token) => token.values.fontSize === fontSize)
		// If lineHeight == 1, we don't match to a token
		.filter(() => (lineHeight === '1' ? false : true));

	return matchingTokens;
}
