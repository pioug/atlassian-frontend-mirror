import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';

// The item becomes disabled in the close commit.
function DisabledCase() {
	const [isDone, setIsDone] = useState(false);
	return (
		<DropdownMenu trigger="Disabled" testId="disabled" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem testId="disabled-item" isDisabled={isDone} onClick={() => setIsDone(true)}>
					Do it once
				</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// The item is removed in the close commit.
function RemovedCase() {
	const [isRemoved, setIsRemoved] = useState(false);
	return (
		<DropdownMenu trigger="Removed" testId="removed" shouldRenderToParent>
			<DropdownItemGroup>
				{!isRemoved && (
					<DropdownItem testId="removed-item" onClick={() => setIsRemoved(true)}>
						Remove me
					</DropdownItem>
				)}
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// The item swaps to another item with a new key: "Pin" becomes "Unpin".
function SwappedCase() {
	const [isPinned, setIsPinned] = useState(false);
	return (
		<DropdownMenu trigger="Swapped" testId="swapped" shouldRenderToParent>
			<DropdownItemGroup>
				{isPinned ? (
					<DropdownItem key="unpin" testId="swapped-item" onClick={() => setIsPinned(false)}>
						Unpin
					</DropdownItem>
				) : (
					<DropdownItem key="pin" testId="swapped-item" onClick={() => setIsPinned(true)}>
						Pin
					</DropdownItem>
				)}
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// The menu content renders again with a new key.
function RekeyedCase() {
	const [version, setVersion] = useState(0);
	return (
		<DropdownMenu trigger="Re-keyed" testId="rekeyed" shouldRenderToParent>
			<DropdownItemGroup key={version}>
				<DropdownItem testId="rekeyed-item" onClick={() => setVersion((current) => current + 1)}>
					Refresh ({version})
				</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// The item moves focus to another element.
function MovesFocusCase() {
	const targetRef = useRef<HTMLButtonElement>(null);
	return (
		<Stack space="space.100">
			<DropdownMenu trigger="Moves focus" testId="moves-focus" shouldRenderToParent>
				<DropdownItemGroup>
					<DropdownItem testId="moves-focus-item" onClick={() => targetRef.current?.focus()}>
						Focus the target
					</DropdownItem>
					<DropdownItem>Other</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
			<Button ref={targetRef} testId="moves-focus-target">
				Target
			</Button>
		</Stack>
	);
}

// A controlled menu whose consumer keeps it open after an item is chosen.
function StaysOpenCase() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<DropdownMenu
			trigger="Stays open"
			testId="stays-open"
			shouldRenderToParent
			isOpen={isOpen}
			onOpenChange={({ isOpen: nextIsOpen, event }) => {
				// Refuse the close that an item activation asks for.
				if (!nextIsOpen && event?.type === 'click') {
					return;
				}
				setIsOpen(nextIsOpen);
			}}
		>
			<DropdownItemGroup>
				<DropdownItem testId="stays-open-item">Keep open</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// An item in a nested menu.
function NestedCase() {
	return (
		<DropdownMenu trigger="Nested" testId="nested" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownMenu
					testId="nested-submenu"
					shouldRenderToParent
					placement="right-start"
					trigger={({ triggerRef, ...triggerProps }) => (
						<DropdownItem {...triggerProps} ref={triggerRef} testId="nested-submenu-trigger">
							More
						</DropdownItem>
					)}
				>
					<DropdownItemGroup>
						<DropdownItem testId="nested-item">Nested item</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

// An item that changes nothing.
function PlainCase() {
	return (
		<DropdownMenu trigger="Plain" testId="plain" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem testId="plain-item">Plain item</DropdownItem>
				<DropdownItem>Other</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

/**
 * Test fixture: where focus goes when an item is chosen in a `DropdownMenu`: when the item changes
 * in the same commit, when it moves focus, when a controlled menu stays open, and in a nested menu.
 *
 * See `__tests__/playwright/ff-testing/platform-dst-top-layer/item-focus-return.spec.tsx`.
 */
export default function TestingItemFocusReturn(): React.JSX.Element {
	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<DisabledCase />
				<RemovedCase />
				<SwappedCase />
				<RekeyedCase />
				<MovesFocusCase />
				<StaysOpenCase />
				<NestedCase />
				<PlainCase />
			</Stack>
		</Box>
	);
}
