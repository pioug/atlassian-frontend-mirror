import React, { FC } from 'react';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeProp } from '@atlaskit/theme/components';
import { GlobalThemeTokens } from '@atlaskit/theme/components';

import Container from './Container';
import Format from './Format';
import { Theme, ThemeAppearance, ThemeProps, ThemeTokens } from '../theme';

export interface BadgeProps {
  /** Affects the visual style of the badge. */
  appearance?: ThemeAppearance;

  /**
   * Supersedes the `value` props. The value displayed within the badge. A string can be provided for
   * custom-formatted numbers, however badge should only be used in cases where you want to represent
   * a number.
   * Use a [lozenge](/packages/core/lozenge) for non-numeric information.
   */
  children?: number | string;

  /** The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed. */
  max?: number;

  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;

  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

const Badge: FC<BadgeProps> = ({
  theme,
  appearance = 'default',
  children = 0,
  max = 99,
  testId,
}: BadgeProps) => {
  return (
    <Theme.Provider value={theme}>
      <GlobalTheme.Consumer>
        {({ mode }: GlobalThemeTokens) => (
          <Theme.Consumer appearance={appearance} mode={mode}>
            {(tokens: ThemeTokens) => (
              <Container {...tokens} data-testid={testId}>
                {typeof children === 'string' ? (
                  children
                ) : (
                  <Format max={max}>{children}</Format>
                )}
              </Container>
            )}
          </Theme.Consumer>
        )}
      </GlobalTheme.Consumer>
    </Theme.Provider>
  );
};

export default Badge;
