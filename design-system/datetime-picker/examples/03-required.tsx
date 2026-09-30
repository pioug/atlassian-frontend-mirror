import React from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import TimePicker from '@atlaskit/datetime-picker/time-picker';
import Field from '@atlaskit/form/field';
import { Box } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Box>
			<Field
				name="date"
				label="Date"
				isRequired
				component={({ fieldProps: { ...rest } }) => (
					<DatePicker shouldShowCalendarButton clearControlLabel="Clear date" {...rest} />
				)}
			/>

			<Field
				name="time"
				label="Time"
				isRequired
				component={({ fieldProps: { ...rest } }) => (
					<TimePicker clearControlLabel="Clear time" {...rest} />
				)}
			/>

			<Field
				name="datetime"
				label="Datetime"
				isRequired
				component={({ fieldProps: { ...rest } }) => (
					<DateTimePicker
						{...rest}
						clearControlLabel="Clear datetime"
						datePickerProps={{ shouldShowCalendarButton: true, label: 'Datetime, date' }}
						timePickerProps={{ label: 'Datetime, time' }}
					/>
				)}
			/>
		</Box>
	);
};
