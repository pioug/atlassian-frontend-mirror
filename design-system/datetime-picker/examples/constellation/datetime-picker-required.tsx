import React from 'react';

import { Field } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

const DateTimePickerRequiredExample = () => (
	<Field name="datetime" label="Log Entry" isRequired>
		{({ fieldProps: { ...rest } }) => (
			<DateTimePicker
				{...rest}
				clearControlLabel="Clear log entry"
				datePickerProps={{ label: 'Date, log entry' }}
				timePickerProps={{ label: 'Time, log entry' }}
			/>
		)}
	</Field>
);

export default DateTimePickerRequiredExample;
