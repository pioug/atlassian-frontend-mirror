import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Field } from '@atlaskit/form';

const DatePickerRequiredExample = (): React.JSX.Element => (
	<Field name="date" label="Start Date" isRequired>
		{({ fieldProps: { ...rest } }) => (
			<DatePicker shouldShowCalendarButton clearControlLabel="Clear start date" {...rest} />
		)}
	</Field>
);

export default DatePickerRequiredExample;
