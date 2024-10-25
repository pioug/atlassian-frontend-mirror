import React from 'react';

import { Field } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Field name="date" label="Date" isRequired>
				{({ fieldProps: { ...rest } }) => <DatePicker {...rest} />}
			</Field>

			<Field name="time" label="Time" isRequired>
				{({ fieldProps: { ...rest } }) => <TimePicker clearControlLabel="Clear time" {...rest} />}
			</Field>

			<Field name="datetime" label="Datetime" isRequired>
				{({ fieldProps: { ...rest } }) => (
					<DateTimePicker
						{...rest}
						clearControlLabel="Clear datetime"
						datePickerProps={{ label: 'Date, Datetime' }}
						timePickerProps={{ label: 'Time, Datetime' }}
					/>
				)}
			</Field>
		</Box>
	);
};
