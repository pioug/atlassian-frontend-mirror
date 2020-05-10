import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage type="error">
    <p>This name is already in use. Try another.</p>
  </InlineMessage>
);
