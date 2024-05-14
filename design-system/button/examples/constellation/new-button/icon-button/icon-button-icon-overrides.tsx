import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { token } from '@atlaskit/tokens';

import { IconButton } from '../../../../src/new';

const IconButtonSmallExample = () => {
  return (
    <IconButton
      icon={(iconProps) => (
        <StarFilledIcon
          {...iconProps}
          size="small"
          primaryColor={token('color.icon.accent.orange')}
        />
      )}
      label="Add to favorites"
    />
  );
};

export default IconButtonSmallExample;
