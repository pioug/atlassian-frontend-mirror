import React from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';

export default function DisabledExample(): React.JSX.Element {
	return (
		<Stack space="space.150">
			<div>
				<Heading size="large">Date picker (disabled)</Heading>

				<Label htmlFor="date-picker">Select date</Label>
				<DatePicker
					id="date-picker"
					clearControlLabel="Clear date"
					shouldShowCalendarButton
					openCalendarLabel="open calendar"
					isDisabled
				/>
			</div>

			<div>
				<Heading size="large">Time picker (disabled)</Heading>
				<Label htmlFor="time-picker">Select time</Label>
				<TimePicker clearControlLabel="Clear time" id="time-picker" isDisabled />
			</div>

			<div>
				<Heading size="large">Date / time picker (disabled)</Heading>

				<Label htmlFor="date-time-picker">Date / time picker</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time"
					datePickerProps={{
						label: 'Date / time picker, date',
						shouldShowCalendarButton: true,
						openCalendarLabel: 'open calendar',
					}}
					timePickerProps={{ label: 'Date / time picker, time' }}
					id="date-time-picker"
					isDisabled
				/>
			</div>
		</Stack>
	);
}
