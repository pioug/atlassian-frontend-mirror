import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Label htmlFor="react-select-time--input">TimePicker - isInvalid</Label>
			<TimePicker id="react-select-time--input" onChange={console.log} isInvalid />

			<Label htmlFor="react-select-date--input">DatePicker - isInvalid</Label>
			<DatePicker id="react-select-date--input" onChange={console.log} isInvalid />

			<Label htmlFor="react-select-datetime--input">DateTimePicker - isInvalid</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				onChange={console.log}
				isInvalid
				clearControlLabel="Clear datetime picker is invalid"
			/>
		</div>
	);
};
