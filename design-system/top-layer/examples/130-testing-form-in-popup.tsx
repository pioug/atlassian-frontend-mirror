import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for tabbing through form fields inside a popup.
 * WCAG 2.1.1 Keyboard: all form fields inside a popup must be
 * reachable and operable via keyboard (Tab navigation).
 */
export default function TestingFormInPopup() {
	const [submitted, setSubmitted] = useState(false);

	const handleClose = useCallback(() => {}, []);

	return (
		<div>
			<div data-testid="submitted">{submitted ? 'yes' : 'no'}</div>
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button type="button" data-testid="popup-trigger">
						Open form popup
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Form popup">
					<div data-testid="popover-content">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setSubmitted(true);
							}}
						>
							<label htmlFor="field-1">Name</label>
							<input id="field-1" type="text" data-testid="form-input-1" />
							<label htmlFor="field-select">Category</label>
							<select id="field-select" data-testid="form-select">
								<option value="a">Option A</option>
								<option value="b">Option B</option>
							</select>
							<label htmlFor="field-2">Description</label>
							<input id="field-2" type="text" data-testid="form-input-2" />
							<button type="submit" data-testid="form-submit">
								Submit
							</button>
						</form>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
