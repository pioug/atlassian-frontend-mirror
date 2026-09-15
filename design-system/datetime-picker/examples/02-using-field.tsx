import React from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import TimePicker from '@atlaskit/datetime-picker/time-picker';
import Field from '@atlaskit/form/field';
import { Box } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
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
