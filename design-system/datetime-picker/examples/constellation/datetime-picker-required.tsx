import React from 'react';

import { Field } from '@atlaskit/form';

import { DateTimePicker } from '../../src';

const DateTimePickerRequiredExample = () => (
	<Field name="datetime" label="Log Entry" isRequired>
		{({ fieldProps: { ...rest } }) => (
			<DateTimePicker
				{...rest}
				clearControlLabel="Clear log entry"
				datePickerProps={{ label: 'Log entry, date' }}
				timePickerProps={{ label: 'Log entry, time' }}
			/>
		)}
	</Field>
);

export default DateTimePickerRequiredExample;
