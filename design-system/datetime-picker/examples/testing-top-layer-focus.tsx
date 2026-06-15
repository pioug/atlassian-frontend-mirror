import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';

/**
 * Test fixture for the `DatePicker` top-layer focus contract.
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	return (
		<Box padding="space.200">
			<Stack space="space.100">
				<Label htmlFor="date-picker">Date</Label>
				<DatePicker testId="date-picker" id="date-picker" />
			</Stack>
		</Box>
	);
}
