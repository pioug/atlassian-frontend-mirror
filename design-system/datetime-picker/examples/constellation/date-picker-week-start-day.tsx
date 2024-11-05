import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerWeekStartDayExample = () => (
	<>
		<Label id="sunday" htmlFor="datepicker-sunday">
			Week Starting on Sunday
		</Label>
		<DatePicker
			weekStartDay={0}
			id="datepicker-sunday"
			clearControlLabel="Clear week starting on Sunday"
			shouldShowCalendarButton
			inputLabelId="sunday"
			openCalendarLabel="open calendar"
		/>
		<br />
		<Label id="monday" htmlFor="datepicker-monday">
			Week Starting on Monday
		</Label>
		<DatePicker
			weekStartDay={1}
			id="datepicker-monday"
			clearControlLabel="Clear week starting on Monday"
			shouldShowCalendarButton
			inputLabelId="monday"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerWeekStartDayExample;
