import React from 'react';

import { parseISO } from 'date-fns';

import { DateTimePicker } from '../../src';

const DateTimePickerFormattingExample = () => (
	<>
		<label htmlFor="datetime">Appointment date and time</label>
		<DateTimePicker
			id="datetime"
			datePickerProps={{
				dateFormat: 'YYYY-MM-DD',
				placeholder: '2021-06-10',
				parseInputValue: (date: string) => parseISO(date),
				shouldShowCalendarButton: true,
				label: 'Date, Appointment date and time',
			}}
			timePickerProps={{
				timeFormat: 'HH:mm',
				placeholder: '13:30',
				label: 'Time, Appointment date and time',
			}}
			clearControlLabel="Clear Appointment date and time"
		/>
	</>
);

export default DateTimePickerFormattingExample;
