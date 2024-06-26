import React from 'react';

import { Label } from '@atlaskit/form';

import { TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Label htmlFor="timepicker-1--input">Stock</Label>
			<TimePicker
				onChange={console.log}
				testId="timepicker-1"
				selectProps={{
					classNamePrefix: 'timepicker-select',
					inputId: 'timepicker-1--input',
				}}
			/>

			<Label htmlFor="timepicker-2--input">Disabled input</Label>
			<TimePicker id="timepicker-2--input" isDisabled onChange={console.log} />
		</div>
	);
};
