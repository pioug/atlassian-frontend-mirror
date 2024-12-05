import React from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

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
				shouldShowCalendarButton
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
				datePickerProps={{
					shouldShowCalendarButton: true,
					label: 'DateTimePicker - isInvalid, date',
				}}
				timePickerProps={{ label: 'DateTimePicker - isInvalid, time' }}
			/>
		</Box>
	);
};
