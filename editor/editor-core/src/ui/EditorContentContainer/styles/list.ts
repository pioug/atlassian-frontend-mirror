// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const akEditorLineHeight = 1.714;
// copied from packages/editor/editor-common/src/styles/shared/smart-card.ts
const BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap';

// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const blockNodesVerticalMargin = '0.75rem';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const listsStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		/* =============== INDENTATION SPACING ========= */

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ul, ol': {
			boxSizing: 'border-box',
			paddingLeft: `var(--ed--list--item-counter--padding, 24px)`,
		},

		// Firefox does not handle empty block element inside li tag.
		// If there is not block element inside li tag,	then firefox sets inherited height to li
		// However, if there is any block element and if it's empty	(or has empty inline element) then
		// firefox sets li tag height to zero.
		//
		// More details at
		// https://product-fabric.atlassian.net/wiki/spaces/~455502413/pages/3149365890/ED-14110+Investigation
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-firefox': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'ul, ol': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'li p:empty, li p > span:empty': {
					display: 'inline-block',
				},
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-ol, .ak-ul': {
			// Ensures list item content adheres to the list's margin instead
			// of filling the entire block row. This is important to allow
			// clicking interactive elements which are floated next to a list.
			//
			// For some history and context on this block, see PRs related to tickets.:
			// @see ED-6551 - original issue.
			// @see ED-7015 - follow up issue.
			// @see ED-7447 - flow-root change.
			//
			// @see https://css-tricks.com/display-flow-root/
			//
			// For older browsers the do not support flow-root. */
			// stylelint-disable declaration-block-no-duplicate-properties */
			display: 'flow-root',
			/* stylelint-enable declaration-block-no-duplicate-properties */
		},

		/* =============== INDENTATION AESTHETICS ========= */

		// We support nested lists up to six levels deep.

		/*  ======== LEGACY LISTS ======== */

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ul, ul ul ul ul': {
			listStyleType: 'disc',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ul ul, ul ul ul ul ul': {
			listStyleType: 'circle',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ul ul ul, ul ul ul ul ul ul': {
			listStyleType: 'square',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ol, ol ol ol ol': {
			listStyleType: 'decimal',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ol ol, ol ol ol ol ol': {
			listStyleType: 'lower-alpha',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ol ol ol, ol ol ol ol ol ol': {
			listStyleType: 'lower-roman',
		},

		/* ======== PREDICTABLE LISTS ======== */

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ol[data-indent-level='1'], ol[data-indent-level='4']": {
			listStyleType: 'decimal',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ol[data-indent-level='2'], ol[data-indent-level='5']": {
			listStyleType: 'lower-alpha',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ol[data-indent-level='3'], ol[data-indent-level='6']": {
			listStyleType: 'lower-roman',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ul[data-indent-level='1'], ul[data-indent-level='4']": {
			listStyleType: 'disc',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ul[data-indent-level='2'], ul[data-indent-level='5']": {
			listStyleType: 'circle',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"ul[data-indent-level='3'], ul[data-indent-level='6']": {
			listStyleType: 'square',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		li: {
			position: 'relative',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'& > p:not(:first-child)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				margin: `${token('space.050', '4px')} 0 0 0`,
			},

			/* In SSR the above rule will apply to all p tags because first-child would be a style tag.
				The following rule resets the first p tag back to its original margin
				defined in packages/editor/editor-common/src/styles/shared/paragraph.ts */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'& > style:first-child + p': {
				marginTop: blockNodesVerticalMargin,
			},
		},
	},
});

/* This prevents https://product-fabric.atlassian.net/browse/ED-20924 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const listsStylesSafariFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li::before`]: {
		content: '" "',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		lineHeight: akEditorLineHeight,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > p:first-child, .ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > .code-block:first-child, .ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > .ProseMirror-gapcursor:first-child + .code-block`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginTop: `-${akEditorLineHeight}em !important`,
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
export const EDITOR_LIST_DENSE_GAP = `max(0px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (4 / 3)))`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const getDenseListStyles = (baseFontSize?: number): SerializedStyles => {
	if (!baseFontSize || baseFontSize === akEditorFullPageDefaultFontSize) {
		return css({});
	}

	return css({
		/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */
		'.ProseMirror': {
			// Adjacent list items
			'li + li': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				marginTop: EDITOR_LIST_DENSE_GAP,
			},
			// Nested lists directly under an li (unordered and ordered)
			'li > ul, li > ol, .ak-ul li > ul, .ak-ul li > ol, .ak-ol li > ul, .ak-ol li > ol': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				marginTop: EDITOR_LIST_DENSE_GAP,
			},
		},
	});
};
