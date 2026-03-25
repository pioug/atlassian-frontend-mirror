import React, { useCallback } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup, type TPopupRole } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

const roleDemos: Array<{
	role: TPopupRole;
	label?: string;
	description: string;
	content: React.ReactNode;
}> = [
	{
		role: 'dialog',
		label: 'Settings dialog',
		description: 'Requires an accessible name (label or labelledBy).',
		content: <Text>This popup has role=&quot;dialog&quot; and requires a label.</Text>,
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
		role: 'tooltip',
		label: 'Helpful tooltip',
		description: 'Does not require a label — the content IS the accessible name.',
		content: <Text>Tooltip content is the name itself.</Text>,
	},
	{
		role: 'listbox',
		label: 'Select an option',
		description: 'For select-like components. Name provided by the associated combobox.',
		content: (
			<Stack space="space.050">
				<div role="option" aria-selected={false}>Option A</div>
				<div role="option" aria-selected={false}>Option B</div>
				<div role="option" aria-selected={false}>Option C</div>
			</Stack>
		),
	},
];

/**
 * Popup with different ARIA roles.
 *
 * Demonstrates the typed role system on `Popup.Content`:
 * - `'dialog'`, `'alertdialog'`, `'menu'` — require `label` or `labelledBy`
 * - `'tooltip'`, `'listbox'`, `'tree'`, etc. — label is optional
 */
export default function PopoverRolesExample() {
	const handleClose = useCallback(() => {}, []);

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.300">
						<Stack space="space.100">
							<Heading size="small">Popup roles</Heading>
							<Text>
								Each popup below uses a different role prop. Roles that are ARIA
								landmarks require an accessible name.
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
									handleClose={handleClose}
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

function handleOpenChange({ isOpen, element }: { isOpen: boolean; element: HTMLDivElement }) {
	if (isOpen) {
		getFirstFocusable({ container: element })?.focus();
	}
}

function RoleDemo({
	role,
	label,
	description,
	content,
	handleClose,
	forceFallbackPositioning,
}: {
	role: TPopupRole;
	label?: string;
	description: string;
	content: React.ReactNode;
	handleClose: () => void;
	forceFallbackPositioning: boolean;
}) {
	return (
		<Stack key={role} space="space.100">
			<Inline space="space.100" alignBlock="center">
				<Lozenge appearance="new">{role}</Lozenge>
				<Text size="small">{description}</Text>
			</Inline>
			<Box>
				<Popup
					placement={{ edge: 'end' }}
					onClose={handleClose}
					onOpenChange={handleOpenChange}
					forceFallbackPositioning={forceFallbackPositioning}
				>
					<Popup.Trigger>
						<Button>Open {role} popup</Button>
					</Popup.Trigger>
					{/* @ts-expect-error -- demo iterates over multiple role variants */}
					<Popup.Content role={role} label={label}>
						<PopupSurface>{content}</PopupSurface>
					</Popup.Content>
				</Popup>
			</Box>
		</Stack>
	);
}
