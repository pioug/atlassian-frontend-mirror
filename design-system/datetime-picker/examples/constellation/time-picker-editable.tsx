import React from 'react';

import TimePicker from '@atlaskit/datetime-picker/time-picker';
import { Label } from '@atlaskit/form/label/default';

export default function App(): React.JSX.Element {
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
