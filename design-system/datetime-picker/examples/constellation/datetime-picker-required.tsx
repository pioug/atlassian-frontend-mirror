import React from 'react';

import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import Field from '@atlaskit/form/field';

const DateTimePickerRequiredExample = (): React.JSX.Element => (
	<Field
		name="datetime"
		label="Log Entry"
		isRequired
		component={({ fieldProps: { ...rest } }) => (
			<DateTimePicker
				{...rest}
				clearControlLabel="Clear log entry"
				datePickerProps={{ shouldShowCalendarButton: true, label: 'Log entry, date' }}
				timePickerProps={{ label: 'Log entry, time' }}
			/>
		)}
	/>
);

export default DateTimePickerRequiredExample;
