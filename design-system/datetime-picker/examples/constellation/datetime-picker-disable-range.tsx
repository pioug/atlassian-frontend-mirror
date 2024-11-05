import React from 'react';

import { Label } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

const DateTimePickerDisableRangeExample = () => (
	<>
		<Label htmlFor="datetime">Appointment date and time</Label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear range"
			datePickerProps={{
				minDate: '2020-12-10',
				maxDate: '2020-12-20',
				shouldShowCalendarButton: true,
				label: 'Appointment date',
			}}
			defaultValue="2020-12-15"
			timePickerProps={{
				label: 'Appointment time',
			}}
		/>
	</>
);

export default DateTimePickerDisableRangeExample;
