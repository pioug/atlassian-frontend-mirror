import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerDisableRangeExample = () => (
	<>
		<Label htmlFor="datepicker-disabled-range">Disabled Date Range</Label>
		<DatePicker
			defaultValue="2020-12-15"
			minDate="2020-12-10"
			maxDate="2020-12-20"
			selectProps={{ inputId: 'datepicker-disabled-range' }}
		/>
	</>
);

export default DatePickerDisableRangeExample;
