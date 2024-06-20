// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { defaultEmojiHeight } from '../../util/constants';
import { akEmojiSelectedBackgroundColor } from '../../util/shared-styles';
import { B100, N20, N200, N20A, N300, N400, N900, R300, R400 } from '@atlaskit/theme/colors';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { fontFallback } from '@atlaskit/theme/typography';

export const commonSelectedStyles = 'emoji-common-selected';
export const selectOnHoverStyles = 'emoji-common-select-on-hover';
export const emojiSprite = 'emoji-common-emoji-sprite';
export const emojiNodeStyles = 'emoji-common-node';
export const emojiImage = 'emoji-common-emoji-image';
export const emojiDeleteButton = 'emoji-common-deleteButton';
export const emojiMainStyle = 'emoji-common-main-styles';
export const deletableEmoji = 'emoji-common-deletable';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const deleteButton = css({
	// hide by default
	visibility: 'hidden',
	display: 'flex',
	position: 'absolute',
	top: token('space.negative.100', '-8px'),
	right: token('space.negative.100', '-8px'),
	zIndex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiToneSelectorContainer = css({
	flex: 1,
	display: 'flex',
	justifyContent: 'flex-end',
	padding: '11px 10px 12px 0',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiImageContainer = css({
	borderRadius: token('border.radius.100', '3px'),
	backgroundColor: 'transparent',
	display: 'inline-block',
	verticalAlign: 'middle',
	// Ensure along with vertical align middle, we don't increase the line height for p and some
	// headings. Smaller headings get a slight increase in height, cannot add more negative margin
	// as a "selected" emoji (e.g. in the editor) will not look good.
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		display: 'block',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: akEmojiSelectedBackgroundColor,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover .${emojiDeleteButton}`]: {
		// show delete button on hover
		visibility: 'visible',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`&.${deletableEmoji}`]: {
		position: 'relative',
	},

	// show delete button on focus
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`&.${deletableEmoji}:focus-within .${emojiDeleteButton}`]: {
		visibility: 'visible',
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiSpriteContainer = css({
	display: 'inline-block',
	// Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`&.${commonSelectedStyles},&.${selectOnHoverStyles}:hover`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: akEmojiSelectedBackgroundColor,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${emojiSprite}`]: {
		background: 'transparent no-repeat',
		display: 'inline-block',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minHeight: `${defaultEmojiHeight}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minWidth: `${defaultEmojiHeight}px`,
		verticalAlign: 'middle',
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

export const placeholder = 'emoji-common-placeholder';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const placeholderContainer = css({
	position: 'relative',
	margin: '-1px 0',
	display: 'inline-block',
	background: token('color.border', '#f7f7f7'),
	borderRadius: token('border.radius.100', '3px'),
	overflow: 'hidden',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
	textAlign: 'center',
});

const easeSweep = keyframes({
	from: {
		transform: 'translateX(-100%)',
	},
	to: {
		transform: 'translateX(100%)',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css, @atlaskit/design-system/no-exported-keyframes -- Ignored via go/DSP-18766
export const placeholderContainerAnimated = css({
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		background: token('color.background.neutral', N20A),
		height: '100%',
		width: '100%',
		animation: `${easeSweep} 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const hidden = css({
	opacity: 0,
	visibility: 'hidden',
	display: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiButton = css({
	backgroundColor: 'transparent',
	border: '0',
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'pointer',
	padding: 0,
	position: 'relative',
	display: 'inline-block',

	/* Firefox */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	['&::-moz-focus-inner']: {
		border: '0 none',
		padding: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&>span': {
		padding: token('space.075', '6px'),

		// Scale sprite to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`&>.${emojiSprite}`]: {
			height: '24px',
			width: '24px',
		},
		// Scale image to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`&>img`]: {
			height: '24px',
			width: '24px',
		},
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiRadio = css({
	opacity: 0,
	position: 'absolute',
	top: '-10px',
	left: '-10px',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'+span': {
		borderRadius: token('border.radius.100', '3px'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:focus + span': {
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

// Emoji Preview
export const emojiPickerAddEmoji = 'emoji-picker-add-emoji';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewText = css({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	marginTop: token('space.negative.025', '-2px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
	maxWidth: '285px',
	width: '285px' /* IE */,
	flexGrow: 1,
	flexShrink: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiName = css({
	display: 'block',
	color: token('color.text', N900),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	['&:first-letter']: {
		textTransform: 'uppercase',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiShortName = css({
	display: 'block',
	color: token('color.text.subtle', N200),
	fontSize: '12px',
	lineHeight: 1,
	marginBottom: token('space.negative.025', '-2px'),
	overflow: 'hidden',
	paddingBottom: token('space.025', '2px'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	['&:first-of-type']: {
		color: token('color.text', N900),
		fontSize: '14px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const preview = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	height: '32px',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewImg = css({
	display: 'inline-block',
	flex: 'initial',
	width: '32px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`& .${emojiSprite}, span[role="img"]`]: {
		width: '32px',
		height: '32px',
		padding: 0,
		maxHeight: 'inherit',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`& span[role="img"] > img`]: {
		position: 'relative',
		left: '50%',
		top: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		maxHeight: '32px',
		maxWidth: '32px',
		padding: 0,
		display: 'block',
	},
});

// Scrollable

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiScrollable = css({
	border: `1px solid ${token('color.border', '#fff')}`,
	borderRadius: token('border.radius.100', '3px'),
	display: 'block',
	margin: '0',
	overflowX: 'hidden',
	overflowY: 'auto',
	padding: '0',
});

// EmojiUpload

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiUpload = css({
	height: '78px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiUploadTop = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '7px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	fontSize: '12px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadChooseFileMessage = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		color: token('color.text.subtle', N300),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const closeEmojiUploadButton = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiUploadBottom = css({
	fontSize: '11px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadChooseFileRow = css({
	display: 'flex',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '7px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadChooseFileEmojiName = css({
	flex: '1 1 auto',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '5px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	input: {
		background: 'transparent',
		border: 0,
		outline: 'none',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		['&:invalid']: {
			boxShadow: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		['&::-ms-clear']: {
			display: 'none',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadChooseFileBrowse = css({
	flex: '0 0 auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadPreviewFooter = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadPreview = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	background: token('color.background.neutral', N20),
	borderRadius: token('border.radius.100', '3px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadPreviewText = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h5: {
		color: token('color.text.subtle', N300),
		paddingBottom: token('space.050', '4px'),
		fontSize: '12px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '20px',
		maxWidth: '50px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const bigEmojiPreview = css({
	paddingLeft: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '40px',
		maxWidth: '100px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadAddRow = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const addCustomEmoji = css({
	alignSelf: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBottom: '10px',
});

// Emoji Delete preview

export const submitDelete = 'emoji-submit-delete';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const deletePreview = css({
	height: '100px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const deleteText = css({
	height: '64px',
	fontSize: '12px',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type': {
		color: token('color.text.subtle', N300),
		lineHeight: '16px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const headingH5 = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		font: token('font.body.UNSAFE_small', fontFallback.body.UNSAFE_small),
		fontWeight: token('font.weight.semibold', '600'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const requiredSymbol = css({
	paddingLeft: token('space.025', '2px'),
	color: token('color.text.danger', R400),
	fontFamily: getFontFamily(),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewButtonGroup = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const deleteFooter = css({
	display: 'flex',
	height: '40px',
	alignItems: 'center',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body', fontFallback.body.medium),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '32px',
		maxWidth: '72px',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${submitDelete}`]: {
		width: '84px',
		fontWeight: token('font.weight.bold', 'bold'),
		marginRight: token('space.050', '4px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiDeleteErrorMessage = css({
	display: 'flex',
	color: token('color.text.danger', R400),
	alignItems: 'center',
	justifyContent: 'flex-end',
	paddingRight: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiChooseFileErrorMessage = css({
	display: 'flex',
	color: token('color.text.danger', R300),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '10px',
	justifyContent: 'flex-start',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiPreviewErrorMessage = css({
	display: 'inline-flex',
	color: token('color.text.danger', R400),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '10px',
	justifyContent: 'flex-end',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const addCustomEmojiButton = css({
	maxWidth: '285px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const buttonSpinner = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '10px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiActionsWrapper = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const tooltipShortcutStyle = css({
	borderRadius: '3px',
	backgroundColor: token('color.background.inverse.subtle', N400),
	padding: `0 ${token('space.025', '2px')}`,
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'tooltip-shortcut',
});
