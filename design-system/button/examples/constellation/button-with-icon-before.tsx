import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../src';

const ButtonIconBeforeExample = () => {
  return (
    <Button
      iconBefore={<StarFilledIcon label="" size="medium" />}
      appearance="primary"
    >
      Icon before
    </Button>
  );
};

export default ButtonIconBeforeExample;
