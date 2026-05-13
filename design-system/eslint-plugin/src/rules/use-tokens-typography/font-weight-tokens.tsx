import { typography as typographyTokens } from '@atlaskit/tokens/tokens-raw';

import type { TokenValueMap } from './types';

export const fontWeightTokens: TokenValueMap[] = typographyTokens
	.filter((token) => token.attributes.group === 'fontWeight')
	.map((token) => {
		return {
			tokenName: token.cleanName,
			tokenValue: token.value,
			values: {
				fontWeight: token.value,
			},
		};
	});
