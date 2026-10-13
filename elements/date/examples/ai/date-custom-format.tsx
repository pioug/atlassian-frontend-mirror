import React from 'react';

import { Date } from '@atlaskit/date/date';

export default function TaskDueDate(): React.JSX.Element {
	return (
		<p>
			Past due since:{' '}
			<Date value={globalThis.Date.UTC(2025, 9, 14)} format="d MMM yyyy" color="red" />
		</p>
	);
}
