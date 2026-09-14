import React from 'react';

import { TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form/label/default';

const TimePickerLocaleExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="timepicker-locale-en">English locale</Label>
		<TimePicker clearControlLabel="Clear English locale" locale="en-US" id="timepicker-locale-en" />
		<br />
		<Label htmlFor="timepicker-locale-ko">Korean locale</Label>
		<TimePicker clearControlLabel="Clear Korean locale" locale="ko-KR" id="timepicker-locale-ko" />
	</>
);

export default TimePickerLocaleExample;
