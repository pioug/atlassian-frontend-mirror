import React from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import Field from '@atlaskit/form/field';

const DatePickerRequiredExample = (): React.JSX.Element => (
	<Field
		name="date"
		label="Start Date"
		isRequired
		component={({ fieldProps: { ...rest } }) => (
			<DatePicker shouldShowCalendarButton clearControlLabel="Clear start date" {...rest} />
		)}
	/>
);

export default DatePickerRequiredExample;
