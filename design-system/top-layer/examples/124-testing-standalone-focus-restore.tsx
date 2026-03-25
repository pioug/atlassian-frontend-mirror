import React, { useCallback, useState } from 'react';

import { Popover } from '@atlaskit/top-layer/popover';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

/**
 * Test fixture for standalone Popover with native focus restoration.
 *
 * Demonstrates that the browser's native Popover API automatically
 * handles focus restoration when the popover closes. No custom hook
 * is needed — focus is restored by the browser.
 */

function StandaloneDialogPopover() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button
				type="button"
				data-testid="standalone-dialog-trigger"
				onClick={() => setIsOpen(true)}
			>
				Open standalone dialog
			</button>
			<Popover
				isOpen={isOpen}
				onClose={handleClose}
				role="dialog"
				label="Standalone dialog"
				testId="standalone-dialog-popover"
			>
				<PopupSurface>
					<button type="button" data-testid="standalone-dialog-inner-button">
						Button inside dialog
					</button>
					<button
						type="button"
						data-testid="standalone-dialog-close-button"
						onClick={handleClose}
					>
						Close
					</button>
				</PopupSurface>
			</Popover>
		</div>
	);
}

function StandaloneMenuPopover() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button
				type="button"
				data-testid="standalone-menu-trigger"
				onClick={() => setIsOpen(true)}
			>
				Open standalone menu
			</button>
			<Popover
				isOpen={isOpen}
				onClose={handleClose}
				role="menu"
				label="Standalone menu"
				testId="standalone-menu-popover"
			>
				<PopupSurface>
					<div role="menuitem" tabIndex={0} data-testid="standalone-menu-item">
						Menu item
					</div>
				</PopupSurface>
			</Popover>
		</div>
	);
}

export default function TestingStandaloneFocusRestore() {
	return (
		<div>
			<StandaloneDialogPopover />
			<StandaloneMenuPopover />
			<input data-testid="external-input" placeholder="External focusable element" />
		</div>
	);
}
