import React from 'react';

import { cssMap } from '@atlaskit/css';
import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	containerStyles: { maxWidth: '175px' },
});

export default () => {
	return (
		<Box xcss={styles.containerStyles}>
			<Heading size="medium">Overflow</Heading>
			<Label id="date--label" htmlFor="date">
				DatePicker
			</Label>
			<DatePicker
				id="date"
				defaultValue="2018-03-01"
				dateFormat="do' of 'LLLL', 'yyyy"
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="date--label"
				openCalendarLabel="open calendar"
			/>

			{/* Eventually we should include the time and datetime pickers here, but the
			gemini tests won't render times correctly. */}

			{/* <Label id="time--label" htmlFor="time">
				TimePicker
			</Label>
			<TimePicker
				id="time"
				clearControlLabel="Clear timePicker defaultValue defaultIsOpen"
				defaultValue="10:00"
				onChange={console.log}
				timeFormat="HH:mm:ss X"
			/> */}

			{/* <Label id="datetime-label" htmlFor="datetime">
				DateTimePicker
			</Label>
			<DateTimePicker
				id="datetime"
				defaultValue="2018-01-02T14:30:00"
				onChange={console.log}
				datePickerProps={{
					label: 'Date, DateTimePicker defaultValue',
					shouldShowCalendarButton: true,
					dateFormat: "do' of 'LLLL', 'yyyy",
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{
					label: 'Time, DateTimePicker defaultValue',
					timeFormat: 'HH:mm:ss X',
				}}
			/> */}
		</Box>
	);
};
