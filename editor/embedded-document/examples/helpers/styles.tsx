import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponentClass } from 'styled-components';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Container: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
> = styled.div({
	padding: `0 ${token('space.250')}`,
	background: '#fff',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Toolbar: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
> = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: `0 ${token('space.250')}`,
	height: token('space.1000'),
});
