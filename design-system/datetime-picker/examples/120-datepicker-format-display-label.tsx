import React from 'react';

import moment from 'moment';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

const logValue = (value: string) => console.log(value);

const formatDisplayLabel = (value: string, dateFormat: string) => {
	moment.locale('fr');
	return moment(value).format(dateFormat);
};

export default () => (
	<Box>
		<Label htmlFor="datepicker">Date picker</Label>
		<DatePicker
			shouldShowCalendarButton
			id="datepicker"
			clearControlLabel="Clear date picker"
			onChange={logValue}
			dateFormat="MMMM/DD"
			placeholder="MMMM/DD"
			formatDisplayLabel={formatDisplayLabel}
		/>
	</Box>
);
