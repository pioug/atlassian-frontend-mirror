/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { token } from '@atlaskit/tokens';

import { colors } from '../src';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Description = styled.p`
	padding: ${token('space.100', '8px')};
	margin: ${token('space.500', '40px')} 0 ${token('space.100', '8px')};
	background-color: ${(props) => colors.background(props)};
	color: ${(props) => colors.text(props)};
`;

export default () => (
	<div id="emotion-theming">
		<h2>Components wrapped in emotion theme provider</h2>
		<ThemeProvider theme={{}}>
			<Description>
				With default (<strong>light</strong>) theme mode (when mode is not specified)
			</Description>
			<DateTimePicker testId="picker-1" defaultValue="2020-01-01" />
		</ThemeProvider>
		<ThemeProvider theme={{ mode: 'dark' }}>
			<Description>
				With <strong>dark</strong> theme mode
			</Description>
			<DateTimePicker testId="picker-2" defaultValue="2020-01-01" />
		</ThemeProvider>
		<ThemeProvider theme={{ mode: {} }}>
			<Description>
				With default (<strong>light</strong>) theme mode (when mode is other than{' '}
				<strong>light</strong> or <strong>dark</strong>)
			</Description>
			<DateTimePicker testId="picker-3" defaultValue="2020-01-01" />
		</ThemeProvider>
	</div>
);
