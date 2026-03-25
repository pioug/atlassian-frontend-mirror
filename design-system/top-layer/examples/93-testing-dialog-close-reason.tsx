import React, { useCallback, useState } from 'react';

import { Dialog, type TDialogCloseReason } from '@atlaskit/top-layer/dialog';

export default function TestingDialogCloseReason() {
	const [isOpen, setIsOpen] = useState(false);
	const [lastReason, setLastReason] = useState<TDialogCloseReason | null>(null);

	const handleClose = useCallback(({ reason }: { reason: TDialogCloseReason }) => {
		setLastReason(reason);
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			{lastReason && <div data-testid="close-reason">{lastReason}</div>}
			<Dialog onClose={handleClose} isOpen={isOpen} label="Close reason test" testId="dialog">
				<div data-testid="dialog-body">Close this dialog to see the reason</div>
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
			</Dialog>
		</div>
	);
}
