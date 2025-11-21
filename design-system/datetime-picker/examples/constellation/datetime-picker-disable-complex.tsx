import React from 'react';

import { parseISO } from 'date-fns';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const weekendFilter = (date: string) => {
	const dayOfWeek = parseISO(date).getDay();
	return dayOfWeek === 0 || dayOfWeek === 6;
};

const DateTimePickerDisableComplexExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="datetime">Appointment date and time</Label>
		<DateTimePicker
			id="datetime"
			clearControlLabel="Clear complex dates"
			defaultValue="2020-12-15"
			datePickerProps={{
				disabledDateFilter: weekendFilter,
				shouldShowCalendarButton: true,
				label: 'Appointment date',
			}}
			timePickerProps={{ label: 'Appointment time' }}
		/>
	</>
);

export default DateTimePickerDisableComplexExample;
