import React from 'react';

import { UNSAFE_BUTTON } from '../../../../src';

const ButtonDisabledExample = () => {
  return (
    <UNSAFE_BUTTON appearance="primary" isDisabled>
      Disabled button
    </UNSAFE_BUTTON>
  );
};

export default ButtonDisabledExample;
