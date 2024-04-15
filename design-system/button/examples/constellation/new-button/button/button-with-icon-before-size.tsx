import React from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';

import Button from '../../../../src/new';
const ButtonIconBeforeSizeExample = () => {
  return (
    <Button
      iconBefore={(iconProps) => <LinkIcon {...iconProps} size="small" />}
      appearance="warning"
    >
      Icon with size override
    </Button>
  );
};

export default ButtonIconBeforeSizeExample;
