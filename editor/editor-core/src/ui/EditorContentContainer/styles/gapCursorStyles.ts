// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, keyframes, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const gapCursorBlink = keyframes({
	'from, to': {
		opacity: 0,
	},
	'50%': {
		opacity: 1,
	},
});

export const hideCaretModifier = 'ProseMirror-hide-gapcursor';
const gapCursorSelector = '.ProseMirror-gapcursor';
const prosemirrorwidgetNotBlock =
	'.ProseMirror-widget:not([data-blocks-decoration-container="true"]):not([data-blocks-drag-handle-container="true"]):not([data-blocks-quick-insert-container="true"])';
const wrapLeft = '[layout="wrap-left"]';
const wrapRight = '[layout="wrap-right"]';

const fixVerticalAlignmentSelector = `
	&:first-of-type + ul,
	&:first-of-type + span + ul,
	&:first-of-type + ol,
	&:first-of-type + span + ol,
	&:first-of-type + pre,
	&:first-of-type + span + pre,
	&:first-of-type + blockquote,
	&:first-of-type + span + blockquote
`;

const twoImagesSideBySideFixSelector = `
  ${gapCursorSelector}${wrapLeft} + span + ${wrapLeft},
  ${gapCursorSelector}${wrapRight} + span + ${wrapRight},
  ${gapCursorSelector} + ${wrapLeft} + ${wrapRight},
  ${gapCursorSelector} + ${wrapLeft} + span + ${wrapRight},
  ${gapCursorSelector} + ${wrapRight} + ${wrapLeft},
  ${gapCursorSelector} + ${wrapRight} + span + ${wrapLeft},
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight},
  ${wrapLeft} + ${gapCursorSelector} + span ${wrapRight},
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft},
  ${wrapRight} + ${gapCursorSelector} + span + ${wrapLeft},
  ${wrapLeft} + ${gapCursorSelector}`;

const marginFixSelector = `
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight} > div,
  ${wrapLeft} + ${gapCursorSelector} + span + ${wrapRight} > div,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft} > div,
  ${wrapRight} + ${gapCursorSelector} + span + ${wrapLeft} > div,
  ${gapCursorSelector} + ${wrapRight} + ${wrapLeft} > div,
  ${gapCursorSelector} + ${wrapRight} + span + ${wrapLeft} > div,
  ${gapCursorSelector} + ${wrapLeft} + ${wrapRight} > div,
  ${gapCursorSelector} + ${wrapLeft} + span + ${wrapRight} > div`;

const floatLeftFixSelector = `
  ${wrapLeft} + ${gapCursorSelector},
  ${wrapRight} + ${gapCursorSelector}`;

const afterPresudoSelector = `
  ${gapCursorSelector} + ${wrapLeft} + span + ${wrapRight}::after,
  ${gapCursorSelector} + ${wrapRight} + span + ${wrapLeft}::after,
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight}::after,
  ${wrapLeft} + ${gapCursorSelector} + span + ${wrapRight}::after,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft}::after,
  ${wrapRight} + ${gapCursorSelector} + span + ${wrapLeft}::after`;

const marginDeepChildrenFixSelector = `
${wrapLeft} + ${gapCursorSelector} + ${wrapRight} + *,
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight} + span + *,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft} + *,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft} + span + *,
  ${wrapLeft} + ${gapCursorSelector} + span + ${wrapRight} + *,
  ${wrapRight} + ${gapCursorSelector} + span + ${wrapLeft} + *,
  ${gapCursorSelector} + ${wrapLeft} + span + ${wrapRight} + *,
  ${gapCursorSelector} + ${wrapRight} + span + ${wrapLeft} + *,
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight} + * > *,
  ${wrapLeft} + ${gapCursorSelector} + ${wrapRight} + span + * > *,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft} + * > *,
  ${wrapRight} + ${gapCursorSelector} + ${wrapLeft} + span + * > *,
  ${wrapLeft} + ${gapCursorSelector} + span + ${wrapRight} + * > *,
  ${wrapRight} + ${gapCursorSelector} + span + ${wrapLeft} + * > *,
  ${gapCursorSelector} + ${wrapLeft} + span + ${wrapRight} + * > *,
  ${gapCursorSelector} + ${wrapRight} + span + ${wrapLeft} + * > *,
  ${prosemirrorwidgetNotBlock} + ${gapCursorSelector} + *,
  ${prosemirrorwidgetNotBlock} + ${gapCursorSelector} + span + *`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const gapCursorStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${hideCaretModifier}`]: {
			// Clean this up with platform_synced_block_patch_4
			caretColor: 'transparent',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorSelector]: {
			display: 'none',
			pointerEvents: 'none',
			position: 'relative',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& span': {
				caretColor: 'transparent',
				position: 'absolute',
				height: '100%',
				width: '100%',
				display: 'block',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& span::after': {
				animation: `1s ${gapCursorBlink} step-start infinite`,
				borderLeft: '1px solid',
				content: "''",
				display: 'block',
				position: 'absolute',
				top: 0,
				height: '100%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.-left span::after': {
				left: token('space.negative.050', '-4px'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.-right span::after': {
				right: token('space.negative.050', '-4px'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& span[layout="full-width"], & span[layout="wide"], & span[layout="fixed-width"]': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: '50%',
				transform: 'translateX(-50%)',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`&${wrapRight}`]: {
				float: 'right',
			},

			/* fix vertical alignment of gap cursor */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			[fixVerticalAlignmentSelector]: {
				marginTop: 0,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ProseMirror-focused ${gapCursorSelector}`]: {
			display: 'block',
			borderColor: 'transparent',
		},
	},

	/* This hack below is for two images aligned side by side */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[twoImagesSideBySideFixSelector]: {
		clear: 'none',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[marginFixSelector]: {
		marginRight: 0,
		marginLeft: 0,
		marginBottom: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[floatLeftFixSelector]: {
		float: 'left',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[afterPresudoSelector]: {
		visibility: 'hidden',
		display: 'block',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 0,
		content: "' '",
		clear: 'both',
		height: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[marginDeepChildrenFixSelector]: {
		marginTop: 0,
	},
});

// Hide native caret when gap cursor widget is present (no class toggle = no VC90 mutation)
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const gapCursorStylesVisibilityFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&:has(${gapCursorSelector})`]: {
			caretColor: 'transparent',
		},
	},
});