import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import __noop from '@atlaskit/ds-lib/noop'

const Example = (): React.JSX.Element => (
	<TimePicker
		clearControlLabel="Clear select time (editable)"
		defaultValue="14:30"
		onChange={__noop}
		timeFormat="HH:mm:ss A"
		timeIsEditable
		selectProps={{
			classNamePrefix: 'timepicker-select',
		}}
	/>
);
export default Example;
