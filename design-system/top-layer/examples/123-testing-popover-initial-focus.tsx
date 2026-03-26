import React, { useCallback, useRef, useState } from 'react';

import { Popup, type TTriggerFunctionRenderProps } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

/**
 * Test fixture for verifying role-based initial focus in Popover.
 *
 * WCAG 2.4.3 Focus Order: when a popover opens, focus should automatically
 * move to the appropriate element based on the popover's ARIA role.
 *
 * Contains:
 * - role="dialog" → auto-focuses first focusable element
 * - role="dialog" with autofocus → respects autofocus attribute
 * - role="menu" → auto-focuses first menu item
 * - role="listbox" → auto-focuses first option
 * - role="tooltip" → does NOT move focus
 */

function DialogPopup() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup placement={{}} onClose={() => setIsOpen(false)}>
			<Popup.Trigger>
				<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
					Open dialog
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Dialog initial focus test" isOpen={isOpen}>
				<PopupSurface>
					<button type="button" data-testid="dialog-first-button">
						First button
					</button>
					<button type="button" data-testid="dialog-second-button">
						Second button
					</button>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

function DialogWithAutofocusPopup() {
	const [isOpen, setIsOpen] = useState(false);
	// Set the native HTML autofocus attribute via a ref callback.
	// React 18's autoFocus JSX prop does not set the HTML attribute or
	// the DOM property — it only calls .focus() imperatively after mount,
	// which has no effect on a hidden popover. Setting the attribute lets
	// our useInitialFocus hook find and focus this element after the
	// popover is shown.
	const autofocusRef = useCallback((node: HTMLButtonElement | null) => {
		if (node) {
			node.setAttribute('autofocus', '');
		}
	}, []);

	return (
		<Popup placement={{}} onClose={() => setIsOpen(false)}>
			<Popup.Trigger>
				<button type="button" data-testid="autofocus-trigger" onClick={() => setIsOpen(true)}>
					Open dialog with autofocus
				</button>
			</Popup.Trigger>
			<Popup.Content
				role="dialog"
				label="Dialog autofocus test"
				isOpen={isOpen}
				testId="autofocus-popup"
			>
				<PopupSurface>
					<button type="button" data-testid="autofocus-first-button">
						First button (not autofocused)
					</button>
					<button type="button" data-testid="autofocus-target" ref={autofocusRef}>
						Autofocus target
					</button>
					<button type="button" data-testid="autofocus-third-button">
						Third button
					</button>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

function MenuPopup() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup placement={{}} onClose={() => setIsOpen(false)}>
			<Popup.Trigger>
				<button type="button" data-testid="menu-trigger" onClick={() => setIsOpen(true)}>
					Open menu
				</button>
			</Popup.Trigger>
			<Popup.Content role="menu" label="Menu initial focus test" isOpen={isOpen}>
				<PopupSurface>
					<div role="menuitem" tabIndex={0} data-testid="menu-first-item">
						First menu item
					</div>
					<div role="menuitem" tabIndex={0} data-testid="menu-second-item">
						Second menu item
					</div>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

function TooltipPopup() {
	const triggerRef = useRef<HTMLElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup placement={{}} onClose={() => setIsOpen(false)}>
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

export default function TestingPopoverInitialFocus() {
	return (
		<div>
			<input data-testid="external-input" placeholder="External focusable element" />
			<DialogPopup />
			<DialogWithAutofocusPopup />
			<MenuPopup />
			<TooltipPopup />
		</div>
	);
}
