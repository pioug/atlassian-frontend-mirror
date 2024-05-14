import React from 'react';

import { ButtonGroup } from '../../../../src';
import Button, { LinkButton } from '../../../../src/new';

const ButtonSpacingExample = () => {
  return (
    <ButtonGroup>
      <Button appearance="primary">Default</Button>
      <Button appearance="primary" spacing="compact">
        Compact
      </Button>
      <LinkButton href="/" spacing="none" appearance="subtle-link">
        None
      </LinkButton>
    </ButtonGroup>
  );
};

export default ButtonSpacingExample;
