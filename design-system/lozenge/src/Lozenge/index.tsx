import React, { memo, ReactNode } from 'react';

import { ThemeProp } from '@atlaskit/theme/components';

import { Theme, ThemeAppearance, ThemeProps, ThemeTokens } from '../theme';

import Container from './container';
import Content from './content';

interface LozengeProps {
  /**
   * The appearance type.
   */
  appearance?: ThemeAppearance;

  /**
   * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
   */
  children?: ReactNode;

  /**
   * Determines whether to apply the bold style or not.
   */
  isBold?: boolean;

  /**
   * max-width of lozenge container. Default to 200px.
   */
  maxWidth?: number | string;

  /**
   * The theme the component should use.
   */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
}

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge = memo(
  ({
    theme,
    children,
    testId,
    isBold = false,
    appearance = 'default',
    maxWidth = 200,
  }: // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  LozengeProps) => {
    const props = { theme, children, testId, isBold, appearance, maxWidth };
    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer {...props}>
          {(themeTokens) => (
            <Container testId={testId} {...themeTokens}>
              <Content {...themeTokens}>{children}</Content>
            </Container>
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  },
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;
