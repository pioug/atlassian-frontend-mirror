import React from 'react';

import { ButtonGroup, UNSAFE_BUTTON } from '../../../../src';

const ButtonGroupDefaultExample = () => {
  return (
    <ButtonGroup>
      <UNSAFE_BUTTON>First button</UNSAFE_BUTTON>
      <UNSAFE_BUTTON>Second button</UNSAFE_BUTTON>
      <UNSAFE_BUTTON>Third button</UNSAFE_BUTTON>
    </ButtonGroup>
  );
};

export default ButtonGroupDefaultExample;
