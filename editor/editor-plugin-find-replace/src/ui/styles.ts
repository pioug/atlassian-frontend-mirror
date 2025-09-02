/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable */

import { css } from '@emotion/react';

import { N40A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { expandClassNames } from '@atlaskit/editor-common/styles';

export const searchMatchClass = 'search-match';
export const searchMatchTextClass = 'search-match-text';
export const selectedSearchMatchClass = 'selected-search-match';

export const blockSearchMatchClass = 'search-match-block';
export const selectedBlockSearchMatchClass = 'search-match-block-selected';

export const darkModeSearchMatchClass = 'search-match-dark';
export const searchMatchExpandTitleClass = 'search-match-expand-title';

const inlineCardSelector = '.loader-wrapper>a';
const inlineCardWithHoverPreviewSelector = '.hover-card-trigger-wrapper>a';
const statusSelector = '.lozenge-wrapper';
const mentionSelector = '.editor-mention-primitive';
const dateSelector = '.date-lozenger-container>span';

export const findReplaceStyles = css({
	[`.${searchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
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

	/** Light mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchTextClass}`]: {
		borderRadius: token('space.050'),
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
		// we need to use !important here as we need to override inline selection styles
		backgroundColor: `${token('color.background.accent.magenta.subtler')} !important`,
		color: token('color.text'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchTextClass}.${selectedSearchMatchClass}`]: {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
		// we need to use !important here as we need to override inline selection styles
		backgroundColor: `${token('color.background.accent.magenta.subtlest.pressed')} !important`,
	},

	/** Dark mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchTextClass}.${darkModeSearchMatchClass}`]: {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
		backgroundColor: `${token('color.background.accent.magenta.bolder.pressed')}`,
		color: token('color.text.inverse'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchTextClass}.${selectedSearchMatchClass}.${darkModeSearchMatchClass}`]: {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
		backgroundColor: `${token('color.background.accent.magenta.bolder.hovered')}`,
	},

	/** Block match styles */

	/** Light mode */

	/** Without node selection */
	[`.${blockSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
			`,
		},

		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.subtler.pressed')}`,
			},
	},
	[`.${blockSearchMatchClass}.${selectedBlockSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')}
			`,
		},

		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.subtler.pressed')}`,
			},
	},

	/** With node selection */

	// We need to include the embedCardView and statusView classes to have higher specificity than the default selected state styles
	[`.${blockSearchMatchClass}.embedCardView-content-wrap.ak-editor-selected-node,
	  .${blockSearchMatchClass}.statusView-content-wrap.ak-editor-selected-node,
	  .${blockSearchMatchClass}.mentionView-content-wrap.ak-editor-selected-node,
	  .${blockSearchMatchClass}.inlineCardView-content-wrap.ak-editor-selected-node,
	  .${blockSearchMatchClass}.ak-editor-selected-node`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.subtler.pressed')}`,
			},
	},
	[`.${blockSearchMatchClass}.${selectedBlockSearchMatchClass}.ak-editor-selected-node`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},

		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.subtler.pressed')}`,
			},
	},

	/** Dark mode */
	/** Without node selection */
	[`.${blockSearchMatchClass}.${darkModeSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
			`,
		},

		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}`,
			},
	},

	[`.${blockSearchMatchClass}.${selectedBlockSearchMatchClass}.${darkModeSearchMatchClass}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
		},

		[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
			{
				boxShadow: `0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}`,
			},
	},

	/** With node selection */
	[`.${blockSearchMatchClass}.${darkModeSearchMatchClass}.ak-editor-selected-node, .${blockSearchMatchClass}.${darkModeSearchMatchClass}.mentionView-content-wrap.ak-editor-selected-node`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},

			[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}`,
				},
		},

	[`.${blockSearchMatchClass}.${selectedBlockSearchMatchClass}.${darkModeSearchMatchClass}.ak-editor-selected-node`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},

			[`${inlineCardSelector}, ${inlineCardWithHoverPreviewSelector}, ${statusSelector}, ${mentionSelector}, ${dateSelector}`]:
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}, 0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')}, 0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}`,
				},
		},

	/** Expand title match styles */

	/** Light mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchExpandTitleClass} > .${expandClassNames.titleContainer} > .${expandClassNames.inputContainer}`]:
		{
			borderRadius: token('space.050'),
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
			backgroundColor: token('color.background.accent.magenta.subtler'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			[`.${expandClassNames.titleInput}`]: {
				color: token('color.text'),
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchExpandTitleClass}.${selectedSearchMatchClass} > .${expandClassNames.titleContainer} > .${expandClassNames.inputContainer}`]:
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.subtler.pressed')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
			backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
		},

	/** Dark mode */

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchExpandTitleClass}.${darkModeSearchMatchClass} > .${expandClassNames.titleContainer} > .${expandClassNames.inputContainer}`]:
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
			backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			[`.${expandClassNames.titleInput}`]: {
				color: token('color.text.inverse'),
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	[`.${searchMatchExpandTitleClass}.${selectedSearchMatchClass}.${darkModeSearchMatchClass} > .${expandClassNames.titleContainer} > .${expandClassNames.inputContainer}`]:
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
			backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
		},
});
