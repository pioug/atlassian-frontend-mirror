import React from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import __noop from '@atlaskit/ds-lib/noop'

const Example = (): React.JSX.Element => (
	<DatePicker
		clearControlLabel="Clear select date"
		onChange={__noop}
		shouldShowCalendarButton
		openCalendarLabel="open calendar"
	/>
);
export default Example;
