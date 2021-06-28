import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../src';

const ButtonIconBeforeExample = () => {
  return (
    <Button
      iconBefore={<StarFilledIcon label="Star icon" size="small" />}
      appearance="primary"
    >
      Icon after
    </Button>
  );
};

export default ButtonIconBeforeExample;
