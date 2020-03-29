import { ThemeProp } from '@atlaskit/theme/components';
import React, { PureComponent, ReactNode } from 'react';
import Container from './Container';
import Content from './Content';
import { Theme, ThemeAppearance, ThemeProps, ThemeTokens } from '../theme';

interface Props {
  /** The appearance type. */
  appearance: ThemeAppearance;

  /** Elements to be rendered inside the lozenge. This should ideally be just a word or two. */
  children?: ReactNode;

  /** Determines whether to apply the bold style or not. */
  isBold: boolean;

  /** max-width of lozenge container. Default to 200px. */
  maxWidth: number | string;

  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

export default class Lozenge extends PureComponent<Props> {
  static defaultProps = {
    isBold: false,
    appearance: 'default',
    maxWidth: 200,
  };

  render() {
    const { theme, children, testId } = this.props;
    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer {...this.props}>
          {themeTokens => (
            <Container testId={testId} {...themeTokens}>
              <Content {...themeTokens}>{children}</Content>
            </Container>
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}
