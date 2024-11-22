import React from 'react';

import { parseISO } from 'date-fns';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const DateTimePickerFormattingExample = () => (
	<>
		<Label htmlFor="datetime">Appointment date and time</Label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear Appointment date and time"
			datePickerProps={{
				dateFormat: 'YYYY-MM-DD',
				placeholder: '2021-06-10',
				parseInputValue: (date: string) => parseISO(date),
				shouldShowCalendarButton: true,
				label: 'Appointment date',
			}}
			timePickerProps={{
				timeFormat: 'HH:mm',
				placeholder: '13:30',
				label: 'Appointment time',
			}}
		/>
	</>
);

export default DateTimePickerFormattingExample;
