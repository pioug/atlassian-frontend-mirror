import React from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Field } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

export default () => {
	return (
		<Box>
			<Field name="date" label="Date">
				{({ fieldProps }) => (
					<DatePicker
						{...fieldProps}
						shouldShowCalendarButton
						inputLabel="Date"
						openCalendarLabel="open calendar"
						clearControlLabel="Clear date"
					/>
				)}
			</Field>

			<Field name="time" label="Time">
				{({ fieldProps }) => <TimePicker clearControlLabel="Clear time" {...fieldProps} />}
			</Field>

			<Field name="datetime" label="Datetime">
				{({ fieldProps }) => (
					<DateTimePicker
						{...fieldProps}
						clearControlLabel="Clear datetime"
						datePickerProps={{
							label: 'Datetime, date',
							shouldShowCalendarButton: true,
							openCalendarLabel: 'open calendar',
						}}
						timePickerProps={{ label: 'Datetime, time' }}
					/>
				)}
			</Field>
		</Box>
	);
};
