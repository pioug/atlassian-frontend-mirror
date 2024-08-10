import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerWeekStartDayExample = () => (
	<>
		<Label htmlFor="datepicker-sunday">Week Starting on Sunday</Label>
		<DatePicker weekStartDay={0} id="datepicker-sunday" />
		<br />
		<Label htmlFor="datepicker-monday">Week Starting on Monday</Label>
		<DatePicker weekStartDay={1} id="datepicker-monday" />
	</>
);

export default DatePickerWeekStartDayExample;
