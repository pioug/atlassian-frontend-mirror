import React from 'react';

import Button from '@atlaskit/button/new';

import Tooltip from '../src';

export default () => (
  <Tooltip content="This is a tooltip" hideTooltipOnClick>
    {(tooltipProps) => (
      <Button {...tooltipProps}>Clicking hides the tooltip</Button>
    )}
  </Tooltip>
);
