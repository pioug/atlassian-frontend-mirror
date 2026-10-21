import React, { useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';

/**
 * Test fixture: a refusing dialog inside an open `auto` popover, as Forge renders a modal inside
 * a popup. The dialog has an open `manual` child popover, which does not take Escape, so the
 * Escape goes to the dialog. Dialog takes it, so the browser makes no close request, and the
 * popover stays open.
 *
 * - `separate-trigger`: opens the popover, then a button in it opens the dialog. Two clicks, so
 *   the popover and the dialog get separate close watcher groups.
 * - `grouped-trigger`: opens the popover on click, then the dialog and the manual popover from a
 *   timer, with no user input in between (as Forge opens a modal after a fetch or an iframe
 *   message). The popover and the dialog then share one close watcher group, so one close request
 *   reaches both.
 *
 * `close-count` counts the dialog's asks, `popover-close-count` the popover's `onClose` calls and
 * `exit-while-open-count` the dialog's `onExitFinish` calls while its `isOpen` is `true`.
 */
export default function TestingDialogInAutoPopover(): React.ReactNode {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isManualOpen, setIsManualOpen] = useState(false);
	const [closeCount, setCloseCount] = useState(0);
	const [popoverCloseCount, setPopoverCloseCount] = useState(0);
	const [exitWhileOpenCount, setExitWhileOpenCount] = useState(0);

	return (
		<div>
			<button type="button" data-testid="separate-trigger" onClick={() => setIsPopoverOpen(true)}>
				Open popover
			</button>
			<button
				type="button"
				data-testid="grouped-trigger"
				onClick={() => {
					setIsPopoverOpen(true);
					setTimeout(() => {
						setIsDialogOpen(true);
						setIsManualOpen(true);
					}, 100);
				}}
			>
				Open popover, then the dialog from a timer
			</button>
			<button type="button" data-testid="close-dialog" onClick={() => setIsDialogOpen(false)}>
				Set dialog isOpen false
			</button>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="popover-close-count">{popoverCloseCount}</div>
			<div data-testid="exit-while-open-count">{exitWhileOpenCount}</div>
			<Popover
				mode="auto"
				isOpen={isPopoverOpen}
				onClose={() => {
					setPopoverCloseCount((count) => count + 1);
					setIsPopoverOpen(false);
				}}
				role="dialog"
				label="Host popover"
				testId="host-popover"
			>
				<button type="button" data-testid="dialog-trigger" onClick={() => setIsDialogOpen(true)}>
					Open dialog
				</button>
				<Dialog
					onClose={() => setCloseCount((count) => count + 1)}
					onExitFinish={() => {
						if (isDialogOpen) {
							setExitWhileOpenCount((count) => count + 1);
						}
					}}
					isOpen={isDialogOpen}
					label="Refusing dialog in a popover"
					testId="dialog"
				>
					<button
						type="button"
						data-testid="manual-popover-trigger"
						onClick={() => setIsManualOpen(true)}
					>
						Open manual popover
					</button>
					<Popover
						mode="manual"
						isOpen={isManualOpen}
						onClose={() => setIsManualOpen(false)}
						role="dialog"
						label="Manual popover"
					>
						<button type="button" data-testid="manual-popover-button">
							In manual popover
						</button>
					</Popover>
				</Dialog>
			</Popover>
		</div>
	);
}
