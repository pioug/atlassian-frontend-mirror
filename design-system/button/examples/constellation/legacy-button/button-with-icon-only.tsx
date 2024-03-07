import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../../src';

const ButtonWithIconOnlyExample = () => {
  return (
    <Button
      iconAfter={<StarFilledIcon label="" size="medium" />}
      appearance="primary"
      aria-label="Unstar this page"
    />
  );
};

export default ButtonWithIconOnlyExample;
