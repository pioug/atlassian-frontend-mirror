import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerLocaleExample = () => (
	<>
		<Label htmlFor="datepicker-locale-en">English Language Example</Label>
		<DatePicker locale={'en-US'} selectProps={{ inputId: 'datepicker-locale-en' }} />
		<br />
		<Label htmlFor="datepicker-locale-jp">Japanese Language Example</Label>
		<DatePicker locale={'ja-JP'} selectProps={{ inputId: 'datepicker-locale-jp' }} />
	</>
);

export default DatePickerLocaleExample;
