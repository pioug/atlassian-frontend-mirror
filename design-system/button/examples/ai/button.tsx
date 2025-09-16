import React from 'react';

import Button from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import DeleteIcon from '@atlaskit/icon/core/delete';

export default [
	<Button appearance="primary" iconAfter={AddIcon}>
		Create
	</Button>,
	<Button appearance="subtle">Cancel</Button>,
	<Button appearance="danger" iconBefore={DeleteIcon}>
		Remove
	</Button>,
];
