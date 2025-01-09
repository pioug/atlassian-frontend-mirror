/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Description = styled.p`
	padding: ${token('space.100', '8px')};
	margin: ${token('space.500', '40px')} 0 ${token('space.100', '8px')};
	background-color: ${token('elevation.surface', colors.N0)};
	color: ${token('color.text', colors.N900)};
`;

declare module '@emotion/react' {
	export interface Theme {
		mode: 'light' | 'dark' | {};
	}
}

export default () => (
	<div id="emotion-theming">
		<h2>Components wrapped in emotion theme provider</h2>
		<ThemeProvider theme={{}}>
			<Description>
				With default (<strong>light</strong>) theme mode (when mode is not specified)
			</Description>
			<DateTimePicker
				datePickerProps={{ shouldShowCalendarButton: true }}
				testId="picker-1"
				defaultValue="2020-01-01"
			/>
		</ThemeProvider>
		<ThemeProvider theme={{ mode: 'dark' }}>
			<Description>
				With <strong>dark</strong> theme mode
			</Description>
			<DateTimePicker
				datePickerProps={{ shouldShowCalendarButton: true }}
				testId="picker-2"
				defaultValue="2020-01-01"
			/>
		</ThemeProvider>
		<ThemeProvider theme={{ mode: {} }}>
			<Description>
				With default (<strong>light</strong>) theme mode (when mode is other than{' '}
				<strong>light</strong> or <strong>dark</strong>)
			</Description>
			<DateTimePicker
				datePickerProps={{ shouldShowCalendarButton: true }}
				testId="picker-3"
				defaultValue="2020-01-01"
			/>
		</ThemeProvider>
	</div>
);
