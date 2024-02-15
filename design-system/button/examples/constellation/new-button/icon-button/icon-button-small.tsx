import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import { IconButton } from '../../../../src/new';

const IconButtonSmallExample = () => {
  return (
    <IconButton
      UNSAFE_size="small"
      icon={StarFilledIcon}
      label="Add to favorites"
    />
  );
};

export default IconButtonSmallExample;
