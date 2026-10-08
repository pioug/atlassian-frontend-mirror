import React from 'react';

import TimePicker from '@atlaskit/datetime-picker/time-picker';
import { Label } from '@atlaskit/form/label/default';

const TimePickerButtonExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="time-picker-button-example">Choose time</Label>
		<TimePicker
			clearControlLabel="Clear choose time"
			id="time-picker-button-example"
			openTimeLabel="Open choose time"
			shouldShowTimeButton
		/>
	</>
);

export default TimePickerButtonExample;
