import React from 'react';

import { Field } from '@atlaskit/form';

import { DatePicker } from '../../src';

const DatePickerRequiredExample = () => (
	<Field name="date" label="Start Date" isRequired>
		{({ fieldProps: { ...rest } }) => <DatePicker clearControlLabel="Clear start date" {...rest} />}
	</Field>
);

export default DatePickerRequiredExample;
