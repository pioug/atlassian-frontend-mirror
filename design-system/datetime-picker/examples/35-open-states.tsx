import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

export default () => {
	return (
		<Box>
			<Heading size="large">DatePicker</Heading>
			<Label id="open-calendar" htmlFor="react-select-is-open-calendar--input">
				Always open
			</Label>
			<DatePicker
				id="react-select-is-open-calendar--input"
				clearControlLabel="Clear always open"
				isOpen
				shouldShowCalendarButton
				inputLabelId="open-calendar"
				openCalendarLabel="open calendar"
			/>
		</Box>
	);
};
