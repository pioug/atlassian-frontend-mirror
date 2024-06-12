import React from 'react';

import { Label } from '@atlaskit/form';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Label htmlFor="react-select-date--input">Date picker</Label>
			<DatePicker
				id="react-select-date--input"
				innerProps={{ style: { width: gridSize() * 20 } }}
				onChange={console.log}
			/>
			<Label htmlFor="react-select-time--input">Time picker</Label>
			<TimePicker
				id="react-select-time--input"
				innerProps={{ style: { width: gridSize() * 20 } }}
				onChange={console.log}
			/>
			<Label htmlFor="react-select-date-time--input">Date / time picker</Label>
			<DateTimePicker
				id="react-select-date-time--input"
				innerProps={{ style: { width: gridSize() * 40 } }}
				onChange={console.log}
			/>
		</div>
	);
};
