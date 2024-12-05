import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Field } from '@atlaskit/form';

const DateTimePickerRequiredExample = () => (
	<Field name="datetime" label="Log Entry" isRequired>
		{({ fieldProps: { ...rest } }) => (
			<DateTimePicker
				{...rest}
				clearControlLabel="Clear log entry"
				datePickerProps={{ shouldShowCalendarButton: true, label: 'Log entry, date' }}
				timePickerProps={{ label: 'Log entry, time' }}
			/>
		)}
	</Field>
);

export default DateTimePickerRequiredExample;
