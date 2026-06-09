import React, { useCallback, useRef, useState } from "react";

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

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
 * - role="tooltip" → does NOT move focus
 */
function DialogPopup() {
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
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="dialog-trigger">
				Open dialog
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label="Dialog initial focus test">
				<PopoverSurface>
					<button type="button" data-testid="dialog-first-button">
						First button
					</button>
					<button type="button" data-testid="dialog-second-button">
						Second button
					</button>
				</PopoverSurface>
			</Popover>
		</>
	);
}

function DialogWithAutofocusPopup() {
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
		<>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="autofocus-trigger">
				Open dialog with autofocus
			</button>
			<Popover
				ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close}
				role="dialog"
				label="Dialog autofocus test"
				testId="autofocus-popup"
			>
				<PopoverSurface>
					<button type="button" data-testid="autofocus-first-button">
						First button (not autofocused)
					</button>
					<button type="button" data-testid="autofocus-target" ref={autofocusRef}>
						Autofocus target
					</button>
					<button type="button" data-testid="autofocus-third-button">
						Third button
					</button>
				</PopoverSurface>
			</Popover>
		</>
	);
}

function MenuPopup() {
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
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'menu', isOpen, popoverId: popoverId })} type="button" data-testid="menu-trigger">
				Open menu
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="menu" label="Menu initial focus test">
				<PopoverSurface>
					<div role="menuitem" tabIndex={0} data-testid="menu-first-item">
						First menu item
					</div>
					<div role="menuitem" tabIndex={0} data-testid="menu-second-item">
						Second menu item
					</div>
				</PopoverSurface>
			</Popover>
		</>
	);
}

// Tooltip stays hand-wired (no aria-haspopup, hover/focus driven).
function TooltipPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

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
				data-testid="tooltip-trigger"
				aria-describedby={popoverId}
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setIsOpen(false)}
			>
				Hover for tooltip
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="tooltip"
				label="Tooltip popup"
				mode="manual"
				testId="tooltip-popup"
				isOpen={isOpen}
			>
				<div>Tooltip content</div>
			</Popover>
		</>
	);
}

export default function TestingPopoverInitialFocus(): React.ReactNode {
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
