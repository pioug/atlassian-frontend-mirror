import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';
import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

/**
 * The close reason in `onOpenChange`, as a short word for the log.
 */
function getCloseReason({ event }: OnOpenChangeArgs): string {
	if (event instanceof KeyboardEvent) {
		return event.key === 'Escape' ? 'escape' : event.key.toLowerCase();
	}
	// An outside press passes a `MouseEvent` with no target. A click on the trigger or an item has
	// one.
	if (event instanceof MouseEvent) {
		return event.target ? 'click' : 'outside-press';
	}
	return 'other';
}

/**
 * The open state of a controlled menu. `isRefusing` makes it keep the menu open on a close
 * request.
 */
function useAskFirstState({
	name,
	isRefusing,
	onLog,
}: {
	name: string;
	isRefusing: boolean;
	onLog: (entry: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	function onOpenChange(args: OnOpenChangeArgs) {
		if (args.isOpen) {
			setIsOpen(true);
			return;
		}
		onLog(`${name}:${getCloseReason(args)}`);
		if (!isRefusing) {
			setIsOpen(false);
		}
	}
	return { isOpen, onOpenChange };
}

/**
 * Test fixture (smoke test): on the top layer, a controlled `DropdownMenu` asks `onOpenChange`
 * first, and closes only when `isOpen` becomes `false`. The switch makes the root menu refuse a
 * close. The log lists each close request as `<name>:<reason>`. The root menu holds a nested menu
 * (open it from the "More" item). `@atlaskit/top-layer` covers the behaviour in full
 * (`manual-ask-first-close.spec.tsx`).
 *
 * See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */
export default function TestingAskFirstClose(): React.JSX.Element {
	const [isRefusing, setIsRefusing] = useState(false);
	const [log, setLog] = useState<string[]>([]);

	function onLog(entry: string) {
		setLog((current) => [...current, entry]);
	}

	const root = useAskFirstState({ name: 'root', isRefusing, onLog });
	const nested = useAskFirstState({ name: 'nested', isRefusing: false, onLog });

	return (
		<Box padding="space.500">
			<Stack space="space.200">
				<Inline space="space.100">
					<Button
						testId="root-refuse"
						isSelected={isRefusing}
						onClick={() => setIsRefusing(!isRefusing)}
					>
						Refuse close: root
					</Button>
					<Button testId="outside">Outside</Button>
				</Inline>
				<DropdownMenu
					testId="root"
					shouldRenderToParent
					trigger="Root"
					isOpen={root.isOpen}
					onOpenChange={root.onOpenChange}
				>
					<DropdownItemGroup>
						<DropdownItem testId="root-item">Root item</DropdownItem>
						<DropdownMenu
							testId="nested"
							shouldRenderToParent
							placement="right-start"
							isOpen={nested.isOpen}
							onOpenChange={nested.onOpenChange}
							trigger={({ triggerRef, ...triggerProps }) => (
								<DropdownItem {...triggerProps} ref={triggerRef} testId="nested-trigger">
									More
								</DropdownItem>
							)}
						>
							<DropdownItemGroup>
								<DropdownItem testId="nested-item">Nested item</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</DropdownItemGroup>
				</DropdownMenu>
				<Text as="p" testId="close-log">
					{log.join(' ')}
				</Text>
			</Stack>
		</Box>
	);
}
