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
 * No custom focus restoration hooks are needed. The browser tracks
 * `previouslyFocusedElement` when the popover opens and restores it
 * synchronously during the hide algorithm.
 */
export default function TestingNativeFocusRestoration(): React.ReactNode {
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
	});

	return (
		<>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="auto-dialog-trigger">
				Open auto dialog
			</button>
			<Popover
				ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close}
				role="dialog"
				label="Auto dialog popup"
				testId="auto-dialog-popup"
			>
				<div>
					<button type="button" data-testid="auto-dialog-inner-button">
						Button inside dialog
					</button>
				</div>
			</Popover>
		</>
	);
}

function PopoverAutoMenu() {
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
	});

	return (
		<>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'menu', isOpen, popoverId: popoverId })} type="button" data-testid="auto-menu-trigger">
				Open auto menu
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="menu" label="Auto menu popup" testId="auto-menu-popup">
				<div>
					<button type="button" role="menuitem" data-testid="auto-menu-item">
						Menu item
					</button>
				</div>
			</Popover>
		</>
	);
}

function ProgrammaticClose() {
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
	});

	const handleProgrammaticClose = useCallback(() => {
		popoverRef.current?.hidePopover();
	}, []);

	return (
		<>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="programmatic-trigger">
				Open programmatic popup
			</button>
			<Popover
				ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close}
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
			</Popover>
		</>
	);
}
