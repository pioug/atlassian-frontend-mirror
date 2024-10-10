import React from 'react';

import { Label } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

const GRID_SIZE = 8;
const pickerBoxStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${GRID_SIZE * 20}px`,
});

const dateTimepickerBoxStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${GRID_SIZE * 40}px`,
});

export default () => {
	return (
		<Box>
			<Label id="date" htmlFor="react-select-date--input">
				Date picker
			</Label>
			<Box xcss={pickerBoxStyles}>
				<DatePicker
					id="react-select-date--input"
					onChange={console.log}
					shouldShowCalendarButton
					inputLabelId="date"
					openCalendarLabel="open calendar"
				/>
			</Box>
			<Label htmlFor="react-select-time--input">Time picker</Label>
			<Box xcss={pickerBoxStyles}>
				<TimePicker id="react-select-time--input" onChange={console.log} />
			</Box>
			<Label htmlFor="react-select-date-time--input">Date / time picker</Label>
			<Box xcss={dateTimepickerBoxStyles}>
				<DateTimePicker
					id="react-select-date-time--input"
					onChange={console.log}
					clearControlLabel="Clear datetime picker"
					datePickerProps={{
						label: 'Date, Date / time picker',
						shouldShowCalendarButton: true,
						openCalendarLabel: 'open calendar',
					}}
					timePickerProps={{ label: 'Time, Date / time picker' }}
				/>
			</Box>
		</Box>
	);
};
