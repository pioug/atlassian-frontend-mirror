import React from 'react';

import { Label } from '@atlaskit/form';

import { TimePicker } from '../../src';

const TimePickerLocaleExample = () => (
	<>
		<Label htmlFor="timepicker-locale-en">English locale</Label>
		<TimePicker
			locale="en-US"
			selectProps={{
				inputId: 'timepicker-locale-en',
			}}
		/>
		<br />
		<Label htmlFor="timepicker-locale-ko">Korean locale</Label>
		<TimePicker
			locale="ko-KR"
			selectProps={{
				inputId: 'timepicker-locale-ko',
			}}
		/>
	</>
);

export default TimePickerLocaleExample;
