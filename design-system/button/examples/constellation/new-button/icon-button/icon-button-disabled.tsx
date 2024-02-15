import React from 'react';

import EditIcon from '@atlaskit/icon/glyph/edit';

import { IconButton } from '../../../../src/new';

const IconButtonDisabledExample = () => {
  return <IconButton isDisabled icon={EditIcon} label="Edit" />;
};

export default IconButtonDisabledExample;
