import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerDefaultExample = () => (
	<>
		<Label htmlFor="default-date-picker-example">Choose date</Label>
		<DatePicker id="default-date-picker-example" />
	</>
);

export default DatePickerDefaultExample;
