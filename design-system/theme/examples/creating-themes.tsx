import React from 'react';

import color from 'color';

import { createTheme } from '../src';

interface ThemeTokens {
  backgroundColor?: string;
  textColor?: string;
}

const Theme = createTheme<ThemeTokens, void>(() => ({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: '#333',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  textColor: '#eee',
}));

const DisplayThemeColors = () => (
  <Theme.Consumer>
    {({ textColor, backgroundColor }) => (
      <div>
        <div
          style={{
            backgroundColor: textColor,
            color: `${color(textColor).negate()}`,
            display: 'inline-block',
            marginBottom: 10,
            marginRight: 10,
            padding: 10,
          }}
        >
          {textColor}
        </div>
        <div
          style={{
            backgroundColor: backgroundColor,
            color: `${color(backgroundColor).negate()}`,
            display: 'inline-block',
            marginBottom: 10,
            marginRight: 10,
            padding: 10,
          }}
        >
          {backgroundColor}
        </div>
      </div>
    )}
  </Theme.Consumer>
);

export default () => (
  <React.Fragment>
    <DisplayThemeColors />
    <Theme.Provider
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      value={(themeFn) => ({ ...themeFn(), backgroundColor: 'palevioletred' })}
    >
      <DisplayThemeColors />
    </Theme.Provider>
  </React.Fragment>
);
