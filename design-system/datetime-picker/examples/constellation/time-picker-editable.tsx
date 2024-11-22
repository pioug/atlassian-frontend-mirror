import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';

export default function App() {
	return (
		<>
			<Label htmlFor="timepicker-editable-time">Editable time example</Label>
			<TimePicker
				clearControlLabel="Clear editable time example"
				timeIsEditable
				id="timepicker-editable-time"
			/>
		</>
	);
}
