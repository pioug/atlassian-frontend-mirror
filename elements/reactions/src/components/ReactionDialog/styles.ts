/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N500, N800 } from '@atlaskit/theme/colors';
import { type ThemeColorModes, token } from '@atlaskit/tokens';

const REACTIONS_CONTAINER_WIDTH = 48;
const REACTION_CONTAINER_HEIGHT = 40;

/*Reactions Container. Using pseudo Element :after to set border since with onClick of Reaction to higlight the
border blue below the reaction. Setting Border Width based on number of reactions to make sure it shows up
in case the container overflows */
export const containerStyle = (reactionsBorderWidth: number) =>
	css({
		overflow: 'hidden',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: '100%',
		display: 'flex',
		justifyContent: 'start',
		position: 'relative',
		scrollBehavior: 'smooth',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:after': {
			content: '""',
			zIndex: 0,
			display: 'block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			minWidth: `${reactionsBorderWidth}%`,
			bottom: '0px',
			position: 'absolute',
		},
	});

type containerEdgeAngleType = {
	rightEdge: number;
	leftEdge: number;
};

const containerEdgeAngle: containerEdgeAngleType = {
	rightEdge: 270,
	leftEdge: 90,
};

const fadedCss = (edge: keyof containerEdgeAngleType, theme?: ThemeColorModes) =>
	css({
		content: '""',
		position: 'absolute',
		left: '0px',
		top: '0px',
		width: `${REACTIONS_CONTAINER_WIDTH}px`,
		height: `${REACTION_CONTAINER_HEIGHT}px`,
		zIndex: 0,
		background:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			theme === 'dark'
				? `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(34, 39, 43, 0.95) 40.23%, rgba(34, 39, 43, 0.55) 58.33%, rgba(34, 39, 43, 0) 77.49%)`
				: `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(255, 255, 255, 0.95) 40.23%, rgba(255, 255, 255, 0.55) 58.33%, rgba(255, 255, 255, 0) 77.49%)`,
	});

export const customTabWrapper = (
	isSelected: boolean,
	selectedEmojiId: string,
	theme?: ThemeColorModes,
) =>
	css({
		flexShrink: 0,
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
		boxSizing: 'border-box',
		position: 'relative',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div': {
			minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
			minHeight: `${REACTION_CONTAINER_HEIGHT}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			padding: '0px !important',
			alignItems: 'center',
			justifyContent: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > span': {
			minHeight: '16px',
			minWidth: '16px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'&.disabled:after': fadedCss('rightEdge', theme),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'&.disabled + &.disabled:after': fadedCss('leftEdge', theme),
	});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const navigationContainerStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> button': { cursor: 'pointer' },
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'button:last-child': {
		marginLeft: token('space.200', '16px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const reactionViewStyle = css({
	marginTop: token('space.300', '24px'),
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		margin: 0,
		color: `${token('color.text', N800)}`,
		font: token('font.body.large'),
		fontWeight: token('font.weight.semibold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '20px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			marginRight: token('space.100', '8px'),
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const userListStyle = css({
	listStyle: 'none',
	marginTop: token('space.200', '16px'),
	padding: 0,
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	li: {
		color: `${token('color.text', N500)}`,
		font: token('font.body'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const userStyle = css({
	display: 'flex',
	alignItems: 'center',
	padding: `${token('space.100', '8px')} 0px ${token('space.100', '8px')} 0px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		marginLeft: token('space.200', '16px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const customTabListStyles = css({
	overflow: 'auto',
	display: 'flex',
	paddingBottom: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div[role=tablist]': {
		flexGrow: 1,
		// paddingInline exists to maintain styling prior to @atlaskit/tabs update that removed baked in horizontal padding
		paddingInline: token('space.100', '8px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const centerSpinner = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%',
});
