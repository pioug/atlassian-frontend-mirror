// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TooltipContent = styled.div({
	fontFamily: token('font.family.body'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionListItem = styled.li<{
	isDeprecated: boolean;
	isSelected: boolean;
}>(
	{
		cursor: 'pointer',
		padding: `${token('space.075')} ${token('space.100')}`,
		fontFamily: token('font.family.code'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isSelected }) =>
		isSelected && {
			background: token('color.background.neutral.subtle.hovered'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ isDeprecated }) =>
		isDeprecated && {
			cursor: 'default',
			color: token('color.text.disabled'),
		},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionName = styled.div({
	color: token('color.text'),
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	// Added so that overflowed option names do not squish the deprecated info icon
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const DeprecatedOptionContainer = styled.div({
	color: token('color.text.disabled'),
	display: 'flex',
	justifyContent: 'space-between',
	opacity: 0.6,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionHighlight = styled.span({
	fontWeight: token('font.weight.bold'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FieldType = styled.div({
	display: 'flex',
	alignItems: 'center',
	marginTop: token('space.negative.025'),
	color: token('color.text.subtlest'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FieldTypeIcon = styled.span({
	display: 'flex',
	marginRight: token('space.050'),
});
