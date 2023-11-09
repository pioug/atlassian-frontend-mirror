import React from 'react';

import { UNSAFE_LINK_BUTTON } from '../../../../src';

const ButtonDisabledExample = () => {
  return (
    <UNSAFE_LINK_BUTTON
      href="https://atlassian.com/"
      appearance="primary"
      isDisabled
    >
      Disabled link button
    </UNSAFE_LINK_BUTTON>
  );
};

export default ButtonDisabledExample;
