/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type WhatsNewResultListItemWrapperProps = {
	styles: any;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultListItemWrapper =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
	styled.a<WhatsNewResultListItemWrapperProps>(
		{
			position: `relative`,
			boxSizing: `border-box`,
			padding: token('space.100', '8px'),
			display: `block`,
			textDecoration: `none`,
			cursor: `pointer`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			color: `${token('color.text.subtlest', colors.N200)}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: `${token('color.background.neutral.subtle', colors.N0)}`,
			borderRadius: `3px`,

			'&:hover, &:focus, &:visited, &:active': {
				textDecoration: `none`,
				outline: `none`,
				outlineOffset: `none`,
			},

			'&:focus': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				boxShadow: `${token('color.border.focused', colors.B100)} 0px 0px 0px 2px inset`,
			},

			'&:hover': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				backgroundColor: `${token('color.background.neutral.subtle.hovered', colors.N30)}`,
			},

			'&:active': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				backgroundColor: `${token('color.background.neutral.subtle.pressed', colors.B50)}`,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
		(props: any) => props.styles,
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultListItemTitleContainer = styled.div({
	width: '100%',
	whiteSpace: 'nowrap',
	marginBottom: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultListItemTitleText = styled.span({
	fontSize: `${fontSizeSmall()}px`,
	lineHeight: `${fontSize()}px`,
	display: 'inline-block',
	verticalAlign: 'middle',
	margin: 0,
	paddingLeft: token('space.050', '4px'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultListItemDescription = styled.p({
	display: 'block',
	lineHeight: '20px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N800),
	margin: 0,
});
