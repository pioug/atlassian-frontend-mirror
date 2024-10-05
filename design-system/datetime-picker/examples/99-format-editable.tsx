import React, { useState } from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DateTimePicker } from '../src';

export default () => {
	const [value, setValue] = useState('2020-06-02T09:30+1000');
	const [invalid, setInvalid] = useState(false);

	const onChange = (value: string) => {
		setValue(value);
		setInvalid(!moment(value).isValid());
	};

	return (
		<Box>
			<Label htmlFor="react-select-datetime--input">Current time is: {value}</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				value={value}
				onChange={onChange}
				timePickerProps={{ label: `Time, Current time is: ${value}`, timeIsEditable: true }}
				isInvalid={invalid}
				clearControlLabel="Clear current time"
				datePickerProps={{ label: `Date, Current time is: ${value}` }}
			/>
		</Box>
	);
};
