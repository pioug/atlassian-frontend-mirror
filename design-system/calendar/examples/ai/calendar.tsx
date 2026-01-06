import React from 'react';

import Calendar from '@atlaskit/calendar';

const Examples = (): React.JSX.Element => (
	<>
		<Calendar
			selected={['2024-03-15']}
			onChange={(dates) => console.log('Selected dates:', dates)}
		/>
		<Calendar
			selected={['2024-03-20', '2024-03-21', '2024-03-22']}
			onChange={(dates) => console.log('Multiple dates:', dates)}
			defaultMonth={3}
			defaultYear={2024}
		/>
		<Calendar
			selected={[]}
			disabled={['2024-03-10', '2024-03-11']}
			minDate="2024-03-01"
			maxDate="2024-03-31"
			onChange={(dates) => console.log('Constrained dates:', dates)}
		/>
	</>
);
export default Examples;
