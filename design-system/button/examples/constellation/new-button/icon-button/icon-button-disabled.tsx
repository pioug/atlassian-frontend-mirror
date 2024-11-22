import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/glyph/edit';

const IconButtonDisabledExample = () => {
	return <IconButton isDisabled icon={EditIcon} label="Edit" />;
};

export default IconButtonDisabledExample;
