import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage type="info" secondaryText="Learn more">
    <p>
      <strong>Want more information?</strong>
    </p>
    <p>
      <a href="#">Log in</a> to setup your Bitbucket account.
    </p>
  </InlineMessage>
);
