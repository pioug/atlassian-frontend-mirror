import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DateTimePicker } from '../../src';

const DateTimePickerLocaleExample = () => (
	<>
		<Label htmlFor="locale-1">Date and time in US</Label>
		<DateTimePicker
			id="locale-1"
			clearControlLabel="Clear Date and time in US"
			datePickerProps={{ shouldShowCalendarButton: true, label: 'Date in US' }}
			locale={'en-US'}
			timePickerProps={{ label: 'Time in US' }}
		/>

		<Box>
			<Label htmlFor="locale-2">Date and time in Japan</Label>
			<DateTimePicker
				id="locale-2"
				clearControlLabel="Clear Date and time in Japan"
				datePickerProps={{ shouldShowCalendarButton: true, label: 'Date in Japan' }}
				locale={'ja-JP'}
				timePickerProps={{ label: 'Time in Japan' }}
			/>
		</Box>
	</>
);

export default DateTimePickerLocaleExample;
