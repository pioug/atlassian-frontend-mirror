import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerWeekStartDayExample = () => (
	<>
		<DateTimePicker datePickerProps={{ weekStartDay: 0 }} clearControlLabel="Clear" />
		<br />
		<DateTimePicker datePickerProps={{ weekStartDay: 1 }} clearControlLabel="Clear Monday" />
	</>
);

export default DateTimePickerWeekStartDayExample;
