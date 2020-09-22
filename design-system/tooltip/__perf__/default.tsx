import React from 'react';

import Button from '@atlaskit/button/custom-theme-button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Hello World">
    <Button appearance="primary">Hover over me</Button>
  </Tooltip>
);
