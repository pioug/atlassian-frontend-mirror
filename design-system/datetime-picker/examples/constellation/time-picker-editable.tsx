import React from 'react';

import { Label } from '@atlaskit/form';

import { TimePicker } from '../../src';

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
