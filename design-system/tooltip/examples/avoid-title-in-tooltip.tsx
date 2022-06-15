import React from 'react';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Design System Tooltip" position="right">
    {(tooltipProps) => (
      <Button title="Native tooltip" {...tooltipProps}>
        Hover Over Me - I have a title attribute
      </Button>
    )}
  </Tooltip>
);
