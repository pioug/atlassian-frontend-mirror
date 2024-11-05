import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Label htmlFor="react-select-time--input">TimePicker - isInvalid</Label>
			<TimePicker
				clearControlLabel="Clear timePicker - isInvalid"
				id="react-select-time--input"
				onChange={console.log}
				isInvalid
			/>

			<Label htmlFor="react-select-date--input">DatePicker - isInvalid</Label>
			<DatePicker
				id="react-select-date--input"
				clearControlLabel="Clear datePicker - isInvalid"
				onChange={console.log}
				isInvalid
			/>

			<Label htmlFor="react-select-datetime--input">DateTimePicker - isInvalid</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				onChange={console.log}
				isInvalid
				clearControlLabel="Clear datetime picker is invalid"
				datePickerProps={{ label: 'DateTimePicker - isInvalid, date' }}
				timePickerProps={{ label: 'DateTimePicker - isInvalid, time' }}
			/>
		</Box>
	);
};
