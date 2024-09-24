/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

type ArticlesListItemWrapperProps = {
	styles: any;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemWrapper = styled.a<ArticlesListItemWrapperProps>(
	{
		position: 'relative',
		boxSizing: 'border-box',
		padding: token('space.100', '8px'),
		display: 'block',
		textDecoration: 'none',
		cursor: 'pointer',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.subtlest', colors.N200),
		borderRadius: '3px',
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),

		'&:hover, &:focus, &:visited, &:active': {
			textDecoration: 'none',
			outline: 'none',
			outlineOffset: 'none',
		},

		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			boxShadow: `${token('color.border.focused', colors.B100)} 0px 0px 0px 2px inset`,
		},

		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.neutral.subtle.hovered', colors.N30),
		},

		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.neutral.subtle.pressed', colors.B50),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props: any) => props.styles,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemContainer = styled.div({
	width: '100%',
	whiteSpace: 'nowrap',
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemTitleSection = styled.div({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemTypeTitle = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body.small', fontFallback.body.small),
	fontWeight: token('font.weight.bold', 'bold'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N200),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemLinkIcon = styled.span({
	alignSelf: 'auto',
	paddingInlineStart: token('space.050', '4px'),
	verticalAlign: 'middle',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemTitleText = styled.p({
	textDecoration: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N800),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.xsmall', fontFallback.heading.xsmall),
	display: 'inline-block',
	whiteSpace: 'normal',
	overflow: 'hidden',
	marginBottom: token('space.100', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticlesListItemDescription = styled.p({
	display: 'block',
	lineHeight: '20px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtle', colors.N400),
	margin: 0,
	paddingBottom: token('space.025', '2px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemSource = styled.div({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.xxsmall', fontFallback.heading.xxsmall),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N400A),
	padding: `${token('space.050', '4px')} 0`,
	fontWeight: token('font.weight.bold', 'bold'),
	textTransform: 'uppercase',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemTrustFactor = styled.div({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body.small', fontFallback.body.small),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N400A),
	paddingTop: token('space.025', '2px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemViewCount = styled.span({
	paddingRight: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemHelpfulCount = styled.span({
	display: 'inline-flex',
	paddingRight: token('space.100', '8px'),
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		marginRight: token('space.025', '2px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const ArticlesListItemLastModified = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body.small', fontFallback.body.small),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N400A),
	padding: `${token('space.050', '4px')} 0`,
});
