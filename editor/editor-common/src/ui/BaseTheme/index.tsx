import React, { useMemo } from 'react';

import { ThemeProvider } from 'styled-components';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { fontSize } from '@atlaskit/theme/constants';

import { Breakpoints, WidthConsumer } from '../WidthProvider';

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
  baseFontSize?: number;
};

export function BaseThemeWrapper({
  breakpoint,
  dynamicTextSizing,
  baseFontSize,
  children,
}: BaseThemeWrapperProps) {
  const memoizedTheme = useMemo(
    () => ({
      baseFontSize: dynamicTextSizing
        ? mapBreakpointToFontSize(breakpoint)
        : baseFontSize || mapBreakpointToFontSize('S'),
      layoutMaxWidth: dynamicTextSizing
        ? mapBreakpointToLayoutMaxWidth(breakpoint)
        : akEditorDefaultLayoutWidth,
    }),
    [breakpoint, dynamicTextSizing, baseFontSize],
  );

  return <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>;
}

type BaseThemeProps = {
  children: React.ReactNode;
  dynamicTextSizing?: boolean;
  baseFontSize?: number;
};

export function BaseTheme({
  children,
  dynamicTextSizing,
  baseFontSize,
}: BaseThemeProps) {
  return (
    <WidthConsumer>
      {({ breakpoint }) => (
        <BaseThemeWrapper
          dynamicTextSizing={dynamicTextSizing}
          breakpoint={breakpoint}
          baseFontSize={baseFontSize}
        >
          <>{children}</>
        </BaseThemeWrapper>
      )}
    </WidthConsumer>
  );
}
