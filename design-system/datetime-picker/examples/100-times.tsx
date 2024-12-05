import React from 'react';

import { DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

export default () => {
	const times: Array<string> = ['10:00', '10:15', '10:30', '10:45', '11:00'];

	return (
		<Box>
			<Label htmlFor="react-select-timepicker-input">TimePicker - times</Label>
			<TimePicker
				clearControlLabel="Clear timePicker - times"
				id="react-select-timepicker-input"
				times={times}
				selectProps={{ classNamePrefix: 'timepicker-select' }}
				testId={'timePicker'}
			/>
			<Label htmlFor="react-select-datetimepicker--input">DateTimePicker - times</Label>
			<DateTimePicker
				clearControlLabel="Clear DateTimePicker - times"
				id="react-select-datetimepicker--input"
				timePickerProps={{ label: 'DateTimePicker - times, time', times }}
				datePickerProps={{ shouldShowCalendarButton: true, label: 'DateTimePicker - times, date' }}
			/>
		</Box>
	);
};
