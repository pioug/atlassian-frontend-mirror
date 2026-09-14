import React from 'react';

import Button from '@atlaskit/button/default/button';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function HideOnMouseDownExample(): React.JSX.Element {
	return (
		<React.Fragment>
			<Tooltip content="This is a tooltip" hideTooltipOnMouseDown>
				{(tooltipProps) => <Button {...tooltipProps}>Mousedown event hides the tooltip</Button>}
			</Tooltip>
			<p>
				The tooltip will hide when the mouse down event is triggered (when you start clicking). It
				avoids displaying the tooltip when content is removed.
			</p>
		</React.Fragment>
	);
}
