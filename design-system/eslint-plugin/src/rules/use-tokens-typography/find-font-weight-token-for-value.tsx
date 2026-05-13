import { fontWeightTokens } from './font-weight-tokens';
import type { TokenValueMap } from './types';

export function findFontWeightTokenForValue(
	fontWeight: string,
	tokens: TokenValueMap[] = fontWeightTokens,
): TokenValueMap | undefined {
	if (fontWeight === 'normal') {
		fontWeight = '400';
	}

	// Match bold and 700 to 653 to match with bold weight refreshed typography
	if (fontWeight === 'bold' || fontWeight === '700') {
		fontWeight = '653';
	}

	return tokens.find((token) => token.values.fontWeight === fontWeight);
}
