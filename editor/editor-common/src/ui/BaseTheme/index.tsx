import React, { useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { fontSize } from '@atlaskit/theme/constants';

import type { Breakpoints } from '../WidthProvider';
import { WidthConsumer } from '../WidthProvider';

export function mapBreakpointToLayoutMaxWidth(breakpoint: Breakpoints) {
	switch (breakpoint) {
		case 'M':
		case 'L':
			return 760;
		default:
			return 680;
	}
}

type BaseThemeWrapperProps = {
	breakpoint: Breakpoints;
	children: React.ReactNode;
	baseFontSize?: number;
};

export function BaseThemeWrapper({ baseFontSize, children }: BaseThemeWrapperProps) {
	const memoizedTheme = useMemo(
		() => ({
			baseFontSize: baseFontSize || fontSize(),
			layoutMaxWidth: akEditorDefaultLayoutWidth,
		}),
		[baseFontSize],
	);

	return <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>;
}

type BaseThemeProps = {
	children: React.ReactNode;
	baseFontSize?: number;
};

export function BaseTheme({ children, baseFontSize }: BaseThemeProps) {
	return (
		<WidthConsumer>
			{({ breakpoint }) => (
				<BaseThemeWrapper breakpoint={breakpoint} baseFontSize={baseFontSize}>
					<>{children}</>
				</BaseThemeWrapper>
			)}
		</WidthConsumer>
	);
}
