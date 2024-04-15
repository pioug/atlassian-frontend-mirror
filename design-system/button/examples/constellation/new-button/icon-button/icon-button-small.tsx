import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import { IconButton } from '../../../../src/new';

const IconButtonSmallExample = () => {
  return (
    <IconButton
      icon={(iconProps) => <StarFilledIcon {...iconProps} size="small" />}
      label="Add to favorites"
    />
  );
};

export default IconButtonSmallExample;
