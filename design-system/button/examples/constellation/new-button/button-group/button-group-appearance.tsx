import React from 'react';

import { ButtonGroup, UNSAFE_BUTTON } from '../../../../src';

const ButtonGroupAppearanceExample = () => {
  return (
    <ButtonGroup appearance="primary">
      <UNSAFE_BUTTON>First button</UNSAFE_BUTTON>
      <UNSAFE_BUTTON>Second button</UNSAFE_BUTTON>
      <UNSAFE_BUTTON>Third button</UNSAFE_BUTTON>
    </ButtonGroup>
  );
};

export default ButtonGroupAppearanceExample;
