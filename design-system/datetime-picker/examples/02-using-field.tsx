import React from 'react';

import { Field } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

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
							label: 'Date, Datetime',
							shouldShowCalendarButton: true,
							openCalendarLabel: 'open calendar',
						}}
						timePickerProps={{ label: 'Time, Datetime' }}
					/>
				)}
			</Field>
		</Box>
	);
};
