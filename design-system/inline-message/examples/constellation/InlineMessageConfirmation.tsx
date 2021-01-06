import React from 'react';

import InlineMessage from '../../src';

export default () => (
  <InlineMessage type="confirmation" secondaryText="Files have been added">
    <p>You have successfully uploaded 3 files.</p>
    <p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#">View files</a>
    </p>
  </InlineMessage>
);
