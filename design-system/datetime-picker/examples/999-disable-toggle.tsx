import React, { useCallback, useState } from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import { DatePicker } from '../src';

export default () => {
	const [isDisabled, setIsDisabled] = useState(true);

	const toggleDisabled = useCallback(() => {
		setIsDisabled((currentState) => !currentState);
	}, [setIsDisabled]);

	return (
		<Box>
			<Label htmlFor="toggle">DatePicker isDisabled</Label>
			<Toggle id="toggle" isChecked={isDisabled} onChange={toggleDisabled} />
			<Label htmlFor="react-select-date--input">Disabled inputs</Label>
			<DatePicker
				id="react-select-date--input"
				clearControlLabel="Clear disabled inputs"
				testId="datepicker-1"
				isDisabled={isDisabled}
			/>
		</Box>
	);
};
