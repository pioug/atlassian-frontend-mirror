import React from 'react';

import TimePicker from '@atlaskit/datetime-picker/time-picker';
import { Label } from '@atlaskit/form/label/default';

const TimePickerLocaleExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="timepicker-locale-en">English locale</Label>
		<TimePicker
			clearControlLabel="Clear English locale"
			locale="en-US"
			id="timepicker-locale-en"
			shouldShowTimeButton
		/>
		<br />
		<Label htmlFor="timepicker-locale-ko">Korean locale</Label>
		<TimePicker
			clearControlLabel="Clear Korean locale"
			locale="ko-KR"
			id="timepicker-locale-ko"
			shouldShowTimeButton
		/>
	</>
);

export default TimePickerLocaleExample;
