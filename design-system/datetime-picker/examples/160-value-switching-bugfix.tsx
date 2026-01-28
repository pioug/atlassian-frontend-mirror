import React, { useEffect } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';

// Previously, there was a bug in the date picker that caused empty space to be
// present when the value provided to the date picker was hanged. This example
// is here to verify and ensure that this bug is truly gone and will not come
// back.
//
// We run an `onChange` inside the function so that we can capture this in a VR
// test.

export default (): React.JSX.Element => {
	// Step 1: We have a value provided to the input component
	const [value, setValue] = React.useState('2026-01-02');

	const onChange = (v: string) => {
		setValue(v);
	};

	// Step 2: We update the provided value
	useEffect(() => {
		onChange('');
	}, []);

	// Result: There should be empty space at the end of the indicators container
	return (
		<Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Date picker</Heading>
				<Label id="default" htmlFor="react-select-datepicker-1-input">
					Select date (default)
				</Label>
				<button type="button" onClick={() => onChange('')}>
					Reset
				</button>
				<DatePicker
					id="react-select-datepicker-1-input"
					clearControlLabel="Clear select date (default)"
					onChange={onChange}
					value={value}
					shouldShowCalendarButton
					inputLabelId="default"
					openCalendarLabel="open calendar"
				/>
			</Box>
		</Box>
	);
};
