import React from 'react';

import Button, { ButtonGroup } from '../../src';

export default () => (
  <ButtonGroup>
    <Button>Default</Button>
    <Button spacing="compact">Compact</Button>
    <Button spacing="none" appearance="subtle-link">
      None
    </Button>
  </ButtonGroup>
);
