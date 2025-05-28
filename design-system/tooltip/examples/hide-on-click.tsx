import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

export default function HideOnClickExample() {
	return (
		<Tooltip content="This is a tooltip" hideTooltipOnClick>
			{(tooltipProps) => <Button {...tooltipProps}>Clicking hides the tooltip</Button>}
		</Tooltip>
	);
}
