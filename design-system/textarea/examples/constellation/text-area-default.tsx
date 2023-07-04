import React from 'react';

import TextArea from '../../src';

export default () => (
  <TextArea
    resize="auto"
    maxHeight="20vh"
    name="area"
    defaultValue="Add a message here"
  />
);
