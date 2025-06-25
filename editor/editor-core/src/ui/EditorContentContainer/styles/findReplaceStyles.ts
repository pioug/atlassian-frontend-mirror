// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const findReplaceStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match': {
		borderRadius: '3px',
		backgroundColor: token('color.background.accent.teal.subtlest'),
		boxShadow: `${token('elevation.shadow.raised', '0 1px 1px 0 rgba(9, 30, 66, 0.25), 0 0 1px 0 rgba(9, 30, 66, 0.31)')}, inset 0 0 0 1px ${token('color.border.input')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.selected-search-match': {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const findReplaceStylesNew = css({
	/** Text match styles */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match': {
		borderRadius: '3px',
		backgroundColor: token('color.background.accent.teal.subtlest'),
		boxShadow: `${token('elevation.shadow.raised', '0 1px 1px 0 rgba(9, 30, 66, 0.25), 0 0 1px 0 rgba(9, 30, 66, 0.31)')}, inset 0 0 0 1px ${token('color.border.input')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-selected': {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},

	/** Block match styles */

	/** Light mode */

	/** Without node selection */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')}
			`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-selected.search-match-block': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.subtlest.pressed')}
			`,
		},
	},

	/** With node selection */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-selected.search-match-block.ak-editor-selected-node': {
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')}
			`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-selected.search-match-block.search-match-dark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.bolder.hovered')}
			`,
		},
	},

	/** With node selection */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-selected.search-match-block.search-match-dark.ak-editor-selected-node': {
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
