// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { scrollableMaxHeight } from '../../shared-styles';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ScrollableStyle: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	display: 'block',
	overflowX: 'hidden',
	overflowY: 'auto',
	padding: `${token('space.050')} 0`,
	margin: 0,
	background: token('elevation.surface'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxHeight: scrollableMaxHeight,
	borderRadius: token('radius.small', '3px'),
});
