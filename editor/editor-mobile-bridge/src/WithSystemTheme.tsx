// TODO: https://product-fabric.atlassian.net/browse/DSP-4044
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useMemo } from 'react';

import { N0 } from '@atlaskit/theme/colors';
// eslint-disable-next-line
import { ThemeProvider as DeprecatedThemeProvider } from 'styled-components';
import { ThemeProvider } from '@emotion/react';

import { AtlaskitThemeProvider, themed } from '@atlaskit/theme/components';
import { CHANNEL } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';

import { useSystemTheme } from './hooks/useSystemTheme';

const DN0 = '#000000';
const background = themed({ light: N0, dark: DN0 });

interface WithSystemThemeModeProps {
	mode: ThemeModes;
	children?: React.ReactNode[] | React.ReactNode;
}

const WithSystemTheme = (props: React.PropsWithChildren<WithSystemThemeModeProps>) => {
	const { children, mode } = props;

	const theme = useMemo(() => ({ [CHANNEL]: { mode } }), [mode]);

	return (
		<ThemeProvider theme={theme}>
			<DeprecatedThemeProvider theme={theme}>
				<AtlaskitThemeProvider mode={mode} background={background}>
					{children}
				</AtlaskitThemeProvider>
			</DeprecatedThemeProvider>
		</ThemeProvider>
	);
};

export const withSystemTheme =
	<P extends object>(
		Component: React.ComponentType<React.PropsWithChildren<P>>,
		enableLightDarkTheming?: boolean,
	): React.ComponentType<React.PropsWithChildren<P>> =>
	(props) => {
		const mode = enableLightDarkTheming ? useSystemTheme() : 'light';
		return (
			<WithSystemTheme mode={mode}>
				<Component {...(props as P)} />
			</WithSystemTheme>
		);
	};
