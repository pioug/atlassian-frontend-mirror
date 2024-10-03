import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from '@emotion/react';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

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

declare module '@emotion/react' {
	export interface Theme {
		baseFontSize: number;
		layoutMaxWidth: number;
	}
}

export function BaseThemeWrapper({ baseFontSize, children }: BaseThemeWrapperProps) {
	const memoizedTheme = useMemo(
		() => ({
			baseFontSize: baseFontSize || 14,
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
