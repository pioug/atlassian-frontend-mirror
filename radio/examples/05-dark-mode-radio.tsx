import React, { Component, SyntheticEvent } from 'react';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { RadioGroup } from '../src';

const options = [
  { value: 'light', name: 'numbers', label: 'Light Mode' },
  { value: 'dark', name: 'numbers', label: 'Dark Mode' },
];

type ThemeType = 'light' | 'dark';
export default class ThemedRadio extends Component<
  any,
  { themeMode: ThemeType }
> {
  state = {
    themeMode: 'dark' as ThemeType,
  };

  switchTheme = ({ currentTarget: { value } }: SyntheticEvent<any>) => {
    this.setState({
      themeMode: value,
    });
  };

  render() {
    const { themeMode } = this.state;
    return (
      <AtlaskitThemeProvider mode={themeMode}>
        <RadioGroup
          defaultValue={this.state.themeMode}
          options={options}
          onChange={this.switchTheme}
        />
      </AtlaskitThemeProvider>
    );
  }
}
