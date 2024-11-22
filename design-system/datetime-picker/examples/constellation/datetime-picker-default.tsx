import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

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
