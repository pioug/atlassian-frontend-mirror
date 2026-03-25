import React, { useCallback, useRef, useState } from 'react';

import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

/**
 * Test fixture for verifying Tab focus trapping within a popover with role="dialog".
 *
 * WCAG 2.4.3 Focus Order: Tab should cycle (trap) within role="dialog" popovers.
 * WCAG 2.1.2 No Keyboard Trap: Escape should always dismiss via light dismiss.
 *
 * Contains:
 * - A dialog popup with 3 focusable buttons (tests Tab wrapping)
 * - A non-dialog popup with role="note" (tests that Tab is NOT trapped)
 * - Buttons outside the popups (verifies focus doesn't escape to them)
 */

function DialogPopup() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleOpenChange = useCallback(
		({ isOpen: open, element }: { isOpen: boolean; element: HTMLDivElement }) => {
			if (open) {
				getFirstFocusable({ container: element })?.focus();
			}
		},
		[],
	);

	return (
		<Popup
			placement={{}}
			onClose={handleClose}
			onOpenChange={handleOpenChange}
			testId="dialog-popup"
		>
			<Popup.Trigger>
				<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
					Open dialog popup
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Focus trap test" isOpen={isOpen}>
				<PopupSurface>
					<button type="button" data-testid="dialog-button-a">
						Button A
					</button>
					<button type="button" data-testid="dialog-button-b">
						Button B
					</button>
					<button type="button" data-testid="dialog-button-c">
						Button C
					</button>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

function NotePopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<Popup placement={{}} onClose={handleClose} testId="note-popup">
			<Popup.Trigger>
				<button
					ref={triggerRef}
					type="button"
					data-testid="note-trigger"
					onClick={() => setIsOpen(true)}
				>
					Open note popup
				</button>
			</Popup.Trigger>
			<Popup.Content role="note" isOpen={isOpen}>
				<PopupSurface>
					<button type="button" data-testid="note-button-a">
						Note Button A
					</button>
					<button type="button" data-testid="note-button-b">
						Note Button B
					</button>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

export default function TestingPopoverDialogFocusTrap() {
	return (
		<div>
			<button type="button" data-testid="outside-before">
				Outside before
			</button>
			<DialogPopup />
			<NotePopup />
			<button type="button" data-testid="outside-after">
				Outside after
			</button>
		</div>
	);
}
