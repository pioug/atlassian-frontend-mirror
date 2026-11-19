import React, { type ReactNode, useState } from 'react';

import { Popover } from '@atlaskit/top-layer/popover/popover';

/**
 * Test fixture for a `Popover` whose focused element is lost. It has no role, as a `Popup` has. Its
 * content loses focus in three ways: "Cancel" swaps back to an "Add" button and closes the popover
 * in one press, "Remove me" removes itself, and "Save" disables itself. A button after the popover
 * is the next element for Tab.
 *
 * See `__tests__/playwright/popover-close-after-focus-loss.spec.tsx` and
 * `notes/decisions/focus-loss-recovery.md`.
 */
export default function TestingPopoverCloseAfterFocusLoss(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(true);
	const [isRemovableShown, setIsRemovableShown] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const open = () => {
		setIsEditing(true);
		setIsRemovableShown(true);
		setIsSaving(false);
		setIsOpen(true);
	};
	return (
		<div>
			<button type="button" data-testid="trigger" onClick={open}>
				Open popover
			</button>
			<Popover isOpen={isOpen} onClose={() => setIsOpen(false)} testId="popover">
				<p>Popover text</p>
				{isEditing ? (
					<button
						key="cancel"
						type="button"
						onClick={() => {
							setIsEditing(false);
							setIsOpen(false);
						}}
					>
						Cancel
					</button>
				) : (
					<button key="add" type="button">
						Add
					</button>
				)}
				{isRemovableShown ? (
					<button type="button" onClick={() => setIsRemovableShown(false)}>
						Remove me
					</button>
				) : null}
				<button type="button" disabled={isSaving} onClick={() => setIsSaving(true)}>
					Save
				</button>
			</Popover>
			<button type="button">Outside button</button>
		</div>
	);
}
