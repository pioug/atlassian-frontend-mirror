import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';

/**
 * Test fixture for verifying Tab cycles within a modal dialog.
 * WCAG 2.4.3 Focus Order: Tab should cycle (trap) within role="dialog" modals.
 * WCAG 2.1.2 No Keyboard Trap: Escape should always be able to dismiss.
 *
 * Contains three focusable elements inside the dialog and one outside.
 * Tab should cycle through dialog elements only; background should be inert.
 */
export default function TestingDialogTabTrap(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<button type="button" data-testid="outside-button">
				Outside button
			</button>
			<Dialog onClose={handleClose} isOpen={isOpen} label="Tab trap test" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<button type="button" data-testid="button-a">
					Button A
				</button>
				<button type="button" data-testid="button-b">
					Button B
				</button>
				<button type="button" data-testid="button-c">
					Button C
				</button>
			</Dialog>
		</div>
	);
}
