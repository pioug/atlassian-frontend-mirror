import React from 'react';

import AddIcon from '@atlaskit/icon/glyph/add';

import { IconButton } from '../../../../src/new';

const IconButtonPrimaryExample = () => {
  return (
    <IconButton icon={AddIcon} label="Create page" isTooltipDisabled={false} />
  );
};

export default IconButtonPrimaryExample;
