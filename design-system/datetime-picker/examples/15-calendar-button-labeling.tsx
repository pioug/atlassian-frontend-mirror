import React from 'react';

import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Box>
			<Heading size="large">Date picker</Heading>
			<Label htmlFor="label">`label` prop</Label>
			<DatePicker
				id="label"
				clearControlLabel="Clear `label` prop"
				onChange={console.log}
				shouldShowCalendarButton
				label="`label` prop"
				openCalendarLabel="open calendar"
			/>

			<Label htmlFor="inputLabel">`inputLabel` prop</Label>
			<DatePicker
				id="inputLabel"
				clearControlLabel="Clear `inputLabel` prop"
				onChange={console.log}
				shouldShowCalendarButton
				inputLabel="`inputLabel` prop"
				openCalendarLabel="open calendar"
			/>

			<Label id="input-label-id--label" htmlFor="inputLabelId">
				`inputLabelId` prop
			</Label>
			<DatePicker
				id="inputLabelId"
				clearControlLabel="Clear `inputLabelId` prop"
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="input-label-id--label"
				openCalendarLabel="open calendar"
			/>
			<Heading size="large">Datetime picker</Heading>
			<Label htmlFor="dtp-label">`label` prop</Label>
			<DateTimePicker
				id="dtp-label"
				onChange={console.log}
				datePickerProps={{
					shouldShowCalendarButton: true,
					label: '`label` prop, Date',
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: '`label` prop, Time' }}
			/>
		</Box>
	);
};
