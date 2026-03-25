import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for focus restoration when trigger is removed.
 * WCAG 2.4.3 Focus Order: when the trigger element is removed from the DOM
 * after the popup closes, focus should not fall to <body>.
 */
export default function TestingFocusReturnRef() {
	const [showTrigger, setShowTrigger] = useState(true);
	const [closeCount, setCloseCount] = useState(0);

	const handleClose = useCallback(() => {
		setCloseCount((c) => c + 1);
	}, []);

	const handleRemoveAndClose = useCallback(() => {
		setShowTrigger(false);
	}, []);

	return (
		<div>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="trigger-visible">{showTrigger ? 'yes' : 'no'}</div>
			{showTrigger ? (
				<Popup placement={{ edge: 'end' }} onClose={handleClose}>
					<Popup.Trigger>
						<button type="button" data-testid="popup-trigger">
							Open popup
						</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="Trigger removal test">
						<div data-testid="popover-content">
							<button
								type="button"
								data-testid="remove-trigger-button"
								onClick={handleRemoveAndClose}
							>
								Remove trigger and close
							</button>
						</div>
					</Popup.Content>
				</Popup>
			) : null}
			<button type="button" data-testid="fallback-target">
				Fallback focus target
			</button>
		</div>
	);
}
