import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';

const _default_1: React.JSX.Element[] = [
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
export default _default_1;
