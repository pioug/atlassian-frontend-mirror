import React from 'react';

import { DateLabelDropdownTrigger } from '@atlaskit/date-label';

export default function DateLabelDropdownTriggerNoIcon(): React.JSX.Element {
	return (
		<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" hasIconBefore={false} />
	);
}
