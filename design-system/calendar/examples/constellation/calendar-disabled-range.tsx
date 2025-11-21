import React from 'react';

import Calendar from '@atlaskit/calendar';

export default (): React.JSX.Element => (
	<Calendar
		defaultMonth={12}
		defaultYear={2020}
		defaultDay={15}
		minDate={'2020-12-10'}
		maxDate={'2020-12-20'}
	/>
);
