import React from 'react';

import { ButtonGroup, UNSAFE_BUTTON } from '../../../../src';

const ButtonPaddingExample = () => {
  return (
    <ButtonGroup>
      <UNSAFE_BUTTON appearance="primary">Default</UNSAFE_BUTTON>
      <UNSAFE_BUTTON appearance="primary" spacing="compact">
        Compact
      </UNSAFE_BUTTON>
      <UNSAFE_BUTTON spacing="none" appearance="subtle-link">
        None
      </UNSAFE_BUTTON>
    </ButtonGroup>
  );
};

export default ButtonPaddingExample;
