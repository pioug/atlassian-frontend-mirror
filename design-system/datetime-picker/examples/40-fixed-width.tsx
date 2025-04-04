import React from 'react';

import { cssMap } from '@atlaskit/css';
import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

const GRID_SIZE = 8;

const styles = cssMap({
	pickerBoxStyles: {
		width: `${GRID_SIZE * 20}px`,
	},
	dateTimepickerBoxStyles: {
		width: `${GRID_SIZE * 40}px`,
	},
});

export default () => {
	return (
		<Box>
			<Label id="date" htmlFor="react-select-date--input">
				Date picker
			</Label>
			<Box xcss={styles.pickerBoxStyles}>
				<DatePicker
					id="react-select-date--input"
					clearControlLabel="Clear date picker"
					onChange={console.log}
					shouldShowCalendarButton
					inputLabelId="date"
					openCalendarLabel="open calendar"
				/>
			</Box>
			<Label htmlFor="react-select-time--input">Time picker</Label>
			<Box xcss={styles.pickerBoxStyles}>
				<TimePicker
					clearControlLabel="Clear time picker"
					id="react-select-time--input"
					onChange={console.log}
				/>
			</Box>
			<Label htmlFor="react-select-date-time--input">Date / time picker</Label>
			<Box xcss={styles.dateTimepickerBoxStyles}>
				<DateTimePicker
					id="react-select-date-time--input"
					onChange={console.log}
					clearControlLabel="Clear datetime picker"
					datePickerProps={{
						label: 'Date / time picker, date',
						shouldShowCalendarButton: true,
						openCalendarLabel: 'open calendar',
					}}
					timePickerProps={{ label: 'Date / time picker, time' }}
				/>
			</Box>
		</Box>
	);
};
