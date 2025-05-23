import React from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Field } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

export default () => {
	return (
		<Box>
			<Field name="date" label="Date" isRequired>
				{({ fieldProps: { ...rest } }) => (
					<DatePicker shouldShowCalendarButton clearControlLabel="Clear date" {...rest} />
				)}
			</Field>

			<Field name="time" label="Time" isRequired>
				{({ fieldProps: { ...rest } }) => <TimePicker clearControlLabel="Clear time" {...rest} />}
			</Field>

			<Field name="datetime" label="Datetime" isRequired>
				{({ fieldProps: { ...rest } }) => (
					<DateTimePicker
						{...rest}
						clearControlLabel="Clear datetime"
						datePickerProps={{ shouldShowCalendarButton: true, label: 'Datetime, date' }}
						timePickerProps={{ label: 'Datetime, time' }}
					/>
				)}
			</Field>
		</Box>
	);
};
