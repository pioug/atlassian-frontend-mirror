import React from 'react';

import { Label } from '@atlaskit/form';

import { TimePicker } from '../../src';

const TimePickerFormattingExample = () => (
	<>
		<Label htmlFor="timepicker-custom-format">Custom Time Format</Label>
		<TimePicker timeFormat="HH:mm" placeholder="13:30" id="timepicker-custom-format" />
	</>
);

export default TimePickerFormattingExample;
