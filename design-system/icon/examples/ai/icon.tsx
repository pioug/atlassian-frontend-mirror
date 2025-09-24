import React from 'react';

import AddIcon from '@atlaskit/icon/core/add';
import DeleteIcon from '@atlaskit/icon/core/delete';
import StarIcon from '@atlaskit/icon/core/star-starred';
import { token } from '@atlaskit/tokens';

export default [
	<AddIcon label="Add" />,
	<StarIcon label="Star" color="currentColor" />,
	<DeleteIcon label="Delete" color={token('color.icon.danger')} />,
];
