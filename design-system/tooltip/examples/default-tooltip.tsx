import React from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

export default function DefaultTooltipExample(): React.JSX.Element {
	return (
		<Tooltip content="This is a tooltip" testId="default-tooltip">
			{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
		</Tooltip>
	);
}
