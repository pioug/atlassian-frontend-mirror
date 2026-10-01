import React from 'react';

import Button from '@atlaskit/button/default/button';
import Tooltip from '@atlaskit/tooltip/Tooltip';

/**
 * `hideTooltipOnClick` is deprecated. With `platform-dst-top-layer-tooltip`, a
 * press on the trigger closes the tooltip by default.
 */
export default function HideOnClickExample(): React.JSX.Element {
	return (
		<Tooltip content="This is a tooltip" hideTooltipOnClick>
			{(tooltipProps) => <Button {...tooltipProps}>Clicking hides the tooltip</Button>}
		</Tooltip>
	);
}
