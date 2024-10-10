import React from 'react';

import { parseISO } from 'date-fns';

import { DateTimePicker } from '../../src';

const weekendFilter = (date: string) => {
	const dayOfWeek = parseISO(date).getDay();
	return dayOfWeek === 0 || dayOfWeek === 6;
};

const DateTimePickerDisableComplexExample = () => (
	<>
		<label htmlFor="datetime">Appointment date and time</label>
		<DateTimePicker
			id="datetime"
			defaultValue="2020-12-15"
			datePickerProps={{
				disabledDateFilter: weekendFilter,
				shouldShowCalendarButton: true,
				label: 'Appointment date',
			}}
			timePickerProps={{ label: 'Appointment time' }}
			clearControlLabel="Clear complex dates"
		/>
	</>
);

export default DateTimePickerDisableComplexExample;
