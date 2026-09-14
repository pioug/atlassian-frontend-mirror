import React from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function TooltipDefaultExample(): React.JSX.Element {
	return (
		<Inline space="space.100">
			<Tooltip content="This is a tooltip">
				{(tooltipProps) => (
					<Button appearance="primary" {...tooltipProps}>
						Single line example
					</Button>
				)}
			</Tooltip>

			<Tooltip content="This is a tooltip with a longer message that will wrap at 240px to maintain readability.">
				{(tooltipProps) => (
					<Button appearance="primary" {...tooltipProps}>
						Multi-line example
					</Button>
				)}
			</Tooltip>
		</Inline>
	);
}
