/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable */

import { css } from '@emotion/react';

import { N40A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const searchMatchClass = 'search-match';
export const selectedSearchMatchClass = 'selected-search-match';

export const findReplaceStyles = css({
	[`.${searchMatchClass}`]: {
		borderRadius: '3px',
		backgroundColor: token('color.background.accent.teal.subtlest', '#E7F9FF'),
		boxShadow:
			token('elevation.shadow.raised', `0 1px 1px 0 ${N50A}, 0 0 1px 0 ${N60A}`) +
			', inset 0 0 0 1px ' +
			token('color.border.input', `${N40A}`),
	},
	[`.${selectedSearchMatchClass}`]: {
		backgroundColor: token('color.background.accent.teal.subtle', '#6CC3E0'),
	},
});
