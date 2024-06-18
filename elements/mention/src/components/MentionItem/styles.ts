// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { N900, N100, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
export const RowStyle = styled.div({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	overflow: 'hidden',
	padding: `${token('space.075', '6px')} ${token('space.150', '12px')}`,
	textOverflow: 'ellipsis',
	verticalAlign: 'middle',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const AvatarStyle = styled.span<AvatarSectionStyleProps>((props) => ({
	position: 'relative',
	flex: 'initial',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const NameSectionStyle = styled.div<NameSectionStyleProps>((props) => ({
	flex: 1,
	minWidth: 0,
	marginLeft: token('space.150', '12px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FullNameStyle = styled.span({
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text', N900),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const InfoSectionStyle = styled.div<InfoSectionStyleProps>((props) => ({
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'right',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	opacity: props.restricted ? '0.5' : 'inherit',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&': {
		/* Lozenge */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > span': {
			marginBottom: token('space.025', '2px'),
		},
	},
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeStyle = styled.div({
	marginLeft: token('space.250', '20px'),
	flex: 'none',
	color: token('color.text.subtlest', N100),
	fontSize: '12px',
});

export const MENTION_ITEM_HEIGHT = 48;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const MentionItemStyle = styled.div<MentionItemStyleProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: props.selected ? token('color.background.selected', N30) : 'transparent',
	display: 'block',
	overflow: 'hidden',
	listStyleType: 'none',
	height: `${MENTION_ITEM_HEIGHT}px`,
	lineHeight: 1.2,
	cursor: 'pointer',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AccessSectionStyle = styled.div({
	paddingLeft: token('space.050', '4px'),
	color: token('color.text.subtle', N500),
});
