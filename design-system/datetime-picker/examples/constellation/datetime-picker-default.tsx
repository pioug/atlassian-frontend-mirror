import React from 'react';

import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import { Label } from '@atlaskit/form/label/default';

const DateTimePickerDefaultExample = (): React.JSX.Element => (
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
