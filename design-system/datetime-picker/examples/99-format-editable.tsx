import React, { useState } from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/form';

import { DateTimePicker } from '../src';

export default () => {
	const [value, setValue] = useState('2020-06-02T09:30+1000');
	const [invalid, setInvalid] = useState(false);

	const onChange = (value: string) => {
		setValue(value);
		setInvalid(!moment(value).isValid());
	};

	return (
		<div>
			<Label htmlFor="react-select-datetime--input">Current time is: {value}</Label>
			<DateTimePicker
				id="react-select-datetime--input"
				value={value}
				onChange={onChange}
				timePickerProps={{ timeIsEditable: true }}
				isInvalid={invalid}
			/>
		</div>
	);
};
