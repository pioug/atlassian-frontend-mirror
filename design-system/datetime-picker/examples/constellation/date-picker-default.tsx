import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const DatePickerDefaultExample = () => (
	<>
		<Label id="date" htmlFor="default-date-picker-example">
			Choose date
		</Label>
		<DatePicker
			id="default-date-picker-example"
			clearControlLabel="Clear choose date"
			shouldShowCalendarButton
			inputLabelId="date"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerDefaultExample;
