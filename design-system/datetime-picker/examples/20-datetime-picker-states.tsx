import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

export default () => {
	return (
		<Box>
			<Label htmlFor="react-select-stock--input">Stock</Label>
			<DateTimePicker
				id="react-select-stock--input"
				onChange={console.log}
				clearControlLabel="Clear stock"
				datePickerProps={{
					label: 'Stock, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: 'Stock, time' }}
			/>

			<Label htmlFor="react-select-stock-value--input">Stock with value</Label>
			<DateTimePicker
				id="react-select-stock-value--input"
				onChange={console.log}
				defaultValue="2020-10-10"
				clearControlLabel="Clear stock with value"
				datePickerProps={{
					label: 'Stock with value, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: 'Stock with value, time' }}
			/>

			<Label htmlFor="react-select-disabled--input">Disabled input</Label>
			<DateTimePicker
				id="react-select-disabled--input"
				isDisabled
				onChange={console.log}
				datePickerProps={{
					label: 'Disabled input, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: 'Disabled input, time' }}
			/>

			<Label htmlFor="react-select-disabled-value--input">Disabled input with value</Label>
			<DateTimePicker
				id="react-select-disabled-value--input"
				isDisabled
				onChange={console.log}
				defaultValue="2020-10-10"
				datePickerProps={{
					label: 'Disabled input with value, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: 'Disabled input with value, time' }}
			/>

			<Label htmlFor="react-select-custom-date--input">Custom date format</Label>
			<DateTimePicker
				id="react-select-custom-date--input"
				onChange={console.log}
				datePickerProps={{
					dateFormat: 'DD/MMM/YY',
					placeholder: 'e.g. 31/Dec/18',
					label: 'Custom date format, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				clearControlLabel="Clear custom date format"
				timePickerProps={{ label: 'Custom date format, time' }}
			/>

			<Label htmlFor="react-select-custom-value--input">Custom date format with value</Label>
			<DateTimePicker
				id="react-select-custom-value--input"
				onChange={console.log}
				datePickerProps={{
					dateFormat: 'DD/MMM/YY',
					placeholder: 'e.g. 31/Dec/18',
					label: 'Custom date format with value, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				defaultValue="2020-10-10"
				clearControlLabel="Clear custom date format with value"
				timePickerProps={{ label: 'Custom date format with value, time' }}
			/>
		</Box>
	);
};
