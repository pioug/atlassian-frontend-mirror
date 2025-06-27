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

	/** Light mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text': {
		borderRadius: token('space.050'),
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')}
		`,
		backgroundColor: token('color.background.accent.yellow.subtler'),
		color: token('color.text'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.selected-search-match': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.subtlest.pressed')}
		`,
		backgroundColor: token('color.background.accent.yellow.subtlest.pressed'),
	},

	/** Dark mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.search-match-dark': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')}
		`,
		backgroundColor: token('color.background.accent.yellow.bolder.pressed'),
		color: token('color.text.inverse'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.selected-search-match.search-match-dark': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.hovered')}
		`,
		backgroundColor: token('color.background.accent.yellow.bolder.hovered'),
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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.yellow.subtler')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.subtler.pressed')}`,
			},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.subtlest.pressed')}
			`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.yellow.subtlest.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.subtler.pressed')}`,
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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.yellow.subtler')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.subtler.pressed')} !important`,
			},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.subtlest.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.yellow.subtlest.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.subtler.pressed')} !important`,
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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.yellow.bolder.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.bolder')}`,
			},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.bolder.hovered')}
			`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.yellow.bolder.hovered')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.bolder')}`,
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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.yellow.bolder.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.bolder')} !important`,
			},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.yellow.bolder.hovered')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.yellow.bolder.hovered')}, 0px 0px 0px 5px ${token('color.background.accent.yellow.bolder')} !important`,
			},
	},

	/** Expand title match styles */

	/** Light mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			borderRadius: token('space.050'),
			padding: `${token('space.050')} 0`,
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.subtler')}
		`,
			backgroundColor: token('color.background.accent.yellow.subtler'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__title-input': {
				color: token('color.text'),
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.selected-search-match > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.subtlest.pressed')}
		`,
			backgroundColor: token('color.background.accent.yellow.subtlest.pressed'),
		},

	/** Dark mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.pressed')}
		`,
			backgroundColor: token('color.background.accent.yellow.bolder.pressed'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__title-input': {
				color: token('color.text.inverse'),
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.selected-search-match.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.yellow.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.yellow.bolder.hovered')}
		`,
			backgroundColor: token('color.background.accent.yellow.bolder.hovered'),
		},
});
