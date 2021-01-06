import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage type="connectivity">
    <p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#">Log in</a> to see more information
    </p>
  </InlineMessage>
);
