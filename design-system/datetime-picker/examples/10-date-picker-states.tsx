import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

function now(day: number) {
	const date = new Date();
	date.setDate(day);
	return date.toISOString();
}

export default () => {
	return (
		<Box>
			<Label id="stock" htmlFor="react-select-datepicker-1-input">
				Stock
			</Label>
			<DatePicker
				id="react-select-datepicker-1-input"
				clearControlLabel="Clear stock"
				onChange={console.log}
				testId={'datepicker-1'}
				shouldShowCalendarButton
				inputLabelId="stock"
				openCalendarLabel="open calendar"
			/>

			<Label id="disabled" htmlFor="react-select-disabled--input">
				Disabled input
			</Label>
			<DatePicker
				id="react-select-disabled--input"
				clearControlLabel="Clear disabled input"
				isDisabled
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="disabled"
				openCalendarLabel="open calendar"
			/>

			<Label id="disabled-dates" htmlFor="react-select-disabled-dates--input">
				Disabled dates
			</Label>
			<DatePicker
				id="react-select-disabled-dates--input"
				clearControlLabel="Clear disabled dates"
				minDate={now(8)}
				maxDate={now(28)}
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="disabled-dates"
				openCalendarLabel="open calendar"
			/>

			<Label id="custom" htmlFor="react-select-custom--input">
				Custom date format
			</Label>
			<DatePicker
				id="react-select-custom--input"
				clearControlLabel="Clear custom date format"
				dateFormat="DD/MMM/YY"
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId='custom"'
				openCalendarLabel="open calendar"
			/>
		</Box>
	);
};
