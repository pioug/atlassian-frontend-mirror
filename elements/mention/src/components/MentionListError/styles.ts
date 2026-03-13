// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const GenericErrorVisualStyle: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	width: token('space.1000', '80px'),
});
