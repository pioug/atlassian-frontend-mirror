import React, { useCallback, useRef, useState } from 'react';

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
 * - no role → does NOT move focus (catch-out branch)
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
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="dialog-trigger"
			>
				Open dialog
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Dialog initial focus test"
			>
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
		isOpen,
	});

	// Set the native HTML autofocus attribute via a ref callback.
	// React 18's autoFocus JSX prop does not set the HTML attribute or
	// the DOM property - it only calls .focus() imperatively after mount,
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
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="autofocus-trigger"
			>
				Open dialog with autofocus
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
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
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'menu', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="menu-trigger"
			>
				Open menu
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="menu"
				label="Menu initial focus test"
			>
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

// Popover opened WITHOUT a `role` prop. Verifies the top-layer
// catch-out for "no role" (and unrecognised roles): initial focus
// should NOT be moved away from the trigger. Higher-level consumers
// that always pass a role (e.g. by defaulting a missing `role` to
// `dialog`) will not exercise this branch.
function NoRolePopup() {
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
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				type="button"
				data-testid="no-role-trigger"
				aria-expanded={isOpen}
				// `aria-controls` is gated on `isOpen` because the Popover host element
				// unmounts when closed. A dangling reference to a missing ID is flagged
				// by axe (`aria-valid-attr-value`). See `getAriaForTrigger` for the
				// canonical pattern this case mirrors.
				aria-controls={isOpen ? popoverId : undefined}
			>
				Open no-role popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				label="No-role popover initial focus test"
				testId="no-role-popup"
			>
				<PopoverSurface>
					<button type="button" data-testid="no-role-first-button">
						First button (should NOT be focused)
					</button>
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
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				data-testid="tooltip-trigger"
				// `aria-describedby` is gated on `isOpen` because the tooltip Popover
				// host element unmounts when closed. A dangling reference to a missing
				// ID is flagged by axe (`aria-valid-attr-value`).
				aria-describedby={isOpen ? popoverId : undefined}
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
			<NoRolePopup />
		</div>
	);
}
