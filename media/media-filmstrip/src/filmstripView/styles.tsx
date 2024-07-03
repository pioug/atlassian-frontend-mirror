// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N20, N40, B400, B50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmStripViewStyles = css({
	position: 'relative',
	padding: '3px 0',
	borderRadius: '3px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover .arrow': {
		opacity: 1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ellipsed-text': {
		whiteSpace: 'initial',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmStripListWrapperStyles = css({
	width: 'inherit',
	overflow: 'hidden',
	padding: `${token('space.025', '2px')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmStripListStyles = css({
	margin: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '-3px',
	padding: 0,
	transitionProperty: 'transform',
	transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
	whiteSpace: 'nowrap',
	display: 'inline-block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmStripListItemStyles = css({
	listStyleType: 'none',
	margin: 0,
	padding: `0 ${token('space.050', '4px')}`,
	display: 'inline-block',
	verticalAlign: 'middle',
	fontSize: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const arrowWrapperStyles = css({
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	backgroundColor: token('elevation.surface.overlay', N20),
	borderRadius: '100%',
	display: 'flex',
	cursor: 'pointer',
	transition: 'opacity 0.3s',
	boxShadow: token('elevation.shadow.overlay', '0 1px 6px 0 rgba(0, 0, 0, 0.6)'),
	color: token('color.icon', 'black'),
	width: '30px',
	height: '30px',
	justifyContent: 'center',
	opacity: 0,
	'&:hover': {
		color: token('color.text.subtle', 'black'),
		backgroundColor: token('elevation.surface.overlay.hovered', N40),
	},
	'&:active': {
		color: token('color.text.selected', B400),
		backgroundColor: token('color.background.selected', B50),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		height: '30px',
		width: '20px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const arrowLeftWrapperStyles = css(arrowWrapperStyles, {
	left: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		paddingRight: token('space.025', '2px'),
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const arrowRightWrapperStyles = css(arrowWrapperStyles, {
	right: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingLeft: '1px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const shadowStyles = css({
	position: 'absolute',
	zIndex: 10,
	height: '100%',
	top: 0,
	width: '2px',
	backgroundColor: token('color.border', 'rgba(0, 0, 0, 0.2)'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const shadowLeftStyles = css(shadowStyles, {
	left: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const shadowRightStyles = css(shadowStyles, {
	right: 0,
});
