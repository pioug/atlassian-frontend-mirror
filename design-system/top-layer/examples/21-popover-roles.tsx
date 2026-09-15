import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Heading from '@atlaskit/heading/heading';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

// Roles supported by `getAriaForTrigger`. Tooltip-family roles are intentionally
// excluded because their trigger wiring uses `aria-describedby`, not `aria-haspopup`.
type TPopoverRole = 'dialog' | 'menu' | 'listbox';

const roleDemos: Array<{
	role: TPopoverRole;
	label?: string;
	description: string;
	content: React.ReactNode;
}> = [
	{
		role: 'dialog',
		label: 'Settings dialog',
		description: 'Requires an accessible name (label or labelledBy).',
		content: <Text>This popover has role="dialog" and requires a label.</Text>,
	},
	{
		role: 'menu',
		label: 'Actions menu',
		description: 'Menu items should use role="menuitem" and arrow key navigation.',
		content: (
			<Stack space="space.050">
				<button type="button" role="menuitem">
					Cut
				</button>
				<button type="button" role="menuitem">
					Copy
				</button>
				<button type="button" role="menuitem">
					Paste
				</button>
			</Stack>
		),
	},
	{
		role: 'listbox',
		label: 'Select an option',
		description: 'For select-like components. Name provided by the associated combobox.',
		content: (
			<Stack space="space.050">
				<div role="option" aria-selected={false}>
					Option A
				</div>
				<div role="option" aria-selected={false}>
					Option B
				</div>
				<div role="option" aria-selected={false}>
					Option C
				</div>
			</Stack>
		),
	},
];

/**
 * Popover with different ARIA roles.
 *
 * Demonstrates the typed role system on `Popover`:
 * - `'dialog'`, `'menu'` - use with `getAriaForTrigger` for trigger ARIA
 * - `'listbox'` - label provided by the associated combobox, not by the trigger
 */
export default function PopoverRolesExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.300">
						<Stack space="space.100">
							<Heading size="small">Popover roles</Heading>
							<Text>
								Each popover below uses a different role prop. Roles that are ARIA landmarks require
								an accessible name.
							</Text>
						</Stack>
						<Stack space="space.300">
							{roleDemos.map(({ role, label, description, content }) => (
								<RoleDemo
									key={role}
									role={role}
									label={label}
									description={description}
									content={content}
									forceFallbackPositioning={forceFallbackPositioning}
								/>
							))}
						</Stack>
					</Stack>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}

function RoleDemo({
	role,
	label,
	description,
	content,
	forceFallbackPositioning,
}: {
	role: TPopoverRole;
	label?: string;
	description: string;
	content: React.ReactNode;
	forceFallbackPositioning: boolean;
}): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		forceFallbackPositioning,
		isOpen,
	});

	return (
		<Stack space="space.100">
			<Inline space="space.100" alignBlock="center">
				<Lozenge appearance="discovery">{role}</Lozenge>
				<Text size="small">{description}</Text>
			</Inline>
			<Box>
				<Button
					ref={triggerRef}
					onClick={toggle}
					{...getAriaForTrigger({ role, isOpen, popoverId: popoverId })}
				>
					Open {role} popover
				</Button>
				<Popover
					ref={popoverRef}
					id={popoverId}
					role={role}
					label={label}
					isOpen={isOpen}
					onClose={close}
				>
					<PopoverSurface>{content}</PopoverSurface>
				</Popover>
			</Box>
		</Stack>
	);
}
