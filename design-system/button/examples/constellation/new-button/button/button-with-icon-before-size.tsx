import React from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';

import Button from '../../../../src/new';
const ButtonIconBeforeSizeExample = () => {
  return (
    <Button
      iconBefore={LinkIcon}
      appearance="warning"
      UNSAFE_iconBefore_size="small"
    >
      Icon with size override
    </Button>
  );
};

export default ButtonIconBeforeSizeExample;
