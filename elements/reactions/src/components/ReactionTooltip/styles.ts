/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N90, N800, N0 } from '@atlaskit/theme/colors';

export const verticalMargin = 5;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tooltipStyle = css({
	maxWidth: '150px',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	marginBottom: verticalMargin,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	ul: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		textAlign: 'left',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	li: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginTop: verticalMargin,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emojiNameStyle = css({
	textTransform: 'capitalize',
	color: token('color.text.inverse', N90),
	fontWeight: 600,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const footerStyle = css({
	color: token('color.text.inverse', N90),
	fontWeight: 300,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const underlineStyle = css({
	cursor: 'pointer',
	textDecoration: 'underline',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		backgroundColor: token('color.background.neutral.bold', N800),
		color: token('color.text.inverse', N0),
	},
});
