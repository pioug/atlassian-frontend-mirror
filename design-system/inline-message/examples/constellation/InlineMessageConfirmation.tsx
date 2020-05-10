import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage type="confirmation" secondaryText="Files have been added">
    <p>You have successfully uploaded 3 files.</p>
    <p>
      <a href="#">View files</a>
    </p>
  </InlineMessage>
);
