import React, { Component } from 'react';
import { createTheme, ThemeProp } from '../src';

interface LocalThemeProps {
  hover: boolean;
}

interface ThemeTokens {
  backgroundColor: string;
  textColor: string;
}

const defaultButtonTheme = (props: LocalThemeProps) => ({
  backgroundColor: props.hover ? '#ddd' : '#eee',
  textColor: '#333',
});

const contextButtonTheme: ThemeProp<ThemeTokens, LocalThemeProps> = (
  theme,
  props,
) => {
  return {
    ...theme(props),
    backgroundColor: props.hover ? 'rebeccapurple' : 'palevioletred',
    textColor: props.hover ? '#fff' : 'papayawhip',
  };
};

const propButtonTheme: ThemeProp<ThemeTokens, LocalThemeProps> = (
  theme,
  props,
) => {
  return {
    ...theme(props),
    backgroundColor: props.hover ? 'palevioletred' : 'rebeccapurple',
  };
};

const Theme = createTheme<ThemeTokens, LocalThemeProps>(defaultButtonTheme);

interface Props {
  children?: React.ReactNode;
  theme?: ThemeProp<ThemeTokens, LocalThemeProps>;
}

interface State {
  hover: boolean;
}

class Button extends Component<Props, State> {
  state = {
    hover: false,
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  render() {
    return (
      <Theme.Provider value={this.props.theme}>
        <Theme.Consumer hover={this.state.hover}>
          {tokens => {
            const { backgroundColor, textColor: color } = tokens;
            return (
              <button
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                style={{
                  backgroundColor,
                  border: 0,
                  borderRadius: 3,
                  color,
                  cursor: 'pointer',
                  marginBottom: 10,
                  marginRight: 10,
                  padding: 10,
                }}
                type="button"
              >
                {this.props.children}
              </button>
            );
          }}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}

export default () => (
  <>
    <Button>Default</Button>
    <Theme.Provider value={contextButtonTheme}>
      <Button>Context</Button>
      <Button theme={propButtonTheme}>Custom</Button>
    </Theme.Provider>
  </>
);
