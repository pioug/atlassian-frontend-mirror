import React from 'react';

import moment from 'moment';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

const parseInputValue = (date: string, dateFormat: string) => {
	return moment(date, dateFormat).toDate();
};

export default (): React.JSX.Element => {
	return (
		<Box>
			<Label id="custom" htmlFor="react-select-custom-parser--input">
				Custom date format and parseInputValue prop
			</Label>
			<DatePicker
				id="react-select-custom-parser--input"
				clearControlLabel="Clear custom date format and parseInputValue prop"
				dateFormat="DD/MM/YY"
				parseInputValue={parseInputValue}
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="custom"
				openCalendarLabel="open calendar"
			/>
		</Box>
	);
};
