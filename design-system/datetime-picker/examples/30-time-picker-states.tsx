import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

export default () => {
	return (
		<Box>
			<Label htmlFor="timepicker-1--input">Stock</Label>
			<TimePicker
				clearControlLabel="Clear stock"
				onChange={console.log}
				testId="timepicker-1"
				id="timepicker-1--input"
				selectProps={{
					classNamePrefix: 'timepicker-select',
				}}
			/>

			<Label htmlFor="timepicker-2--input">Disabled input</Label>
			<TimePicker
				clearControlLabel="Clear disabled input"
				id="timepicker-2--input"
				isDisabled
				onChange={console.log}
			/>
		</Box>
	);
};
