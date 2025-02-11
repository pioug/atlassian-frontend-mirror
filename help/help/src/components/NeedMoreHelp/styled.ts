/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NeedMoreHelpContainer = styled.div({
	zIndex: 11,
	alignSelf: 'center',
	alignContent: 'center',
	backgroundColor: token('color.background.accent.yellow.subtlest'),
	width: '187px',
	height: token('space.500', '42px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 0px 1px var(--shadow-overlay-third,rgba(188,214,240,0.00)) inset',
	),
	filter:
		'drop-shadow(0px 8px 12px var(--shadow-overlay-second, rgba(9,30,66,0.15))) drop-shadow(0px 0px 1px rgba(9,30,66,0.31))',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NeedMoreHelpContent = styled.p({
	color: token('color.text'),
	font: token('font.heading.xxsmall'),
	display: 'inline-block',
	alignSelf: 'center',
	margin: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpAskAI = styled.p({
	color: token('color.text.selected'),
	font: token('font.heading.xxsmall'),
	display: 'inline-block',
	alignSelf: 'center',
	margin: 0,
	cursor: 'pointer',

	'&:hover': {
		textDecoration: 'underline',
	},
});
