import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const containerStyles = css({
	alignItems: 'center',
	display: 'flex',
	gap: token('space.100', '8px'),
	justifyContent: 'space-between',
	// AK ModalBody has 2px padding top and bottom.
	// Using 14px here to create 16px gap between
	// link info and iframe
	padding: `${token('space.300', '24px')} ${token(
		'space.300',
		'24px',
	)} 14px ${token('space.300', '24px')}`,
});

const iconSize = '24px';
// EDM-7328: CSS Specificity
// An embed modal icon css for img, span, svg has specificity weight of 0-1-1.
// Specify flex ui icon selector to increase specificity weight to 0-2-1.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const iconCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&, [data-smart-element-icon] img, [data-smart-element-icon] span, [data-smart-element-icon] svg, img, span, svg':
		{
			height: iconSize,
			minHeight: iconSize,
			maxHeight: iconSize,
			width: iconSize,
			minWidth: iconSize,
			maxWidth: iconSize,
		},
});

const height = '20px';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const titleCss = css({
	flex: '1 1 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h3: {
		flex: '1 1 auto',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: height,
		display: '-webkit-box',
		marginBottom: 0,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		WebkitBoxOrient: 'vertical',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: height,
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const actionCss = css({
	display: 'flex',
	flex: '0 0 auto',
	gap: token('space.050', '4px'),
	lineHeight: height,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		lineHeight: height,
	},
	'@media only screen and (max-width: 980px)': {
		// Hide resize button if the screen is smaller than the min width
		// or too small to have enough impact to matter.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.smart-link-resize-button': {
			display: 'none',
		},
	},
});
