import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

const TimePickerDefaultExample = () => (
	<>
		<Label htmlFor="default-time-picker-example">Choose time</Label>
		<TimePicker clearControlLabel="Clear choose time" id="default-time-picker-example" />
	</>
);

export default TimePickerDefaultExample;
