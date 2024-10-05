import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DateTimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Label htmlFor="react-select-stock--input">Stock</Label>
			<DateTimePicker
				id="react-select-stock--input"
				onChange={console.log}
				clearControlLabel="Clear stock"
				datePickerProps={{ label: 'Date, Stock' }}
				timePickerProps={{ label: 'Time, Stock' }}
			/>

			<Label htmlFor="react-select-stock-value--input">Stock with value</Label>
			<DateTimePicker
				id="react-select-stock-value--input"
				onChange={console.log}
				defaultValue="2020-10-10"
				clearControlLabel="Clear stock with value"
				datePickerProps={{ label: 'Date, Stock with value' }}
				timePickerProps={{ label: 'Time, Stock with value' }}
			/>

			<Label htmlFor="react-select-disabled--input">Disabled input</Label>
			<DateTimePicker
				id="react-select-disabled--input"
				isDisabled
				onChange={console.log}
				datePickerProps={{ label: 'Date, Disabled input' }}
				timePickerProps={{ label: 'Time, Disabled input' }}
			/>

			<Label htmlFor="react-select-disabled-value--input">Disabled input with value</Label>
			<DateTimePicker
				id="react-select-disabled-value--input"
				isDisabled
				onChange={console.log}
				defaultValue="2020-10-10"
				datePickerProps={{ label: 'Date, Disabled input with value' }}
				timePickerProps={{ label: 'Time, Disabled input with value' }}
			/>

			<Label htmlFor="react-select-custom-date--input">Custom date format</Label>
			<DateTimePicker
				id="react-select-custom-date--input"
				onChange={console.log}
				datePickerProps={{
					dateFormat: 'DD/MMM/YY',
					placeholder: 'e.g. 31/Dec/18',
					label: 'Date, Custom date format',
				}}
				clearControlLabel="Clear custom date format"
				timePickerProps={{ label: 'Time, Custom date format' }}
			/>

			<Label htmlFor="react-select-custom-value--input">Custom date format with value</Label>
			<DateTimePicker
				id="react-select-custom-value--input"
				onChange={console.log}
				datePickerProps={{
					dateFormat: 'DD/MMM/YY',
					placeholder: 'e.g. 31/Dec/18',
					label: 'Date, Custom date format with value',
				}}
				defaultValue="2020-10-10"
				clearControlLabel="Clear custom date format with value"
				timePickerProps={{ label: 'Time, Custom date format with value' }}
			/>
		</Box>
	);
};
