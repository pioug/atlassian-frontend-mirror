import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage
    type="warning"
    secondaryText="New users will be sent a request to join"
  >
    <p>
      <strong>Multiple accounts</strong>
    </p>
    <p>
      We will automatically invite any new users to Bitbucket, depending on your
      account settings.
    </p>
  </InlineMessage>
);
