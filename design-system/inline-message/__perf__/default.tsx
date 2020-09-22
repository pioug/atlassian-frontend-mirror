import React from 'react';

import InlineMessage from '../src';

export default () => (
  <div>
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>
  </div>
);
