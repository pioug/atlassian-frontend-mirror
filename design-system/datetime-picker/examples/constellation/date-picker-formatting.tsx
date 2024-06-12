import React from 'react';

import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerFormattingExample = () => (
	<>
		<Label htmlFor="datepicker-format">Custom Date Format</Label>
		<DatePicker
			dateFormat="YYYY-MM-DD"
			placeholder="2021-06-10"
			parseInputValue={(date: string) => parseISO(date)}
			selectProps={{ inputId: 'datepicker-format' }}
		/>
	</>
);

export default DatePickerFormattingExample;
