import React from 'react';

import Button from '@atlaskit/button/default/button';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function TooltipTruncateExample(): React.JSX.Element {
	return (
		<Tooltip
			truncate
			content="This is a very very long tooltip that has been designed to take up a lot of space and truncate"
		>
			{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
		</Tooltip>
	);
}
