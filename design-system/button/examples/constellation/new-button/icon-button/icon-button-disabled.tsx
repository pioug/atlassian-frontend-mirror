import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/core/edit';

const IconButtonDisabledExample = (): React.JSX.Element => {
	return <IconButton isDisabled icon={EditIcon} label="Edit" />;
};

export default IconButtonDisabledExample;
