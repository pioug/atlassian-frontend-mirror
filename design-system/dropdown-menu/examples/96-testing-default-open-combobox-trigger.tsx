import React, { useState } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import TextField from '@atlaskit/textfield';

/**
 * Test fixture: `DropdownMenu` with `defaultOpen` and a function trigger
 * that renders a `role="combobox"` `<TextField autoFocus>`.
 *
 * Mirrors the shape used in `AddWorkItemEdit.tsx` (capacity planning), where
 * the dropdown opens immediately on mount and the trigger is a search input
 * that must keep keyboard focus so the user can type to filter.
 *
 * Without the combobox-pattern carve-out in `useInitialFocus`, the top-layer
 * `Popover` would steal focus from the textbox and place it on the first
 * `DropdownItem`, breaking the search interaction.
 */
export default function TestingDefaultOpenComboboxTrigger(): React.ReactNode {
	// `defaultOpen` is uncontrolled internally; we still mirror the open
	// state so the test can assert "the menu is open" without relying on
	// internal DOM state.
	const [isOpen, setIsOpen] = useState(true);

	return (
		<>
			<DropdownMenu
				testId="combobox-default-open"
				defaultOpen
				shouldRenderToParent
				onOpenChange={({ isOpen: nextIsOpen }) => setIsOpen(nextIsOpen)}
				trigger={({ triggerRef, ...triggerProps }) => (
					<TextField
						{...triggerProps}
						ref={triggerRef as React.Ref<HTMLInputElement>}
						role="combobox"
						aria-autocomplete="list"
						aria-label="Search work items"
						autoFocus
						testId="combobox-default-open-input"
					/>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem testId="combobox-default-open-item-1">
						Create non-project work
					</DropdownItem>
					<DropdownItem testId="combobox-default-open-item-2">
						Create paid time off
					</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
			<div data-testid="combobox-default-open-state">{isOpen ? 'open' : 'closed'}</div>
		</>
	);
}
