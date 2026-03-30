/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/ban-types -- Ignored via go/DSP-18766 */
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Container: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	padding: `${token('space.1000')} ${token('space.600')}`,
	backgroundColor: token('elevation.surface'),
	height: '100vh',
	width: '100vw',
	boxSizing: 'border-box',
});
