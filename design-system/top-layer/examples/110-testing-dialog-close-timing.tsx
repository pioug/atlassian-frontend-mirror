import React, { useCallback, useState } from 'react';

import { Dialog, type TDialogCloseReason } from '@atlaskit/top-layer/dialog';

/**
 * Test fixture: onClose runs synchronously; close is delayed 200ms so we can assert
 * close-reason is set while dialog is still visible (onClose before unmount/close).
 */
export default function TestingDialogCloseTiming() {
	const [isOpen, setIsOpen] = useState(false);
	const [lastReason, setLastReason] = useState<TDialogCloseReason | null>(null);

	const handleClose = useCallback(({ reason }: { reason: TDialogCloseReason }) => {
		setLastReason(reason);
		setTimeout(() => setIsOpen(false), 200);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			{lastReason != null && <div data-testid="close-reason">{lastReason}</div>}
			<Dialog onClose={handleClose} isOpen={isOpen} label="Close timing test" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<div data-testid="dialog-body">Escape or click backdrop — reason updates before close</div>
			</Dialog>
		</div>
	);
}
