import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerLocaleExample = () => (
	<>
		<Label id="english" htmlFor="datepicker-locale-en">
			English Language Example
		</Label>
		<DatePicker
			locale={'en-US'}
			id="datepicker-locale-en"
			shouldShowCalendarButton
			inputLabelId="english"
			openCalendarLabel="open calendar"
		/>
		<br />
		<Label id="japanese" htmlFor="datepicker-locale-jp">
			Japanese Language Example
		</Label>
		<DatePicker
			locale={'ja-JP'}
			id="datepicker-locale-jp"
			shouldShowCalendarButton
			inputLabelId="japanese"
			openCalendarLabel="open calendar"
		/>
	</>
);

export default DatePickerLocaleExample;
