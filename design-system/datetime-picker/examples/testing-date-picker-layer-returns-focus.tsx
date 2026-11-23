import React, { type FocusEvent, type KeyboardEvent, useState } from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import { Label } from '@atlaskit/form/label/default';
import { Popup } from '@atlaskit/popup/popup';

/**
 * Test fixture: a popup that the field opens returns focus to the date input as it closes, as the
 * Jira due-date "Set to recur" form does. F2 in the input opens the popup, so focus stays in the
 * input. While the popup is open, the calendar is held closed with `isOpen={false}`, and the input
 * blur does not reach the picker (as in Jira).
 */
export default function TestingDatePickerLayerReturnsFocus(): React.JSX.Element {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	// Select calls `onKeyDown` for keys in its input and in the calendar.
	const openOnF2 = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'F2') {
			setIsPopupOpen(true);
		}
	};
	return (
		<div>
			<Label htmlFor="layer-returns-focus">Date</Label>
			<DatePicker
				id="layer-returns-focus"
				testId="layer-returns-focus"
				shouldShowCalendarButton
				isOpen={isPopupOpen ? false : undefined}
				selectProps={{
					onKeyDown: openOnF2,
					...(isPopupOpen && {
						onBlur: (event: FocusEvent<HTMLInputElement>) => {
							event.stopPropagation();
						},
					}),
				}}
			/>
			<Popup
				isOpen={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
				role="dialog"
				label="Repeat"
				placement="bottom-start"
				shouldRenderToParent
				// An anchor only, as in Jira: the field, not this element, opens the popup.
				trigger={({ ref }) => <span ref={ref} />}
				content={() => (
					<button type="button" onClick={() => setIsPopupOpen(false)}>
						Cancel
					</button>
				)}
			/>
		</div>
	);
}
