import React, { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import type { TDialogCloseReason } from '@atlaskit/top-layer/dialog/types';

/**
 * Test fixture: captures the native open state during `onClose` so browser tests
 * can verify that `Dialog` asks before it closes. With "Ignore dismissal" checked,
 * `onClose` keeps `isOpen` true, so the dialog should stay open. `native-close-count`
 * counts native `close` events, so tests can see when the browser closed the dialog.
 * The second button lets tests check that the fallback restores focus to it.
 */
export default function TestingDialogCloseTiming(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [lastReason, setLastReason] = useState<TDialogCloseReason | null>(null);
	const [wasOpenDuringOnClose, setWasOpenDuringOnClose] = useState<boolean | null>(null);
	const [shouldIgnoreDismissal, setShouldIgnoreDismissal] = useState(false);
	const [closeCount, setCloseCount] = useState(0);
	const [nativeCloseCount, setNativeCloseCount] = useState(0);
	const dialogRef = useRef<HTMLDialogElement>(null);

	// `close` does not bubble, so listen in the capture phase.
	useEffect(
		() =>
			bind(document, {
				type: 'close',
				listener(event) {
					if (event.target === dialogRef.current) {
						setNativeCloseCount((count) => count + 1);
					}
				},
				options: { capture: true },
			}),
		[],
	);

	const handleClose = useCallback(
		({ reason }: { reason: TDialogCloseReason }) => {
			setLastReason(reason);
			setWasOpenDuringOnClose(dialogRef.current?.open ?? null);
			setCloseCount((count) => count + 1);
			if (!shouldIgnoreDismissal) {
				setIsOpen(false);
			}
		},
		[shouldIgnoreDismissal],
	);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<label>
				<input
					type="checkbox"
					data-testid="ignore-dismissal"
					checked={shouldIgnoreDismissal}
					onChange={(event) => setShouldIgnoreDismissal(event.target.checked)}
				/>
				Ignore dismissal
			</label>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="native-close-count">{nativeCloseCount}</div>
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
				<button type="button" data-testid="dialog-second-button">
					Second button
				</button>
			</Dialog>
		</div>
	);
}
