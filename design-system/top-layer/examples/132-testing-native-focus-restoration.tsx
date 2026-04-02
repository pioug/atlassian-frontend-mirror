import React, { useCallback, useRef } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for native Popover API focus restoration.
 *
 * The browser handles focus restoration automatically for popover="auto":
 *   - Escape → restores focus to the previously focused element (the trigger)
 *   - Click-outside (light dismiss) → does NOT restore focus
 *   - hidePopover() → restores focus to the previously focused element
 *
 * No custom focus restoration hooks are needed. The browser tracks
 * `previouslyFocusedElement` when the popover opens and restores it
 * synchronously during the hide algorithm.
 */
export default function TestingNativeFocusRestoration(): React.JSX.Element {
	return (
		<div>
			<PopoverAutoDialog />
			<PopoverAutoMenu />
			<ProgrammaticClose />
			<input data-testid="external-input" placeholder="External focusable element" />
		</div>
	);
}

function PopoverAutoDialog() {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="auto-dialog-trigger">
					Open auto dialog
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Auto dialog popup" testId="auto-dialog-popup">
				<div>
					<button type="button" data-testid="auto-dialog-inner-button">
						Button inside dialog
					</button>
				</div>
			</Popup.Content>
		</Popup>
	);
}

function PopoverAutoMenu() {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="auto-menu-trigger">
					Open auto menu
				</button>
			</Popup.Trigger>
			<Popup.Content role="menu" label="Auto menu popup" testId="auto-menu-popup">
				<div>
					<button type="button" role="menuitem" data-testid="auto-menu-item">
						Menu item
					</button>
				</div>
			</Popup.Content>
		</Popup>
	);
}

function ProgrammaticClose() {
	const popoverRef = useRef<HTMLDivElement | null>(null);

	const handleClose = useCallback(() => {}, []);

	const handleProgrammaticClose = useCallback(() => {
		popoverRef.current?.hidePopover();
	}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="programmatic-trigger">
					Open programmatic popup
				</button>
			</Popup.Trigger>
			<Popup.Content
				ref={popoverRef}
				role="dialog"
				label="Programmatic close popup"
				testId="programmatic-popup"
			>
				<div>
					<button type="button" data-testid="programmatic-inner-button">
						Inner button
					</button>
					<button
						type="button"
						data-testid="programmatic-close-button"
						onClick={handleProgrammaticClose}
					>
						Close programmatically
					</button>
				</div>
			</Popup.Content>
		</Popup>
	);
}
