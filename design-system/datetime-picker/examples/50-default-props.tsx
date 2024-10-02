import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Label htmlFor="react-select-date--input">DatePicker defaultValue defaultIsOpen</Label>
			<DatePicker
				id="react-select-date--input"
				defaultValue="2018-03-01"
				defaultIsOpen
				onChange={console.log}
			/>

			<Label htmlFor="react-select-time--input">TimePicker defaultValue defaultIsOpen</Label>
			<TimePicker
				id="react-select-time--input"
				defaultValue="10:00am"
				defaultIsOpen
				onChange={console.log}
			/>

			<Label htmlFor="react-select-date-time--input">DateTimePicker defaultValue</Label>
			<DateTimePicker
				id="react-select-date-time--input"
				defaultValue="2018-01-02T14:30-08:00"
				onChange={console.log}
				datePickerProps={{ label: 'Date, DateTimePicker defaultValue' }}
				timePickerProps={{ label: 'Time, DateTimePicker defaultValue' }}
			/>
		</div>
	);
};
