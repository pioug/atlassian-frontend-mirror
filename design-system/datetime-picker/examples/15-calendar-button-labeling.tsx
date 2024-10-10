import React from 'react';

import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Heading size="large">Date picker</Heading>
			<Label htmlFor="label">`label` prop</Label>
			<DatePicker
				id="label"
				onChange={console.log}
				shouldShowCalendarButton
				label="`label` prop"
				openCalendarLabel="open calendar"
			/>

			<Label htmlFor="inputLabel">`inputLabel` prop</Label>
			<DatePicker
				id="inputLabel"
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
