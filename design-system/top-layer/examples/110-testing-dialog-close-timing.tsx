import React, { useCallback, useRef, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import type { TDialogCloseReason } from '@atlaskit/top-layer/dialog/types';

/**
 * Test fixture: captures the native open state during `onClose` so browser tests
 * can verify that dismissal happens before controlled-state synchronization.
 */
export default function TestingDialogCloseTiming(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [lastReason, setLastReason] = useState<TDialogCloseReason | null>(null);
	const [wasOpenDuringOnClose, setWasOpenDuringOnClose] = useState<boolean | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleClose = useCallback(({ reason }: { reason: TDialogCloseReason }) => {
		setLastReason(reason);
		setWasOpenDuringOnClose(dialogRef.current?.open ?? null);
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			{lastReason != null && <div data-testid="close-reason">{lastReason}</div>}
			{wasOpenDuringOnClose != null && (
				<div data-testid="dialog-open-during-on-close">{String(wasOpenDuringOnClose)}</div>
			)}
			<div data-testid="controlled-open-state">{isOpen ? 'open' : 'closed'}</div>
			<Dialog
				ref={dialogRef}
				onClose={handleClose}
				isOpen={isOpen}
				label="Close timing test"
				testId="dialog"
			>
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<div data-testid="dialog-body">Escape or click backdrop to close</div>
			</Dialog>
		</div>
	);
}
