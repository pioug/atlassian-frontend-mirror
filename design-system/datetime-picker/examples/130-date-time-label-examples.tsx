import React from 'react';

import { DatePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

export default () => (
	<Box>
		<Heading size="xlarge">Date / Time examples</Heading>

		<Box paddingBlock="space.200">
			<Heading size="large">Time - Using explicit label</Heading>
			<Label htmlFor="arrival">Arrival time</Label>
			<TimePicker clearControlLabel="Clear arrival time" id="arrival" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Time - Using label prop only (no visible label)</Heading>
			<TimePicker clearControlLabel="Clear departure time" label="Departure time" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Date - Using explicit label</Heading>
			<Label htmlFor="birthday">Birthday</Label>
			<DatePicker testId="test" id="birthday" clearControlLabel="Clear birthday" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Date - Using label prop only (no visible label)</Heading>
			<DatePicker clearControlLabel="Clear end date" label="End date" />
		</Box>
	</Box>
);
