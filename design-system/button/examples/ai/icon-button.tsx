import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import DeleteIcon from '@atlaskit/icon/core/delete';
import InfoIcon from '@atlaskit/icon/core/status-information';

export default [
	<IconButton icon={AddIcon} label="Add new item" appearance="primary" />,
	<IconButton icon={InfoIcon} label="Show information" appearance="subtle" spacing="compact" />,
	<IconButton icon={DeleteIcon} label="Delete permanently" appearance="discovery" shape="circle" />,
];
