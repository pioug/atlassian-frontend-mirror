// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
import { N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const DescriptionBylineStyle: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.span({
	color: token('color.text.subtlest', N100),
	font: token('font.body.UNSAFE_small'),
	marginTop: token('space.025', '2px'),
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});
