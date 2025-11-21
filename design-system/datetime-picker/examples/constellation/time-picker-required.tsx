import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Field } from '@atlaskit/form';

const TimePickerRequiredExample = (): React.JSX.Element => (
	<Field name="time" label="Start Time" isRequired>
		{({ fieldProps: { ...rest } }) => <TimePicker clearControlLabel="Clear start time" {...rest} />}
	</Field>
);

export default TimePickerRequiredExample;
