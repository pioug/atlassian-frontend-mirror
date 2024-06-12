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
		<Label htmlFor="datepicker-disable-complex">Disabled Dates (Complex)</Label>
		<DatePicker
			defaultValue="2020-12-15"
			disabledDateFilter={weekendFilter}
			selectProps={{ inputId: 'datepicker-disable-complex' }}
		/>
	</>
);

export default DatePickerDisableComplexExample;
