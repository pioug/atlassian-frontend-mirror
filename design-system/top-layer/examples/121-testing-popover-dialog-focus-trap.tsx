import React, { useCallback, useRef, useState } from 'react';

import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for verifying Tab focus trapping within a popover with role="dialog".
 *
 * WCAG 2.4.3 Focus Order: Tab should cycle (trap) within role="dialog" popovers.
 * WCAG 2.1.2 No Keyboard Trap: Escape should always dismiss via light dismiss.
 */
function DialogPopover() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: {},
	});

	const handleOpenChange = useCallback(
		({ isOpen: nextOpen, element }: { isOpen: boolean; element: HTMLDivElement }) => {
			if (nextOpen) {
				getFirstFocusable({ container: element })?.focus();
			}
		},
		[],
	);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				data-testid="dialog-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open dialog popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Focus trap test"
				testId="dialog-popup"
				isOpen={isOpen}
				onClose={close}
				onOpenChange={handleOpenChange}
			>
				<PopoverSurface>
					<button type="button" data-testid="dialog-button-a">
						Button A
					</button>
					<button type="button" data-testid="dialog-button-b">
						Button B
					</button>
					<button type="button" data-testid="dialog-button-c">
						Button C
					</button>
				</PopoverSurface>
			</Popover>
		</>
	);
}

function NotePopover() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: {},
	});

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				data-testid="note-trigger"
				onClick={toggle}
				// role="note" is informational — no aria-haspopup or aria-expanded on the trigger.
				// aria-controls links the trigger to the note content.
				aria-controls={popoverId}
			>
				Open note popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="note"
				testId="note-popup"
				isOpen={isOpen}
				onClose={close}
			>
				<PopoverSurface>
					<button type="button" data-testid="note-button-a">
						Note Button A
					</button>
					<button type="button" data-testid="note-button-b">
						Note Button B
					</button>
				</PopoverSurface>
			</Popover>
		</>
	);
}

export default function TestingPopoverDialogFocusTrap(): React.ReactNode {
	return (
		<div>
			<button type="button" data-testid="outside-before">
				Before
			</button>
			<DialogPopover />
			<NotePopover />
			<button type="button" data-testid="outside-after">
				After
			</button>
		</div>
	);
}
