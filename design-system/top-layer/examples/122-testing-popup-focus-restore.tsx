import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

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
 */
export default function TestingPopupFocusRestore(): React.ReactNode {
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
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
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
				label="Dialog popup"
				testId="dialog-popup"
			>
				<div>
					<button type="button" data-testid="dialog-inner-button">
						Button inside dialog
					</button>
				</div>
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
		placement: { edge: 'end' },
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
				label="Menu popup"
				testId="menu-popup"
			>
				<div>
					<button type="button" role="menuitem" data-testid="menu-item">
						Menu item
					</button>
				</div>
			</Popover>
		</>
	);
}

function ListboxPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'listbox', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="listbox-trigger"
			>
				Open listbox
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="listbox"
				label="Listbox popup"
				testId="listbox-popup"
			>
				<div role="option" aria-selected="false" data-testid="listbox-option">
					Option 1
				</div>
			</Popover>
		</>
	);
}

// Tooltip stays hand-wired: hover/focus driven, no aria-haspopup, uses
// aria-describedby. The hook is intentionally click-only.
function TooltipPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
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
