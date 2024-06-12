import React from 'react';

import Button from '@atlaskit/button/new';

import Tooltip from '../../src';

export default () => (
	<Tooltip
		content="Never use the title attribute. Double tooltips will be displayed."
		position="right"
	>
		{(tooltipProps) => (
			<Button
				appearance="primary"
				title="This is a native tooltip from the title attribute. Don't do this, it isn't accessible."
				{...tooltipProps}
			>
				Hover to reveal my tooltip and title attribute
			</Button>
		)}
	</Tooltip>
);
