import React from 'react';

import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

function now(day: number) {
	const date = new Date();
	date.setDate(day);
	return date.toISOString();
}

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useCallback
const weekendFilter = (date: string) => {
	const dayOfWeek = parseISO(date).getDay();
	return dayOfWeek === 0 || dayOfWeek === 6;
};

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useState
const disabledDates = [now(10), now(11), now(12)];

export default () => {
	return (
		<Box>
			<Label htmlFor="datepicker">Date picker</Label>
			<DatePicker
				id="datepicker"
				minDate={now(8)}
				maxDate={now(28)}
				disabled={disabledDates}
				disabledDateFilter={weekendFilter}
				onChange={console.log}
			/>
		</Box>
	);
};
