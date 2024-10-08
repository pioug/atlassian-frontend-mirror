import React from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

const logValue = (value: string) => console.log(value);

const formatDisplayLabel = (value: string, dateFormat: string) => {
	moment.locale('fr');
	return moment(value).format(dateFormat);
};

export default () => (
	<Box>
		<Label htmlFor="datepicker">Date picker</Label>
		<DatePicker
			id="datepicker"
			onChange={logValue}
			dateFormat="MMMM/DD"
			placeholder="MMMM/DD"
			formatDisplayLabel={formatDisplayLabel}
		/>
	</Box>
);
