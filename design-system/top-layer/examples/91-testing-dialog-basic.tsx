import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';

export default function TestingDialogBasic() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<Dialog onClose={handleClose} isOpen={isOpen} labelledBy="dialog-title" testId="dialog">
				<h1 id="dialog-title">Test dialog</h1>
				<div data-testid="dialog-body">Dialog content</div>
				<button type="button" aria-label="Close" onClick={handleClose}>
					&#x2715;
				</button>
			</Dialog>
		</div>
	);
}
