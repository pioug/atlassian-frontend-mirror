import React from 'react';

import { Field } from '@atlaskit/form';

import { TimePicker } from '../../src';

const TimePickerRequiredExample = () => (
	<Field name="time" label="Start Time" isRequired>
		{({ fieldProps: { ...rest } }) => <TimePicker clearControlLabel="Clear start time" {...rest} />}
	</Field>
);

export default TimePickerRequiredExample;
