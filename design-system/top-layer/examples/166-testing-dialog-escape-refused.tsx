import React, { useCallback, useRef, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

type TPopoverMode = 'auto' | 'hint' | 'manual';

function ChildPopover({
	mode,
	testIdPrefix,
}: {
	mode: TPopoverMode;
	testIdPrefix: string;
}): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				data-testid={`${testIdPrefix}-trigger`}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				Open {mode} popover
			</button>
			<Popover
				ref={popoverRef}
				mode={mode}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label={`Child ${mode} popover`}
			>
				<button type="button" data-testid={`${testIdPrefix}-button`}>
					In {mode} popover
				</button>
			</Popover>
		</>
	);
}

/**
 * Test fixture: a dialog whose consumer always refuses the dismissal (keeps `isOpen` true),
 * with child `auto`, `hint` and `manual` popovers, text that cannot take focus, a button that
 * removes itself, and a button that calls `preventDefault()` on Escape. Browser tests press Escape many times.
 * `forced-count` counts closes that Dialog did not ask about: `onExitFinish` while `isOpen` is
 * `true`. It stays 0: the dialog has `closedby="none"`, so the browser never closes it.
 * With `confirm-mode` on, the second ask (and later ones) opens a confirm Dialog from `onClose`.
 */
export default function TestingDialogEscapeRefused(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closeCount, setCloseCount] = useState(0);
	const [forcedCount, setForcedCount] = useState(0);
	const [hasRemovableButton, setHasRemovableButton] = useState(true);
	const [isConfirmMode, setIsConfirmMode] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<button
				type="button"
				data-testid="confirm-mode"
				aria-pressed={isConfirmMode}
				onClick={() => setIsConfirmMode((previous) => !previous)}
			>
				Confirm on the second close request
			</button>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="forced-count">{forcedCount}</div>
			<Dialog
				onClose={() => {
					setCloseCount((count) => count + 1);
					if (isConfirmMode && closeCount >= 1) {
						setIsConfirmOpen(true);
					}
				}}
				onExitFinish={() => {
					if (isOpen) {
						setForcedCount((count) => count + 1);
					}
				}}
				isOpen={isOpen}
				label="Escape refused test"
				testId="dialog"
			>
				<button type="button" data-testid="dialog-first-button" onClick={() => setIsOpen(false)}>
					Close
				</button>
				<p data-testid="dialog-text">Text that cannot take focus</p>
				<ChildPopover mode="auto" testIdPrefix="popover" />
				<ChildPopover mode="hint" testIdPrefix="hint-popover" />
				<ChildPopover mode="manual" testIdPrefix="manual-popover" />
				{hasRemovableButton && (
					<button
						type="button"
						data-testid="removable-button"
						onClick={() => setHasRemovableButton(false)}
					>
						Remove me
					</button>
				)}
				<button
					type="button"
					data-testid="prevent-escape-button"
					onKeyDown={(event) => {
						if (event.key === 'Escape') {
							event.preventDefault();
						}
					}}
				>
					Prevents Escape
				</button>
			</Dialog>
			<Dialog
				onClose={() => setIsConfirmOpen(false)}
				isOpen={isConfirmOpen}
				label="Discard changes?"
				testId="confirm-dialog"
			>
				<button
					type="button"
					data-testid="confirm-button"
					onClick={() => {
						setIsConfirmOpen(false);
						setIsOpen(false);
					}}
				>
					Discard
				</button>
			</Dialog>
		</div>
	);
}
