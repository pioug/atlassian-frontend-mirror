import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerLocaleExample = () => (
	<>
		<label htmlFor="locale-1">Date and time in US</label>
		<DateTimePicker
			id="locale-1"
			locale={'en-US'}
			clearControlLabel="Clear Date and time in US"
			datePickerProps={{ shouldShowCalendarButton: true, label: 'Date in US' }}
			timePickerProps={{ label: 'Time in US' }}
		/>
		<br />
		<label htmlFor="locale-2">Date and time in Japan</label>
		<DateTimePicker
			id="locale-2"
			locale={'ja-JP'}
			clearControlLabel="Clear Date and time in Japan"
			datePickerProps={{ shouldShowCalendarButton: true, label: 'Date in Japan' }}
			timePickerProps={{ label: 'Time in Japan' }}
		/>
	</>
);

export default DateTimePickerLocaleExample;
