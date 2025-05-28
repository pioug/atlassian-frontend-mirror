import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

export default function AvoidTitleInTooltipExample() {
	return (
		<Tooltip
			content="Never use the title attribute. Double tooltips will be displayed."
			position="right"
		>
			{(tooltipProps) => (
				<Button
					title="This is a native tooltip from the title attribute. Don't do this, it isn't accessible."
					{...tooltipProps}
				>
					Hover to reveal my tooltip and title attribute
				</Button>
			)}
		</Tooltip>
	);
}
