import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { WidthConsumer, Breakpoints } from '../WidthProvider';

function mapBreakpointToFontSize(breakpoint: string) {
  switch (breakpoint) {
    case Breakpoints.M:
      return fontSize() + 2;
    case Breakpoints.L:
      return fontSize() + 4;
    default:
      return fontSize();
  }
}

export function mapBreakpointToLayoutMaxWidth(breakpoint: string) {
  switch (breakpoint) {
    case Breakpoints.M:
      return 760;
    case Breakpoints.L:
      return 850;
    default:
      return 680;
  }
}

type BaseThemeWrapperProps = {
  breakpoint: string;
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
        : mapBreakpointToFontSize(Breakpoints.S),
      layoutMaxWidth: dynamicTextSizing
        ? mapBreakpointToLayoutMaxWidth(breakpoint)
        : mapBreakpointToLayoutMaxWidth(Breakpoints.S),
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
