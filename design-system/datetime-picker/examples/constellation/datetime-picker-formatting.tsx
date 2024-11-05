import React from 'react';

import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

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
