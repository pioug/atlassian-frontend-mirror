import React from 'react';

import Calendar from '@atlaskit/calendar';

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useState
const disabledDates = [
	'2020-12-07',
	'2020-12-08',
	'2020-12-09',
	'2020-12-16',
	'2020-12-17',
	'2020-12-18',
];

export default () => (
	<Calendar defaultMonth={12} defaultYear={2020} defaultDay={15} disabled={disabledDates} />
);
