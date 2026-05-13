import { typographyPalette } from '@atlaskit/tokens/palettes-raw';
import { typography as typographyTokens } from '@atlaskit/tokens/tokens-raw';

import type { TokenValueMap } from './types';

export const typographyValueToToken: TokenValueMap[] = typographyTokens
	// we're filtering here to remove the `font` tokens.
	.filter((t) => t.attributes.group === 'typography')
	.filter((t) => t.cleanName.includes('font.heading') || t.cleanName.includes('font.body'))
	// Filtering out UNSAFE tokens that were meant for migrations, these tokens are deprecated and will be removed in the future
	.filter((t) => !t.cleanName.includes('UNSAFE'))
	.map((currentToken): TokenValueMap => {
		const individualValues = {
			fontSize: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.fontSize,
			)?.value,
			fontWeight: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.fontWeight,
			)?.value,
			lineHeight: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.lineHeight,
			)?.value,
		};

		return {
			tokenName: currentToken.cleanName,
			tokenValue: currentToken.value,
			values: individualValues,
		};
	});
