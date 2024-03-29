/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

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
  const selectId = `${title}--select`;

  return (
    <React.Fragment>
      <h3 css={{ marginBottom: token('space.200', '16px') }}>
        Light + Dark Themes (using {title})
      </h3>
      <div
        style={{
          padding: token('space.250', '20px'),
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
          <div style={{ marginTop: '1rem' }}>
            <Label htmlFor={selectId}>Select a theme</Label>
            <Select
              styles={{
                container: (provided) => ({
                  ...provided,
                  marginTop: token('space.150', '12px'),
                }),
              }}
              inputId={selectId}
              options={options}
              defaultValue={options[0]}
              onChange={(option) => {
                if (option && !Array.isArray(option)) {
                  setMode((option as Option).value);
                }
              }}
            />
          </div>
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
