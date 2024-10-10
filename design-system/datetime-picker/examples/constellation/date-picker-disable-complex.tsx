import React from 'react';

import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const weekendFilter = (date: string) => {
	const dayOfWeek = parseISO(date).getDay();
	return dayOfWeek === 0 || dayOfWeek === 6;
};

const DatePickerDisableComplexExample = () => (
	<>
		<Label id="disabled" htmlFor="datepicker-disable-complex">
			Disabled Dates (Complex)
		</Label>
		<DatePicker
			defaultValue="2020-12-15"
			disabledDateFilter={weekendFilter}
			id="datepicker-disable-complex"
			shouldShowCalendarButton
			inputLabelId="disabled"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerDisableComplexExample;
