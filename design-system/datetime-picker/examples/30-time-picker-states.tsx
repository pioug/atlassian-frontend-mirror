import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { TimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Label htmlFor="timepicker-1--input">Stock</Label>
			<TimePicker
				onChange={console.log}
				testId="timepicker-1"
				id="timepicker-1--input"
				selectProps={{
					classNamePrefix: 'timepicker-select',
				}}
			/>

			<Label htmlFor="timepicker-2--input">Disabled input</Label>
			<TimePicker id="timepicker-2--input" isDisabled onChange={console.log} />
		</Box>
	);
};
