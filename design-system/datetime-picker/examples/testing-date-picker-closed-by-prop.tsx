import React, { type KeyboardEvent, useState } from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import { Label } from '@atlaskit/form/label/default';

/**
 * Test fixture: an app closes the calendar with `isOpen={false}` while focus is in it, then
 * removes the prop. F2 toggles the prop from the keyboard, so focus stays in the picker.
 */
export default function TestingDatePickerClosedByProp(): React.JSX.Element {
	const [isClosedByProp, setIsClosedByProp] = useState(false);
	// Select calls `onKeyDown` for keys in its input and in the calendar.
	const toggleOnF2 = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'F2') {
			setIsClosedByProp((previous) => !previous);
		}
	};
	return (
		<div>
			<Label htmlFor="closed-by-prop">Date</Label>
			<DatePicker
				id="closed-by-prop"
				testId="closed-by-prop"
				shouldShowCalendarButton
				isOpen={isClosedByProp ? false : undefined}
				selectProps={{ onKeyDown: toggleOnF2 }}
			/>
			<p data-testid="closed-by-prop-state">
				{isClosedByProp ? 'Closed by isOpen={false}' : 'No isOpen prop'}
			</p>
		</div>
	);
}
