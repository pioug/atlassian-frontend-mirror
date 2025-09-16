import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

export default [
	<Tooltip content="This is a tooltip">
		<Button>Hover me</Button>
	</Tooltip>,
	<Tooltip content="Important information" position="top">
		<span>Hover for info</span>
	</Tooltip>,
];
