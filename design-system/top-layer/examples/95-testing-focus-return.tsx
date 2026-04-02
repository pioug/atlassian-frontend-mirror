import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';

export default function TestingFocusReturn(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<input data-testid="other-input" placeholder="Other focusable element" />
			<Dialog onClose={handleClose} isOpen={isOpen} label="Focus return test" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<button type="button" data-testid="dialog-button">
					Button inside dialog
				</button>
			</Dialog>
		</div>
	);
}
