import React from 'react';

import { Field } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Field name="date" label="Date">
				{({ fieldProps }) => (
					<DatePicker {...fieldProps} selectProps={{ inputId: fieldProps.id }} />
				)}
			</Field>

			<Field name="time" label="Time">
				{({ fieldProps }) => (
					<TimePicker {...fieldProps} selectProps={{ inputId: fieldProps.id }} />
				)}
			</Field>

			<Field name="datetime" label="Datetime">
				{({ fieldProps }) => (
					<DateTimePicker {...fieldProps} datePickerSelectProps={{ inputId: fieldProps.id }} />
				)}
			</Field>
		</div>
	);
};
