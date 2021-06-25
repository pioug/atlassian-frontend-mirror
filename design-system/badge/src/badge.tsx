import React from 'react';

import GlobalTheme, { GlobalThemeTokens } from '@atlaskit/theme/components';

import Container from './internal/components/container';
import Format from './internal/components/format';
import { Theme, ThemeTokens } from './internal/theme';
import type { BadgeProps } from './types';

/**
 * __Badge__
 *
 * This component gives you the full badge functionality and automatically formats the number you provide in \`children\`.
 *
 * - [Examples](https://atlassian.design/components/badge/examples)
 * - [Code](https://atlassian.design/components/badge/code)
 * - [Usage](https://atlassian.design/components/badge/usage)
 */
function Badge({
  theme,
  appearance = 'default',
  children = 0,
  max = 99,
  testId,
}: // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
BadgeProps) {
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
}

Badge.displayName = 'Badge';

export default Badge;
