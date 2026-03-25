import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for WCAG 3.2.1 On Focus:
 * When the popover is dismissed and focus returns to the trigger,
 * the popover must NOT re-open. This verifies that focus-return
 * does not trigger a context change.
 */
export default function TestingFocusReturnNoReopen() {
	const [openCount, setOpenCount] = useState(0);
	const [closeCount, setCloseCount] = useState(0);

	const handleClose = useCallback(() => {
		setCloseCount((c) => c + 1);
	}, []);

	return (
		<div>
			<div data-testid="open-count">{openCount}</div>
			<div data-testid="close-count">{closeCount}</div>
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button
						type="button"
						data-testid="popover-trigger"
						onFocus={() => setOpenCount((c) => c + 1)}
					>
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Focus return test">
					<div data-testid="popover-content">
						<button type="button" data-testid="inner-button">
							Inner button
						</button>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
