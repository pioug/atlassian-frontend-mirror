import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { addons, types } from '@storybook/addons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AddonPanel } from '@storybook/components';

import {
  ADDON_ID,
  EVENT_THEME_CHANGED,
  PANEL_ID,
  PANEL_TITLE,
} from './constants';

interface TokensPanelProps {
  onThemeChange: (theme: string) => void;
}

const TokensPanel = ({ onThemeChange }: TokensPanelProps) => (
  <div style={{ padding: '20px' }}>
    <h1>ADS Design Tokens</h1>
    <select
      name="theme"
      onChange={(event) => onThemeChange(event.target.value)}
    >
      <option value="none">Disable theme</option>
      <option value="light">Light theme</option>
      <option value="dark">Dark theme</option>
    </select>
  </div>
);

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: PANEL_TITLE,
    render: ({ active, key }) => (
      <AddonPanel active={active || false} key={key}>
        <TokensPanel
          onThemeChange={(theme) => api.emit(EVENT_THEME_CHANGED, theme)}
        />
      </AddonPanel>
    ),
  });
});
