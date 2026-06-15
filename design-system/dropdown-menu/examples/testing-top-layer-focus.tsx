import React, { useRef } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Box, Stack } from '@atlaskit/primitives/compiled';

/**
 * Test fixture for the `DropdownMenu` top-layer focus contract.
 *
 * Three dropdowns are rendered so the spec can exercise the prop-driven
 * focus variations that `top-layer/useInitialFocus` covers for the
 * `role="menu"` shape:
 *
 * - `dropdown` (default): `autoFocus` is left at its default (`false`).
 *   The dropdown only focuses the first menu item when the trigger is
 *   activated via the keyboard.
 *
 * - `dropdown-autofocus`: `autoFocus={true}`. The dropdown always focuses
 *   the first menu item on open, regardless of how the trigger was
 *   activated.
 *
 * - `dropdown-return-focus-ref`: `returnFocusRef` points at a sibling
 *   button rendered outside the dropdown. After the menu closes, focus
 *   must move to that sibling instead of returning to the trigger.
 *
 * - `dropdown-default-open`: `defaultOpen` mounts the menu in the open
 *   state. Per its docstring this auto-shifts focus to the first menu
 *   item, exercising the mount-time open path of `useInitialFocus`.
 *
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	const returnFocusTargetRef = useRef<HTMLButtonElement>(null);
	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<DropdownMenu trigger="Open menu" testId="dropdown">
					<DropdownItemGroup>
						<DropdownItem testId="dropdown-item-1">Move</DropdownItem>
						<DropdownItem testId="dropdown-item-2">Clone</DropdownItem>
						<DropdownItem testId="dropdown-item-3">Delete</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>

				<DropdownMenu trigger="Open menu (autoFocus)" testId="dropdown-autofocus" autoFocus>
					<DropdownItemGroup>
						<DropdownItem testId="dropdown-autofocus-item-1">Move</DropdownItem>
						<DropdownItem testId="dropdown-autofocus-item-2">Clone</DropdownItem>
						<DropdownItem testId="dropdown-autofocus-item-3">Delete</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>

				<DropdownMenu
					trigger="Open menu (returnFocusRef)"
					testId="dropdown-return-focus-ref"
					returnFocusRef={returnFocusTargetRef}
				>
					<DropdownItemGroup>
						<DropdownItem testId="dropdown-return-focus-ref-item-1">Move</DropdownItem>
						<DropdownItem testId="dropdown-return-focus-ref-item-2">Clone</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>

				<Button testId="dropdown-return-focus-ref-target" ref={returnFocusTargetRef}>
					Return focus target
				</Button>

				<DropdownMenu trigger="Open menu (defaultOpen)" testId="dropdown-default-open" defaultOpen>
					<DropdownItemGroup>
						<DropdownItem testId="dropdown-default-open-item-1">Move</DropdownItem>
						<DropdownItem testId="dropdown-default-open-item-2">Clone</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Stack>
		</Box>
	);
}
