import React, { useCallback, useState } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

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
				shouldShowCalendarButton
				id="react-select-date--input"
				clearControlLabel="Clear disabled inputs"
				testId="datepicker-1"
				isDisabled={isDisabled}
			/>
		</Box>
	);
};
