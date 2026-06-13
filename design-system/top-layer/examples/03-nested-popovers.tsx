import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * Nested popovers using the native Popover API.
 *
 * When a child popover is inside a parent popover in the DOM,
 * the browser recognizes them as nested:
 * - Pressing Escape closes only the topmost (innermost) popover
 * - Light dismiss (clicking outside) closes the entire stack
 */
function NestedPopover({
	forceFallbackPositioning,
}: {
	forceFallbackPositioning: boolean;
}): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
		forceFallbackPositioning,
		isOpen,
	});

	return (
		<>
			<Button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open nested popover
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Nested popover"
				isOpen={isOpen}
				onClose={close}
				onOpenChange={({ isOpen: nextOpen, element }) => {
					if (nextOpen) {
						getFirstFocusable({ container: element })?.focus();
					}
				}}
			>
				<PopoverSurface>
					<Stack space="space.100">
						<Heading size="xsmall">Nested popover</Heading>
						<Text>Escape closes this one only. Clicking outside closes both.</Text>
					</Stack>
				</PopoverSurface>
			</Popover>
		</>
	);
}

function OuterPopover({
	forceFallbackPositioning,
}: {
	forceFallbackPositioning: boolean;
}): React.ReactNode {
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
		forceFallbackPositioning,
		isOpen,
	});

	return (
		<Box padding="space.400">
			<Button
				ref={triggerRef}
				appearance="primary"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open first popover
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="First popover"
				isOpen={isOpen}
				onClose={close}
				onOpenChange={({ isOpen: nextOpen, element }) => {
					if (nextOpen) {
						getFirstFocusable({ container: element })?.focus();
					}
				}}
			>
				<PopoverSurface>
					<Stack space="space.150">
						<Heading size="xsmall">First popover</Heading>
						<Text>This is the outer popover. Open the nested one:</Text>
						<NestedPopover forceFallbackPositioning={forceFallbackPositioning} />
					</Stack>
				</PopoverSurface>
			</Popover>
		</Box>
	);
}

export default function NestedPopoversExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<OuterPopover forceFallbackPositioning={forceFallbackPositioning} />
			)}
		</ForceFallbackToggle>
	);
}
