import React from 'react';

import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerFormattingExample = () => (
	<>
		<Label id="custom" htmlFor="datepicker-format">
			Custom Date Format
		</Label>
		<DatePicker
			dateFormat="YYYY-MM-DD"
			placeholder="2021-06-10"
			parseInputValue={(date: string) => parseISO(date)}
			id="datepicker-format"
			clearControlLabel="Clear Custom Date Format"
			shouldShowCalendarButton
			inputLabelId="custom"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerFormattingExample;
