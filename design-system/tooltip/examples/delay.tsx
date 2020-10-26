import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';

export default () => (
  <ButtonGroup>
    <Tooltip content="No delay" delay={0}>
      <Button>No delay</Button>
    </Tooltip>
    <Tooltip content="1s delay" delay={1000}>
      <Button>1s delay</Button>
    </Tooltip>
    <Tooltip content="Default delay">
      <Button>Default delay</Button>
    </Tooltip>
  </ButtonGroup>
);
