import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import exenv from 'exenv';
import { ThemeModes, AtlaskitThemeProps, ThemedValue } from '../types';
import * as colors from '../colors';

import { CHANNEL, DEFAULT_THEME_MODE } from '../constants';

// For forward-compat until everything is upgraded.
import Theme from './Theme';

function getStylesheetResetCSS(backgroundColor: string) {
  return `
    body { background: ${backgroundColor}; }
  `;
}

interface Props {
  children: React.ReactNode;
  mode: ThemeModes;
  background: ThemedValue<string>;
}

function buildThemeState(mode: ThemeModes): AtlaskitThemeProps {
  return { theme: { [CHANNEL]: { mode } } };
}

const LegacyReset = styled.div<{
  background: ThemedValue<string>;
}>`
  background-color: ${(p) => p.background};
  color: ${colors.text};

  a {
    color: ${colors.link};
  }
  a:hover {
    color: ${colors.linkHover};
  }
  a:active {
    color: ${colors.linkActive};
  }
  a:focus {
    outline-color: ${colors.linkOutline};
  }
  h1 {
    color: ${colors.heading};
  }
  h2 {
    color: ${colors.heading};
  }
  h3 {
    color: ${colors.heading};
  }
  h4 {
    color: ${colors.heading};
  }
  h5 {
    color: ${colors.heading};
  }
  h6 {
    color: ${colors.subtleHeading};
  }
  small {
    color: ${colors.subtleText};
  }
`;

type GetMode = () => { mode: ThemeModes };

export default class AtlaskitThemeProvider extends Component<
  Props,
  AtlaskitThemeProps
> {
  stylesheet?: HTMLStyleElement;
  themeFnMap: Record<ThemeModes, GetMode>;

  static defaultProps = {
    mode: DEFAULT_THEME_MODE,
    background: colors.background,
  };

  static childContextTypes = {
    hasAtlaskitThemeProvider: PropTypes.bool,
  };

  static contextTypes = {
    hasAtlaskitThemeProvider: PropTypes.bool,
  };

  constructor(props: Props) {
    super(props);
    this.state = buildThemeState(props.mode);
    this.themeFnMap = {
      dark: () => ({ mode: this.state.theme[CHANNEL].mode }),
      light: () => ({ mode: this.state.theme[CHANNEL].mode }),
    };
  }

  getChildContext() {
    return { hasAtlaskitThemeProvider: true };
  }

  UNSAFE_componentWillMount() {
    if (!this.context.hasAtlaskitThemeProvider && exenv.canUseDOM) {
      const css = getStylesheetResetCSS(this.props.background(this.state));
      this.stylesheet = document.createElement('style');
      this.stylesheet.type = 'text/css';
      this.stylesheet.innerHTML = css;
      if (document && document.head) {
        document.head.appendChild(this.stylesheet);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.mode !== this.props.mode) {
      const newThemeState = buildThemeState(newProps.mode);
      if (this.stylesheet) {
        const css = getStylesheetResetCSS(newProps.background(newThemeState));
        this.stylesheet.innerHTML = css;
      }
      this.setState(newThemeState);
    }
  }

  componentWillUnmount() {
    if (this.stylesheet && document && document.head) {
      document.head.removeChild(this.stylesheet);
      delete this.stylesheet;
    }
  }

  render() {
    const { children } = this.props;
    const { theme } = this.state;
    return (
      /* Wrapping the new provider around the old one provides forward
      compatibility when using the old provider for styled components. This
      allows us to use components converted to use the new API with consumers
      using the old provider along side components that may still be using the
      old theming API. */
      <Theme.Provider value={this.themeFnMap[this.props.mode]}>
        <ThemeProvider theme={theme}>
          <LegacyReset background={this.props.background}>
            {children}
          </LegacyReset>
        </ThemeProvider>
      </Theme.Provider>
    );
  }
}
