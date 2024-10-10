import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerDisableRangeExample = () => (
	<>
		<label htmlFor="datetime">Appointment date and time</label>
		<DateTimePicker
			id="datetime"
			defaultValue="2020-12-15"
			clearControlLabel="Clear range"
			datePickerProps={{
				minDate: '2020-12-10',
				maxDate: '2020-12-20',
				shouldShowCalendarButton: true,
				label: 'Date, Appointment date and time',
			}}
			timePickerProps={{
				label: 'Time, Appointment date and time',
			}}
		/>
	</>
);

export default DateTimePickerDisableRangeExample;
