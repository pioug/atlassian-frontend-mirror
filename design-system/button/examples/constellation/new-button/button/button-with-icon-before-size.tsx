import React from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';

import { UNSAFE_BUTTON } from '../../../../src';

const ButtonIconBeforeSizeExample = () => {
  return (
    <UNSAFE_BUTTON
      iconBefore={LinkIcon}
      appearance="warning"
      UNSAFE_iconBefore_size="small"
    >
      Icon with size override
    </UNSAFE_BUTTON>
  );
};

export default ButtonIconBeforeSizeExample;
