import React, { useCallback, useRef, useState } from 'react';

import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
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
 */
function ComboboxMenuPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: inputRef,
		popoverRef,
		placement: {},
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

	useAnchorPosition({
		anchorRef: inputRef,
		popoverRef,
		placement: {},
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

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: {},
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

export default function TestingComboboxPopupInitialFocus(): React.ReactNode {
	return (
		<div>
			<ComboboxMenuPopup />
			<ComboboxListboxPopup />
			<PlainButtonMenuPopup />
		</div>
	);
}
