import React, { Component } from 'react';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import Button from '@atlaskit/button/standard-button';
import { AtlaskitThemeProvider } from '../src';

interface Props {}
type State = { themeMode: 'light' | 'dark' };

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<Props, State> {
  state: State = { themeMode: 'light' };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: themeMode === 'light' ? 'dark' : 'light',
    });
  };

  render() {
    const { themeMode } = this.state;
    return (
      <AtlaskitThemeProvider mode={themeMode}>
        <div
          style={{
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: 8,
          }}
        >
          <CustomThemeButton onClick={this.switchTheme}>
            Switch theme ({themeMode})
          </CustomThemeButton>
          <CustomThemeButton href="#">
            anchor button (CustomThemeButton)
          </CustomThemeButton>
          <Button href="#">anchor button (StandardButton)</Button>
          <a href="#">Standard anchor</a>
          <p>This is the old theming API</p>
        </div>
      </AtlaskitThemeProvider>
    );
  }
}
