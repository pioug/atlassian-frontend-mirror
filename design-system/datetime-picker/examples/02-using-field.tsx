import React from 'react';

import { Field } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<div>
			<Field name="date" label="Date">
				{({ fieldProps }) => <DatePicker {...fieldProps} />}
			</Field>

			<Field name="time" label="Time">
				{({ fieldProps }) => <TimePicker {...fieldProps} />}
			</Field>

			<Field name="datetime" label="Datetime">
				{({ fieldProps }) => <DateTimePicker {...fieldProps} />}
			</Field>
		</div>
	);
};
