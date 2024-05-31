/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable */

// TODO: https://product-fabric.atlassian.net/browse/DSP-4290
import { css } from '@emotion/react';

import { B200, B75, N40A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const searchMatchClass = 'search-match';
export const selectedSearchMatchClass = 'selected-search-match';

export const findReplaceStyles = css({
	[`.${searchMatchClass}`]: getBooleanFF('platform.editor.a11y-find-replace')
		? {
				borderRadius: '3px',
				backgroundColor: token('color.background.accent.teal.subtlest', '#E7F9FF'),
				boxShadow:
					token('elevation.shadow.raised', `0 1px 1px 0 ${N50A}, 0 0 1px 0 ${N60A}`) +
					', inset 0 0 0 1px ' +
					token('color.border.input', `${N40A}`),
			}
		: {
				backgroundColor: B75,
			},
	[`.${selectedSearchMatchClass}`]: getBooleanFF('platform.editor.a11y-find-replace')
		? {
				backgroundColor: token('color.background.accent.teal.subtle', '#6CC3E0'),
			}
		: {
				backgroundColor: B200,
				color: 'white',
			},
});
