import React from 'react';

import { Label } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

const DateTimePickerDefaultExample = () => (
	<>
		<Label htmlFor="datetime">Appointment date and time</Label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear default example"
			datePickerProps={{ shouldShowCalendarButton: true, label: 'Appointment date' }}
			timePickerProps={{ label: 'Appointment time' }}
		/>
	</>
);

export default DateTimePickerDefaultExample;
