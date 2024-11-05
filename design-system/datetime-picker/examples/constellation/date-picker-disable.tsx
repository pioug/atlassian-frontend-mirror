import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const disabledDates = [
	'2020-12-07',
	'2020-12-08',
	'2020-12-09',
	'2020-12-16',
	'2020-12-17',
	'2020-12-18',
];

const DatePickerDisabledExample = () => (
	<>
		<Label id="disabled" htmlFor="datepicker-disabled">
			Disabled Dates
		</Label>
		<DatePicker
			defaultValue="2020-12-15"
			disabled={disabledDates}
			id="datepicker-disabled"
			clearControlLabel="Clear disabled dates"
			shouldShowCalendarButton
			inputLabelId="disabled"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerDisabledExample;
