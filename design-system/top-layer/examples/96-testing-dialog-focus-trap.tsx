import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';

export default function TestingDialogFocusTrap() {
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
				Outside button (should be inert when dialog open)
			</button>
			<Dialog onClose={handleClose} isOpen={isOpen} label="Focus trap test" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<button type="button" data-testid="first-button">
					First
				</button>
				<button type="button" data-testid="second-button">
					Second
				</button>
			</Dialog>
		</div>
	);
}
