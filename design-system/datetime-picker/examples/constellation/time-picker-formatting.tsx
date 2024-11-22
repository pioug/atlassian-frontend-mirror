import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const TimePickerFormattingExample = () => (
	<>
		<Label htmlFor="timepicker-custom-format">Custom Time Format</Label>
		<TimePicker
			clearControlLabel="Clear custom time format"
			timeFormat="HH:mm"
			placeholder="13:30"
			id="timepicker-custom-format"
		/>
	</>
);

export default TimePickerFormattingExample;
