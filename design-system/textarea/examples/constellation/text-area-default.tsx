import React from 'react';

import TextArea from '../../src';

export default () => (
  <div css={{ '> *': { margin: '24px 0' } }}>
    <TextArea
      resize="auto"
      maxHeight="20vh"
      name="area"
      defaultValue="Add a message here"
    />
  </div>
);
