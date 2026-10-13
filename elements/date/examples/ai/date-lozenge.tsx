import React from 'react';

import { DateLozenge } from '@atlaskit/date/date-lozenge';

export default function ReviewMilestone(): React.JSX.Element {
	return (
		<p>
			Next review: <DateLozenge color="blue">Review scheduled</DateLozenge>
		</p>
	);
}
