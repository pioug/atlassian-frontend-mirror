import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

export default () => (
	<Tooltip content="This is a tooltip">
		{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
	</Tooltip>
);
