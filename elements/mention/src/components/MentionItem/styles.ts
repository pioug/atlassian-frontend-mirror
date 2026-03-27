// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface MentionItemStyleProps {
	selected?: boolean;
}

export interface AvatarSectionStyleProps {
	restricted?: boolean;
}

export interface NameSectionStyleProps {
	restricted?: boolean;
}

export interface InfoSectionStyleProps {
	restricted?: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const RowStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	overflow: 'hidden',
	padding: `${token('space.075')} ${token('space.150')}`,
	textOverflow: 'ellipsis',
	verticalAlign: 'middle',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const AvatarStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & AvatarSectionStyleProps,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
> = styled.span<AvatarSectionStyleProps>((props) => ({
	position: 'relative',
	flex: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const NameSectionStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & NameSectionStyleProps,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
> = styled.div<NameSectionStyleProps>((props) => ({
	flex: 1,
	minWidth: 0,
	marginLeft: token('space.150'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FullNameStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.span({
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const InfoSectionStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & InfoSectionStyleProps,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
> = styled.div<InfoSectionStyleProps>((props) => ({
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'right',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'& > span': fg('platform-dst-lozenge-tag-badge-visual-uplifts')
			? {
					marginRight: token('space.negative.025'),
					marginBottom: token('space.025'),
					marginTop: token('space.025'),
				}
			: {
					marginBottom: token('space.025'),
				},
	},
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	marginLeft: token('space.250'),
	flex: 'none',
	color: token('color.text.subtlest'),
	font: token('font.body.small'),
});

export const MENTION_ITEM_HEIGHT = 48;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const MentionItemStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & MentionItemStyleProps,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
> = styled.div<MentionItemStyleProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: props.selected ? token('color.background.selected') : 'transparent',
	display: 'block',
	overflow: 'hidden',
	listStyleType: 'none',
	height: `${MENTION_ITEM_HEIGHT}px`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.2,
	cursor: 'pointer',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AccessSectionStyle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	paddingLeft: token('space.050'),
	color: token('color.text.subtle'),
});
