import React, { useCallback, useEffect, useRef, useState } from 'react';

import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for verifying the WAI-ARIA APG Combobox Pattern.
 *
 * When a `[role="combobox"]` controls a popup (via `aria-controls`), DOM
 * focus must remain on the textbox. Navigation through the popup items
 * is proxied via the combobox (typically using `aria-activedescendant`),
 * not via DOM focus movement.
 *
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * Contains:
 * - `role="menu"` popup controlled by a combobox → focus stays on the textbox
 * - `role="listbox"` popup controlled by a combobox → focus stays on the textbox
 * - `role="menu"` opened by a regular button trigger → focuses first menu item
 *   (sanity check that non-combobox triggers still get initial focus)
 * - `role="dialog"` / `role="alertdialog"` popups controlled by a combobox, a
 *   plain text input, or a checkbox outside the dialog, or opened by a plain
 *   button → focus stays on a text-like controller, otherwise moves into the
 *   dialog
 * - `role="dialog"` that contains its own focused combobox → focus moves into
 *   the dialog
 */
function ComboboxMenuPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: inputRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});

	const handleFocus = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<label htmlFor="combobox-menu-input">Combobox (menu popup)</label>
			<input
				id="combobox-menu-input"
				ref={inputRef}
				type="text"
				role="combobox"
				aria-controls={popoverId}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				aria-autocomplete="list"
				data-testid="combobox-menu-input"
				onFocus={handleFocus}
			/>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={handleClose}
				role="menu"
				label="Combobox menu popup"
			>
				<PopoverSurface>
					<div role="menuitem" tabIndex={-1} data-testid="combobox-menu-item-1">
						First menu item
					</div>
					<div role="menuitem" tabIndex={-1} data-testid="combobox-menu-item-2">
						Second menu item
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

function ComboboxListboxPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: inputRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});

	const handleFocus = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<label htmlFor="combobox-listbox-input">Combobox (listbox popup)</label>
			<input
				id="combobox-listbox-input"
				ref={inputRef}
				type="text"
				role="combobox"
				aria-controls={popoverId}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-autocomplete="list"
				data-testid="combobox-listbox-input"
				onFocus={handleFocus}
			/>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={handleClose}
				role="listbox"
				label="Combobox listbox popup"
			>
				<PopoverSurface>
					<div
						role="option"
						aria-selected="false"
						tabIndex={-1}
						data-testid="combobox-listbox-option-1"
					>
						Option one
					</div>
					<div
						role="option"
						aria-selected="true"
						tabIndex={-1}
						data-testid="combobox-listbox-option-2"
					>
						Option two (selected)
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

function PlainButtonMenuPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const handleClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={popoverId}
				data-testid="plain-menu-trigger"
				onClick={toggle}
			>
				Open plain menu
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={handleClose}
				role="menu"
				label="Plain menu popup"
			>
				<PopoverSurface>
					<div role="menuitem" tabIndex={0} data-testid="plain-menu-item-1">
						First menu item
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

type TDialogTrigger = 'combobox' | 'text-input' | 'checkbox' | 'button';

function DialogTrigger({
	trigger,
	testId,
	controlsId,
	isOpen,
	onOpen,
}: {
	trigger: TDialogTrigger;
	testId: string;
	controlsId: string | undefined;
	isOpen: boolean;
	onOpen: () => void;
}): React.ReactNode {
	if (trigger === 'button') {
		return (
			<button type="button" data-testid={`${testId}-trigger`} onClick={onOpen}>
				Open {testId}
			</button>
		);
	}
	if (trigger === 'checkbox') {
		return (
			<input
				type="checkbox"
				aria-label={testId}
				aria-controls={controlsId}
				data-testid={`${testId}-trigger`}
				onFocus={onOpen}
			/>
		);
	}
	return (
		<input
			type="text"
			role={trigger === 'combobox' ? 'combobox' : undefined}
			aria-label={testId}
			aria-controls={controlsId}
			aria-expanded={trigger === 'combobox' ? isOpen : undefined}
			aria-haspopup={trigger === 'combobox' ? 'dialog' : undefined}
			data-testid={`${testId}-trigger`}
			onFocus={onOpen}
		/>
	);
}

function DialogPopup({
	trigger,
	role,
	testId,
}: {
	trigger: TDialogTrigger;
	role: 'dialog' | 'alertdialog';
	testId: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});

	const handleOpen = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsOpen(false), []);

	return (
		<div ref={anchorRef}>
			<DialogTrigger
				trigger={trigger}
				testId={testId}
				// The popover is not in the DOM while closed, and axe rejects an
				// `aria-controls` that points at a missing element on a non-combobox.
				controlsId={isOpen ? popoverId : undefined}
				isOpen={isOpen}
				onOpen={handleOpen}
			/>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={handleClose}
				role={role}
				label={`${testId} popup`}
			>
				<PopoverSurface>
					<button type="button" data-testid={`${testId}-first-button`}>
						First button
					</button>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

// Focuses itself on mount, so it is the active element when the dialog's
// initial focus runs.
function InnerCombobox() {
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = usePopoverId();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<div>
			<input
				ref={inputRef}
				type="text"
				role="combobox"
				aria-label="Inner combobox"
				aria-controls={listboxId}
				aria-expanded
				data-testid="dialog-own-combobox-input"
			/>
			<div role="listbox" id={listboxId} aria-label="Inner options">
				<div role="option" aria-selected="false">
					Option one
				</div>
			</div>
		</div>
	);
}

function DialogWithOwnComboboxPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen,
	});

	const handleOpen = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="dialog-own-combobox-trigger"
				onClick={handleOpen}
			>
				Open dialog with its own combobox
			</button>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				onClose={handleClose}
				role="dialog"
				label="Dialog with its own combobox"
			>
				<PopoverSurface>
					<button type="button" data-testid="dialog-own-combobox-first-button">
						First button
					</button>
					<InnerCombobox />
				</PopoverSurface>
			</Popover>
		</div>
	);
}

export default function TestingComboboxPopupInitialFocus(): React.ReactNode {
	return (
		<div>
			<ComboboxMenuPopup />
			<ComboboxListboxPopup />
			<PlainButtonMenuPopup />
			<DialogPopup trigger="combobox" role="dialog" testId="combobox-dialog" />
			<DialogPopup trigger="combobox" role="alertdialog" testId="combobox-alertdialog" />
			<DialogPopup trigger="text-input" role="dialog" testId="text-input-dialog" />
			<DialogPopup trigger="checkbox" role="dialog" testId="checkbox-dialog" />
			<DialogPopup trigger="button" role="dialog" testId="button-dialog" />
			<DialogWithOwnComboboxPopup />
		</div>
	);
}
