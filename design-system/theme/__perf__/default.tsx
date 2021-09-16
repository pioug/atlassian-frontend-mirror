import React from 'react';

import Theme, { GlobalThemeTokens } from '../src';

export default () => (
  <Theme.Consumer>
    {(tokens: GlobalThemeTokens) => (
      <div>
        The default mode is <code>{tokens.mode}</code>.
      </div>
    )}
  </Theme.Consumer>
);
