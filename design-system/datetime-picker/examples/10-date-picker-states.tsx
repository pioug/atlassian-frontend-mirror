import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../src';

function now(day: number) {
	const date = new Date();
	date.setDate(day);
	return date.toISOString();
}

export default () => {
	return (
		<div>
			<Label htmlFor="react-select-datepicker-1-input">Stock</Label>
			<DatePicker
				id="react-select-datepicker-1-input"
				onChange={console.log}
				testId={'datepicker-1'}
			/>

			<Label htmlFor="react-select-disabled--input">Disabled input</Label>
			<DatePicker id="react-select-disabled--input" isDisabled onChange={console.log} />

			<Label htmlFor="react-select-disabled-dates--input">Disabled dates</Label>
			<DatePicker
				id="react-select-disabled-dates--input"
				minDate={now(8)}
				maxDate={now(28)}
				onChange={console.log}
			/>

			<Label htmlFor="react-select-custom--input">Custom date format</Label>
			<DatePicker
				id="react-select-custom--input"
				dateFormat="DD/MMM/YY"
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
			/>
		</div>
	);
};
