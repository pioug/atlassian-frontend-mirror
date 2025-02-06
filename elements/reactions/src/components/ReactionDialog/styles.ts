/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
	padding: `${token('space.050', '4px')} 0px ${token('space.050', '4px')} 0px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		marginLeft: token('space.200', '16px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const customTabListStyles = css({
	overflow: 'auto',
	display: 'flex',
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
	marginTop: token('space.300', '24px'),
});
