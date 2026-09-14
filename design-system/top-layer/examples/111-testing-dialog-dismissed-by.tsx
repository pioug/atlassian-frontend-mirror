import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import type { TDialogCloseReason, TDialogDismissedBy } from '@atlaskit/top-layer/dialog/types';

type TDialogState = { type: 'closed' } | { type: 'open'; dismissedBy: TDialogDismissedBy };

function getDismissedBy({ dialogState }: { dialogState: TDialogState }): TDialogDismissedBy {
	if (dialogState.type === 'open') {
		return dialogState.dismissedBy;
	}
	return 'none';
}

export default function TestingDialogDismissedBy(): React.ReactNode {
	const [dialogState, setDialogState] = useState<TDialogState>({ type: 'closed' });
	const [lastReason, setLastReason] = useState<TDialogCloseReason | null>(null);

	const handleClose = useCallback(({ reason }: { reason: TDialogCloseReason }) => {
		setLastReason(reason);
		setDialogState({ type: 'closed' });
	}, []);

	function openDialog({ dismissedBy }: { dismissedBy: TDialogDismissedBy }) {
		setLastReason(null);
		setDialogState({ type: 'open', dismissedBy });
	}

	const dismissedBy = getDismissedBy({ dialogState });

	return (
		<div>
			<button
				type="button"
				data-testid="open-escape-and-outside-click"
				onClick={() => openDialog({ dismissedBy: 'escape-and-outside-click' })}
			>
				Open with Escape and outside click
			</button>
			<button
				type="button"
				data-testid="open-escape"
				onClick={() => openDialog({ dismissedBy: 'escape' })}
			>
				Open with Escape
			</button>
			<button
				type="button"
				data-testid="open-none"
				onClick={() => openDialog({ dismissedBy: 'none' })}
			>
				Open without user dismissal
			</button>
			{lastReason != null && <div data-testid="close-reason">{lastReason}</div>}
			<Dialog
				onClose={handleClose}
				isOpen={dialogState.type === 'open'}
				dismissedBy={dismissedBy}
				label="Dismissal behavior test"
				testId="dialog"
			>
				<div data-testid="dialog-body">Dialog content</div>
				<button type="button" onClick={() => setDialogState({ type: 'closed' })}>
					Close
				</button>
			</Dialog>
		</div>
	);
}
