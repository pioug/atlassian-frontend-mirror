/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

import Theme, { elevation as AkElevations, AtlaskitThemeProvider, themed } from '../src';
import { type Elevation, type ThemeModes } from '../src/types';

const elevations = { ...AkElevations };

// the below adaptation may be written statically like ${akElevationMixins.e100}
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Box = styled.div<{ elevation: Elevation }>`
	${({ elevation }) => elevations[elevation]}
	background-color: ${(props) => themed({ light: 'white', dark: '#283447' })(props)};
	border-radius: ${token('border.radius', '3px')};
	margin-bottom: 2em;
	min-width: 240px;
	padding: ${token('space.200', '16px')} ${token('space.300', '24px')};
	text-align: center;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Wrapper = styled.div({
	alignItems: 'center',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'column',
});

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	const [themeMode, setThemeMode] = useState<ThemeModes>('light');
	const switchTheme = useCallback(
		() => setThemeMode((old) => (old === 'light' ? 'dark' : 'light')),
		[],
	);

	return (
		<AtlaskitThemeProvider mode={themeMode}>
			<Theme.Consumer>
				{(theme) => (
					<div>
						<Wrapper>
							<Box elevation="e100">Cards on a board (e100)</Box>
							<Box elevation="e200">Inline dialogs (e200)</Box>
							<Box elevation="e300">Modals (e300)</Box>
							<Box elevation="e400">Panels (e400)</Box>
							<Box elevation="e500">Flag messages (e500)</Box>
						</Wrapper>

						<div
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								padding: token('space.100', '8px'),
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								textAlign: 'center',
							}}
						>
							<Button appearance="primary" onClick={switchTheme}>
								Switch theme ({themeMode})
							</Button>
						</div>
					</div>
				)}
			</Theme.Consumer>
		</AtlaskitThemeProvider>
	);
};
