/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import Select from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import Button, {
  ButtonGroup,
  Theme as ButtonTheme,
  CustomThemeButton,
} from '../src';

type Option = {
  [key: string]: any;
  label: string;
  value: ThemeModes;
};

const options: Option[] = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Mode' },
];

function ThemeModeSwitcher({
  Component,
  title,
}: {
  Component: typeof Button | typeof CustomThemeButton;
  title: string;
}) {
  const [mode, setMode] = useState<ThemeModes>('light');
  const getMode = useCallback(() => ({ mode }), [mode]);

  return (
    <React.Fragment>
      <h3 css={{ marginBottom: 15 }}>Light + Dark Themes (using {title})</h3>
      <div
        /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
        style={{
          padding: 20,
          backgroundColor: mode === 'light' ? colors.N0 : colors.N800,
          border: `2px solid ${colors.N800}`,
          borderRadius: '5px',
        }}
        /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
      >
        <GlobalTheme.Provider value={getMode}>
          <ButtonTheme.Provider
            value={(current, props) => current({ ...props, mode })}
          >
            <ButtonGroup>
              <Component>Default Button</Component>
              <Component appearance="primary">Primary Button</Component>
              <Component appearance="subtle">Subtle Button</Component>
            </ButtonGroup>
          </ButtonTheme.Provider>
          <Select
            styles={{
              container: (provided) => ({
                ...provided,
                marginTop: 10,
              }),
            }}
            options={options}
            defaultValue={options[0]}
            onChange={(option) => {
              if (option && !Array.isArray(option)) {
                setMode((option as Option).value);
              }
            }}
          />
        </GlobalTheme.Provider>
      </div>
    </React.Fragment>
  );
}

function Example() {
  return (
    <React.Fragment>
      <ThemeModeSwitcher
        title="CustomThemeButton"
        Component={CustomThemeButton}
      />

      <ThemeModeSwitcher title="Button" Component={Button} />
    </React.Fragment>
  );
}

export default () => <Example />;
