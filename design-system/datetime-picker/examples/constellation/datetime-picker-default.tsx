import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerDefaultExample = () => (
	<>
		<label htmlFor="datetime">Appointment date and time</label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear default example"
			datePickerProps={{ shouldShowCalendarButton: true, label: 'Appointment date' }}
			timePickerProps={{ label: 'Appointment time' }}
		/>
	</>
);

export default DateTimePickerDefaultExample;
