import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function DelayExample(): React.JSX.Element {
	return (
		<div>
			<h2 id="delay-options-title">Delay options</h2>
			<ButtonGroup titleId="delay-options-title">
				<Tooltip content="No delay" delay={0}>
					{(tooltipProps) => <Button {...tooltipProps}>No delay</Button>}
				</Tooltip>
				<Tooltip content="1s delay" delay={1000}>
					{(tooltipProps) => <Button {...tooltipProps}>1s delay</Button>}
				</Tooltip>
				<Tooltip content="Default delay">
					{(tooltipProps) => <Button {...tooltipProps}>Default delay</Button>}
				</Tooltip>
			</ButtonGroup>
		</div>
	);
}
