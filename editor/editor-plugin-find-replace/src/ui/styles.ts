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
export const blockSearchMatchClass = 'search-match-block';
export const darkModeSearchMatchClass = 'search-match-dark';

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

export const findReplaceStylesNew = css({
	/** Text match styles */
	[`.${searchMatchClass}`]: {
		borderRadius: '3px',
		backgroundColor: token('color.background.accent.teal.subtlest'),
		boxShadow: `${token('elevation.shadow.raised', '0 1px 1px 0 rgba(9, 30, 66, 0.25), 0 0 1px 0 rgba(9, 30, 66, 0.31)')}, inset 0 0 0 1px ${token('color.border.input')}`,
	},
	[`.${selectedSearchMatchClass}`]: {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},

	/** Block match styles */

	/** Light mode */

	/** Without node selection */
	[`.${blockSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')}
			`,
		},
	},
	[`.${selectedSearchMatchClass}.${blockSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.subtlest.pressed')}
			`,
		},
	},

	/** With node selection */
	[`.${blockSearchMatchClass}.ak-editor-selected-node`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
	},
	[`.${selectedSearchMatchClass}.${blockSearchMatchClass}.ak-editor-selected-node`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.subtlest.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
	},

	/** Dark mode */

	/** Without node selection */
	[`.${blockSearchMatchClass}.${darkModeSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')}
			`,
		},
	},

	[`.${selectedSearchMatchClass}.${blockSearchMatchClass}.${darkModeSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.bolder.hovered')}
			`,
		},
	},

	/** With node selection */
	[`.${blockSearchMatchClass}.${darkModeSearchMatchClass}.ak-editor-selected-node`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
	},
	[`.${selectedSearchMatchClass}.${blockSearchMatchClass}.${darkModeSearchMatchClass}.ak-editor-selected-node`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.bolder.hovered')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},
		},
});
