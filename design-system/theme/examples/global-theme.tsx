import React from 'react';

import Theme from '../src';

export default () => (
  <Theme.Consumer>
    {(tokens) => (
      <div>
        The default mode is <code>{tokens.mode}</code>.
      </div>
    )}
  </Theme.Consumer>
);
