import React from 'react';

import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

import { DatePicker, TimePicker } from '../src';

export default () => (
	<Box>
		<Heading size="xlarge">Date / Time examples</Heading>

		<Box paddingBlock="space.200">
			<Heading size="large">Time - Using explicit label</Heading>
			<Label htmlFor="arrival">Arrival time</Label>
			<TimePicker id="arrival" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Time - Using label prop only (no visible label)</Heading>
			<TimePicker label="Departure time" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Date - Using explicit label</Heading>
			<Label htmlFor="birthday">Birthday</Label>
			<DatePicker testId="test" id="birthday" />
		</Box>

		<Box paddingBlock="space.200">
			<Heading size="large">Date - Using label prop only (no visible label)</Heading>
			<DatePicker label="End date" />
		</Box>
	</Box>
);
