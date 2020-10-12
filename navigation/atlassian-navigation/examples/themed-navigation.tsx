import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import {
  AppSwitcher,
  AtlassianNavigation,
  generateTheme,
  ProductHome,
  Settings,
} from '../src';

import { DefaultCreate } from './shared/Create';
import { defaultPrimaryItems } from './shared/PrimaryItems';

export const JiraProductHome = () => (
  <ProductHome
    testId="jira-home"
    onClick={console.log}
    icon={JiraIcon}
    logo={JiraLogo}
  />
);

const theme = generateTheme({
  name: 'high-contrast',
  backgroundColor: '#272727',
  highlightColor: '#E94E34',
});

const ThemingExample = () => (
  <AtlassianNavigation
    label="site"
    testId="themed"
    renderAppSwitcher={() => (
      <AppSwitcher testId="app-switcher" tooltip="Switch apps" />
    )}
    primaryItems={defaultPrimaryItems.slice(0, 1)}
    renderCreate={DefaultCreate}
    renderProductHome={JiraProductHome}
    renderSettings={() => <Settings testId="settings" tooltip="Settings" />}
    theme={theme}
  />
);

export default ThemingExample;
