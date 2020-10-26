import React from 'react';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Hello World" hideTooltipOnClick>
    <Button>Clicking hides the tooltip</Button>
  </Tooltip>
);
