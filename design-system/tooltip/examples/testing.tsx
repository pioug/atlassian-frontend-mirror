import React from 'react';
import Button from '@atlaskit/button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Hello World" testId="my-tooltip">
    <Button testId="my-button">Hover Over Me</Button>
  </Tooltip>
);
