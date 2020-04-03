import React, { Component } from 'react';
import Page from '@atlaskit/page';
import Toggle from '@atlaskit/toggle';
import SingleSelect from '@atlaskit/single-select';
import { colors } from '@atlaskit/theme';

import { Skeleton, presetThemes, createGlobalTheme } from '../src';

const themeOptions = [
  {
    items: [
      { content: 'Container', value: 'container' },
      { content: 'Global', value: 'global' },
      { content: 'Settings', value: 'settings' },
      { content: 'Custom', value: 'custom' },
    ],
  },
];

const themes = {
  global: {
    globalTheme: presetThemes.global,
    containerTheme: presetThemes.global,
  },
  container: {
    globalTheme: presetThemes.global,
    containerTheme: presetThemes.container,
  },
  settings: {
    globalTheme: presetThemes.settings,
    containerTheme: presetThemes.settings,
  },
  custom: {
    globalTheme: {
      ...presetThemes.global,
      ...createGlobalTheme(colors.T300, colors.P500),
    },
    containerTheme: {
      ...presetThemes.global,
      ...createGlobalTheme(colors.T300, colors.P400),
    },
  },
};

export default class SkeletonInteractiveStory extends Component {
  state = {
    isCollapsed: false,
    theme: 'container',
  };

  handleThemeChange = e => {
    this.setState({
      theme: e.item.value,
    });
  };

  render() {
    return (
      <Page
        navigation={
          <Skeleton
            isCollapsed={this.state.isCollapsed}
            {...themes[this.state.theme]}
          />
        }
      >
        <p>Collapsed</p>
        <Toggle
          onChange={() =>
            this.setState({ isCollapsed: !this.state.isCollapsed })
          }
        />
        <p>Sidebar Appearance</p>
        <SingleSelect
          items={themeOptions}
          defaultSelected={themeOptions[0].items[0]}
          onSelected={this.handleThemeChange}
        />
      </Page>
    );
  }
}
