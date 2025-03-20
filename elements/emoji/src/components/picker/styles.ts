// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import { emojiPickerBorderColor, emojiPickerBoxShadow } from '../../util/shared-styles';

import { emojiSprite, placeholder, emojiNodeStyles } from '../common/styles';

import {
	defaultEmojiPickerSize,
	emojiPickerHeight,
	emojiPickerHeightWithPreview,
	emojiPickerMinHeight,
	emojiPickerWidth,
} from '../../util/constants';
import { N30, N30A, N900 } from '@atlaskit/theme/colors';
import type { PickerSize } from '../../types';
import { emojiPickerHeightOffset } from './utils';

// Level 1 - picker
export const emojiPicker = (hasPreview?: boolean, size: PickerSize = defaultEmojiPickerSize) => {
	const heightOffset = emojiPickerHeightOffset(size);
	return css({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		background: token('elevation.surface.overlay', 'white'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		border: `${emojiPickerBorderColor} 1px solid`,
		borderRadius: token('border.radius.100', '3px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: emojiPickerBoxShadow,
		height: `${
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			hasPreview ? emojiPickerHeightWithPreview + heightOffset : emojiPickerHeight + heightOffset
		}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${emojiPickerWidth}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minWidth: `${emojiPickerWidth}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
		maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
	});
};

// Level 2

/// Category Selector
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const categorySelector = css({
	flex: '0 0 auto',
	backgroundColor: token('elevation.surface.sunken', N30),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		display: 'flex', // this will ensure the button height is concise per design
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const categorySelectorTablist = css({
	padding: `${token('space.075', '6px')} ${token('space.100', '8px')}`,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center',
});

/// EmojiPickerList

// focus style is enabled by default - turn it off
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const virtualList = css({
	overflowX: 'hidden',
	overflowY: 'auto',
	'&:focus': {
		outline: 'none',
	},
	paddingBottom: token('space.100', '8px'),
});

//// Search

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const searchIcon = css({
	opacity: 0.5,
	marginLeft: token('space.negative.025', '-2px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const input = css({
	boxSizing: 'border-box',
	color: 'inherit',
	cursor: 'inherit',
	font: token('font.body'),
	outline: 'none',
	padding: `1px ${token('space.0', '0px')} ${token('space.025', '2px')} ${token(
		'space.075',
		'6px',
	)}`,
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	['&:invalid']: {
		boxShadow: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	['&::-ms-clear']: {
		display: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pickerSearch = css({
	boxSizing: 'border-box',
	padding: token('space.150', '12px'),
	width: '100%',
});

//// Loading/Spinner

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiPickerSpinner = css({
	display: 'flex',
	width: '100%',
	height: '150px',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'>div': {
		flex: '0 0 auto',
	},
});

//// Category/Result

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiPickerRow = css({
	marginLeft: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiCategoryTitle = css({
	boxSizing: 'border-box',
	color: token('color.text', N900),
	font: token('font.body'),
	padding: `${token('space.075', '6px')} ${token('space.100', '8px')}`,
	textTransform: 'lowercase',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-letter': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiItem = css({
	display: 'inline-block',
	textAlign: 'center',
	width: '40px',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${emojiNodeStyles}`]: {
		cursor: 'pointer',
		padding: token('space.100', '8px'),
		borderRadius: '5px',
		width: '24px',
		height: '24px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${placeholder}`]: {
		padding: token('space.0', '0px'),
		margin: token('space.100', '8px'),
		minWidth: '24px',
		maxWidth: '24px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${emojiNodeStyles} .${placeholder}`]: {
		margin: token('space.0', '0px'),
	},
	// Fit non-square emoji to square
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${emojiNodeStyles} > img`]: {
		position: 'relative',
		left: '50%',
		top: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		maxHeight: '24px',
		maxWidth: '24px',
		display: 'block',
	},
	// Scale sprite to fit regardless of default emoji size
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${emojiNodeStyles} > .${emojiSprite}`]: {
		height: '24px',
		width: '24px',
	},
});

/// Footer
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiPickerFooter = css({
	flex: '0 0 auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiPickerFooterWithTopShadow = css({
	borderTop: `2px solid ${token('color.border', N30A)}`,
	boxShadow: `0px -1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiActionsContainerWithBottomShadow = css({
	borderBottom: `2px solid ${token('color.border', N30A)}`,
	boxShadow: `0px 1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});
