import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<p>
				Dates & Times can be formatted using any format suported by{' '}
				<a
					href="https://date-fns.org/v1.29.0/docs/format"
					target="_blank"
					rel="noopener noreferrer"
				>
					date-fns format function
				</a>
				.
			</p>
			<Label htmlFor="react-select-time--input">TimePicker - timeFormat (h:mm a)</Label>
			<TimePicker id="react-select-time--input" onChange={console.log} timeFormat="h:mm a" />
			<Label htmlFor="react-select-date--input">DatePicker - dateFormat (DD/MM/YYYY)</Label>
			<DatePicker id="react-select-date--input" onChange={console.log} dateFormat="DD/MM/YYYY" />
			<Label htmlFor="react-select-datetime--input">
				DateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY)
			</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				onChange={console.log}
				timePickerProps={{
					timeFormat: 'HH:mm',
				}}
				datePickerProps={{
					dateFormat: 'Do MMMM YYYY',
				}}
			/>
		</div>
	);
};
