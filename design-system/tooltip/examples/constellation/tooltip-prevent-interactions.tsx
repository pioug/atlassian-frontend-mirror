import React from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function TooltipPreventInteractionsExample(): React.JSX.Element {
	return (
		<Stack space="space.100">
			<Stack space="space.100">
				<p>Default tooltip</p>
				<Inline space="space.100">
					<Tooltip content="This is a tooltip" position="right">
						{(tooltipProps) => (
							<Button appearance="primary" {...tooltipProps}>
								Hover me first
							</Button>
						)}
					</Tooltip>
					<Button>Hover me second</Button>
				</Inline>
			</Stack>
			<Stack space="space.100">
				<p>Tooltip ignoring pointer events</p>
				<Inline space="space.100">
					<Tooltip content="This is a tooltip" position="right" ignoreTooltipPointerEvents>
						{(tooltipProps) => (
							<Button appearance="primary" {...tooltipProps}>
								Hover me first
							</Button>
						)}
					</Tooltip>
					<Button>Hover me second</Button>
				</Inline>
			</Stack>
		</Stack>
	);
}
