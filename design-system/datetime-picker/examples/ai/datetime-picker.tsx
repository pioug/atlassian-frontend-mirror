import React from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';

const _default_1: React.JSX.Element[] = [
	<DateTimePicker
		clearControlLabel="Clear date / time picker (editable times)"
		defaultValue="2018-01-02T14:30+10:00"
		onChange={() => {}}
		timePickerProps={{
			timeIsEditable: true,
			label: 'Time picker (editable)',
		}}
		datePickerProps={{
			label: 'Date picker (editable times)',
			shouldShowCalendarButton: true,
			openCalendarLabel: 'open calendar',
		}}
	/>,
];
export default _default_1;
