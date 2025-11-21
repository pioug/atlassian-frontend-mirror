import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

const DateTimePickerWeekStartDayExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="datetime-1">Sunday example</Label>
		<DateTimePicker
			id="datetime-1"
			clearControlLabel="Clear Sunday example"
			datePickerProps={{
				weekStartDay: 0,
				shouldShowCalendarButton: true,
				label: 'Sunday example, date',
			}}
			timePickerProps={{ label: 'Sunday example, time' }}
		/>
		<Box>
			<Label htmlFor="datetime-2">Monday example</Label>
			<DateTimePicker
				id="datetime-2"
				clearControlLabel="Clear Monday Example"
				datePickerProps={{
					weekStartDay: 1,
					shouldShowCalendarButton: true,
					label: 'Monday example, date',
				}}
				timePickerProps={{ label: 'Monday example, time' }}
			/>
		</Box>
	</>
);

export default DateTimePickerWeekStartDayExample;
