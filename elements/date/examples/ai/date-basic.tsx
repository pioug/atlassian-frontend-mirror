import React from 'react';

import { Date } from '@atlaskit/date/date';

export default function ReleaseDate(): React.JSX.Element {
	return (
		<p>
			Release date: <Date value={globalThis.Date.UTC(2026, 9, 14)} />
		</p>
	);
}
