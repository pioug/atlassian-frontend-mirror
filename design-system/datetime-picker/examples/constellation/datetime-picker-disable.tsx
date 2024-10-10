import React from 'react';

import { DateTimePicker } from '../../src';

const disabledDates = [
	'2020-12-07',
	'2020-12-08',
	'2020-12-09',
	'2020-12-16',
	'2020-12-17',
	'2020-12-18',
];

const DateTimePickerDisabledExample = () => (
	<>
		<label htmlFor="datetime">Appointment date and time</label>
		<DateTimePicker
			id="datetime"
			defaultValue="2020-12-15"
			clearControlLabel="Clear disabled dates"
			datePickerProps={{
				disabled: disabledDates,
				shouldShowCalendarButton: true,
				label: 'Date, Appointment date and time',
			}}
			timePickerProps={{ label: 'Time, Appointment date and time' }}
		/>
	</>
);

export default DateTimePickerDisabledExample;
