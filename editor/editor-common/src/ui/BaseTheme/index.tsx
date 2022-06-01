import React, { useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { CHANNEL, fontSize } from '@atlaskit/theme/constants';

import { Breakpoints, WidthConsumer } from '../WidthProvider';

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
  children: React.ReactNode;
  baseFontSize?: number;
};

export function BaseThemeWrapper({
  baseFontSize,
  children,
}: BaseThemeWrapperProps) {
  const { mode } = useGlobalTheme();

  const memoizedTheme = useMemo(
    () => ({
      baseFontSize: baseFontSize || fontSize(),
      layoutMaxWidth: akEditorDefaultLayoutWidth,
      // Below is used for editor dark mode.
      [CHANNEL]: { mode },
    }),
    [baseFontSize, mode],
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
