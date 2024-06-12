import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, TimePicker } from '../src';

export default () => (
	<>
		<h2>Date/ Time examples</h2>

		<h3>Time - Using explicit label</h3>
		<Label htmlFor="arrival">Arrival time</Label>
		<TimePicker
			selectProps={{
				inputId: 'arrival',
			}}
		/>
		<h3>Time - Using label prop only (no visible label)</h3>
		<TimePicker label="Departure time" />

		<h3>Date - Using explicit label</h3>
		<Label htmlFor="birthday">Birthday</Label>
		<DatePicker
			testId="test"
			selectProps={{
				inputId: 'birthday',
			}}
		/>

		<h3>Date - Using label prop only (no visible label)</h3>
		<DatePicker label="End date" />
	</>
);
