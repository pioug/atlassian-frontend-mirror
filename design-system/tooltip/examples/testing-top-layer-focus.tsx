import React from 'react';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

/**
 * Test fixture for the `Tooltip` top-layer focus contract.
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<label htmlFor="external-input">External input</label>
				<input id="external-input" data-testid="external-input" type="text" />

				<Inline space="space.100">
					<Tooltip content="This is a tooltip" testId="tooltip">
						{(tooltipProps) => (
							<Button {...tooltipProps} testId="tooltip-trigger">
								Hover for tooltip
							</Button>
						)}
					</Tooltip>
				</Inline>
			</Stack>
		</Box>
	);
}
