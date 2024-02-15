import React from 'react';

import { LinkButton } from '../../../../src/new';
const ButtonDisabledExample = () => {
  return (
    <LinkButton href="https://atlassian.com/" appearance="primary" isDisabled>
      Disabled link button
    </LinkButton>
  );
};

export default ButtonDisabledExample;
