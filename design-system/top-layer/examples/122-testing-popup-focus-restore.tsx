import React, { useCallback, useRef, useState } from 'react';

import { Popup, type TTriggerFunctionRenderProps } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for native Popover API focus restoration (WCAG 2.4.3 Focus Order).
 *
 * The browser handles focus restoration automatically for popover="auto":
 *   - Escape → restores focus to the previously focused element (the trigger)
 *   - Click-outside (light dismiss) → does NOT restore focus
 *   - hidePopover() → restores focus to the previously focused element
 *
 * Verifies that:
 * - role="dialog" → focus restores to trigger on Escape
 * - role="menu" → focus restores to trigger on Escape
 * - role="listbox" → focus restores to trigger on Escape
 * - role="tooltip" → focus does NOT move (tooltip never receives focus)
 *
 * No custom focus restoration hooks are needed.
 */
export default function TestingPopupFocusRestore(): React.JSX.Element {
	return (
		<div>
			<DialogPopup />
			<MenuPopup />
			<ListboxPopup />
			<TooltipPopup />
			<input data-testid="external-input" placeholder="External focusable element" />
		</div>
	);
}

function DialogPopup() {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="dialog-trigger">
					Open dialog
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Dialog popup" testId="dialog-popup">
				<div>
					<button type="button" data-testid="dialog-inner-button">
						Button inside dialog
					</button>
				</div>
			</Popup.Content>
		</Popup>
	);
}

function MenuPopup() {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="menu-trigger">
					Open menu
				</button>
			</Popup.Trigger>
			<Popup.Content role="menu" label="Menu popup" testId="menu-popup">
				<div>
					<button type="button" role="menuitem" data-testid="menu-item">
						Menu item
					</button>
				</div>
			</Popup.Content>
		</Popup>
	);
}

function ListboxPopup() {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button type="button" data-testid="listbox-trigger">
					Open listbox
				</button>
			</Popup.Trigger>
			<Popup.Content role="listbox" label="Listbox popup" testId="listbox-popup">
				<div role="option" aria-selected="false" data-testid="listbox-option">
					Option 1
				</div>
			</Popup.Content>
		</Popup>
	);
}

function TooltipPopup() {
	const triggerRef = useRef<HTMLElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup placement={{ edge: 'end' }} onClose={() => setIsOpen(false)}>
			<Popup.TriggerFunction>
				{({ ref, ariaAttributes }: TTriggerFunctionRenderProps) => (
					<button
						type="button"
						data-testid="tooltip-trigger"
						ref={(node) => {
							triggerRef.current = node;
							ref(node);
						}}
						onMouseEnter={() => setIsOpen(true)}
						onMouseLeave={() => setIsOpen(false)}
						onFocus={() => setIsOpen(true)}
						onBlur={() => setIsOpen(false)}
						{...ariaAttributes}
					>
						Hover for tooltip
					</button>
				)}
			</Popup.TriggerFunction>
			<Popup.Content role="tooltip" label="Tooltip popup" isOpen={isOpen} testId="tooltip-popup">
				<div>Tooltip content</div>
			</Popup.Content>
		</Popup>
	);
}
