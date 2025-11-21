import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const DatePickerDisableRangeExample = (): React.JSX.Element => (
	<>
		<Label id="disabled" htmlFor="datepicker-disabled-range">
			Disabled Date Range
		</Label>
		<DatePicker
			defaultValue="2020-12-15"
			minDate="2020-12-10"
			maxDate="2020-12-20"
			id="datepicker-disabled-range"
			clearControlLabel="Clear disabled date range"
			shouldShowCalendarButton
			inputLabelId="disabled"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerDisableRangeExample;
