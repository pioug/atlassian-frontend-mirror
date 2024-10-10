import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerWeekStartDayExample = () => (
	<>
		<label htmlFor="datetime-1">Sunday example</label>
		<DateTimePicker
			id="datetime-1"
			clearControlLabel="Clear Sunday example"
			datePickerProps={{
				weekStartDay: 0,
				shouldShowCalendarButton: true,
				label: 'Date, Sunday example',
			}}
			timePickerProps={{ label: 'Time, Sunday example' }}
		/>
		<br />
		<label htmlFor="datetime-2">Monday example</label>
		<DateTimePicker
			id="datetime-2"
			clearControlLabel="Clear Monday Example"
			datePickerProps={{
				weekStartDay: 1,
				shouldShowCalendarButton: true,
				label: 'Date, Monday example',
			}}
			timePickerProps={{ label: 'Time, Monday example' }}
		/>
	</>
);

export default DateTimePickerWeekStartDayExample;
