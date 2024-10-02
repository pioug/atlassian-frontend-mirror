import React from 'react';

import { Label } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

const pickerBoxStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${gridSize() * 20}px`,
});

const dateTimepickerBoxStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${gridSize() * 40}px`,
});

export default () => {
	return (
		<div>
			<Label htmlFor="react-select-date--input">Date picker</Label>
			<Box xcss={pickerBoxStyles}>
				<DatePicker id="react-select-date--input" onChange={console.log} />
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
					datePickerProps={{ label: 'Date, Date / time picker' }}
					timePickerProps={{ label: 'Time, Date / time picker' }}
				/>
			</Box>
		</div>
	);
};
