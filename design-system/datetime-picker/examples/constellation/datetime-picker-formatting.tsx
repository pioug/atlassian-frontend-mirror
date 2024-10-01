import React from 'react';

import { parseISO } from 'date-fns';

import { DateTimePicker } from '../../src';

const DateTimePickerFormattingExample = () => (
	<DateTimePicker
		datePickerProps={{
			dateFormat: 'YYYY-MM-DD',
			placeholder: '2021-06-10',
			parseInputValue: (date: string) => parseISO(date),
		}}
		timePickerProps={{
			timeFormat: 'HH:mm',
			placeholder: '13:30',
		}}
		clearControlLabel="Clear date and time"
	/>
);

export default DateTimePickerFormattingExample;
