import React from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

const parseInputValue = (date: string, dateFormat: string) => {
	return moment(date, dateFormat).toDate();
};

export default () => {
	return (
		<Box>
			<Label htmlFor="react-select-custom-parser--input">
				Custom date format and parseInputValue prop
			</Label>
			<DatePicker
				id="react-select-custom-parser--input"
				dateFormat="DD/MM/YY"
				parseInputValue={parseInputValue}
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
			/>
		</Box>
	);
};
