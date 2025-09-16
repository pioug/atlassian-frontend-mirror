import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';

export default [
	<TimePicker
		clearControlLabel="Clear select time (editable)"
		defaultValue="14:30"
		onChange={() => {}}
		timeFormat="HH:mm:ss A"
		timeIsEditable
		selectProps={{
			classNamePrefix: 'timepicker-select',
		}}
	/>,
];
