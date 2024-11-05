import React from 'react';

import { Label } from '@atlaskit/form';

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
		<Label htmlFor="datetime">Appointment date and time</Label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear disabled dates"
			datePickerProps={{
				disabled: disabledDates,
				shouldShowCalendarButton: true,
				label: 'Appointment date',
			}}
			defaultValue="2020-12-15"
			timePickerProps={{ label: 'Appointment time' }}
		/>
	</>
);

export default DateTimePickerDisabledExample;
