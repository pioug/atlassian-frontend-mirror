import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { WidthConsumer, Breakpoints } from '../WidthProvider';

function mapBreakpointToFontSize(breakpoint: Breakpoints) {
  switch (breakpoint) {
    case 'M':
      return fontSize() + 2;
    case 'L':
      return fontSize() + 4;
    default:
      return fontSize();
  }
}

export function mapBreakpointToLayoutMaxWidth(breakpoint: Breakpoints) {
  switch (breakpoint) {
    case 'M':
      return 760;
    case 'L':
      return 850;
    default:
      return 680;
  }
}

type BaseThemeWrapperProps = {
  breakpoint: Breakpoints;
  dynamicTextSizing?: boolean;
  children: React.ReactNode;
};
export function BaseThemeWrapper({
  breakpoint,
  dynamicTextSizing,
  children,
}: BaseThemeWrapperProps) {
  const memoizedTheme = useMemo(
    () => ({
      baseFontSize: dynamicTextSizing
        ? mapBreakpointToFontSize(breakpoint)
        : mapBreakpointToFontSize('S'),
      layoutMaxWidth: dynamicTextSizing
        ? mapBreakpointToLayoutMaxWidth(breakpoint)
        : mapBreakpointToLayoutMaxWidth('S'),
    }),
    [breakpoint, dynamicTextSizing],
  );

  return <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>;
}

type BaseThemeProps = {
  children: React.ReactNode;
  dynamicTextSizing?: boolean;
};

export function BaseTheme({ children, dynamicTextSizing }: BaseThemeProps) {
  return (
    <WidthConsumer>
      {({ breakpoint }) => (
        <BaseThemeWrapper
          dynamicTextSizing={dynamicTextSizing}
          breakpoint={breakpoint}
        >
          <>{children}</>
        </BaseThemeWrapper>
      )}
    </WidthConsumer>
  );
}
