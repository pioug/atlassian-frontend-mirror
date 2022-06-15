import React from 'react';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Hello World" hideTooltipOnClick>
    {(tooltipProps) => (
      <Button {...tooltipProps}>Clicking hides the tooltip</Button>
    )}
  </Tooltip>
);
