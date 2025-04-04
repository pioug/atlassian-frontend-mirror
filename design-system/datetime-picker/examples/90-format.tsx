import React from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Link from '@atlaskit/link';
import { Box, Text } from '@atlaskit/primitives/compiled';

export default () => {
	return (
		<Box>
			<Text as="p">
				Dates & Times can be formatted using any format suported by{' '}
				<Link href="https://date-fns.org/v1.29.0/docs/format" target="_blank">
					date-fns format function
				</Link>
				.
			</Text>
			<Label htmlFor="react-select-time--input">TimePicker - timeFormat (h:mm a)</Label>
			<TimePicker
				clearControlLabel="Clear timePicker - timeFormat (h:mm a)"
				id="react-select-time--input"
				onChange={console.log}
				timeFormat="h:mm a"
			/>
			<Label htmlFor="react-select-date--input">DatePicker - dateFormat (DD/MM/YYYY)</Label>
			<DatePicker
				shouldShowCalendarButton
				id="react-select-date--input"
				clearControlLabel="Clear datePicker - dateFormat (DD/MM/YYYY)"
				onChange={console.log}
				dateFormat="DD/MM/YYYY"
			/>
			<Label htmlFor="react-select-datetime--input">
				DateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY)
			</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				onChange={console.log}
				timePickerProps={{
					timeFormat: 'HH:mm',
					label: 'DateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY), time',
				}}
				datePickerProps={{
					shouldShowCalendarButton: true,
					dateFormat: 'Do MMMM YYYY',
					label: 'DateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY), date',
				}}
				clearControlLabel="Clear dateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY)"
			/>
		</Box>
	);
};
