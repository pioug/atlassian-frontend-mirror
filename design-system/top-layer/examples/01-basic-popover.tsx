import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * Basic popover using the native Popover API.
 *
 * Demonstrates three key behaviors:
 * - **Light dismiss**: Click outside or press Escape to close (inherent to `popover="auto"`)
 * - **onClose tracking**: The `onClose` callback fires on every dismiss
 * - **Programmatic close**: Call `hidePopover()` on the underlying element via a ref
 */
type TBasicPopoverProps = {
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention -- Mirrors the `forceFallbackPositioning` option name from `useAnchorPosition`.
	forceFallbackPositioning: boolean;
};

function BasicPopover({ forceFallbackPositioning }: TBasicPopoverProps): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closeCount, setCloseCount] = useState(0);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	const handleClose = useCallback(() => {
		setCloseCount((c) => c + 1);
		close();
	}, [close]);

	function handleProgrammaticClose() {
		popoverRef.current?.hidePopover();
	}

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		forceFallbackPositioning,
		isOpen,
	});

	return (
		<Box padding="space.400">
			<Stack space="space.200">
				<Inline space="space.100" alignBlock="center">
					<Text>Close count:</Text>
					<Lozenge appearance={closeCount > 0 ? 'moved' : 'default'}>{closeCount}</Lozenge>
				</Inline>
				<Box>
					<Button
						ref={triggerRef}
						appearance="primary"
						onClick={toggle}
						{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
					>
						Open popover
					</Button>
					<Popover
						ref={popoverRef}
						id={popoverId}
						role="dialog"
						label="Basic popover"
						isOpen={isOpen}
						onClose={handleClose}
						onOpenChange={({ isOpen: nextOpen, element }) => {
							if (nextOpen) {
								getFirstFocusable({ container: element })?.focus();
							}
						}}
					>
						<PopoverSurface>
							<Stack space="space.150">
								<Heading size="xsmall">Popover</Heading>
								<Text>Click outside or press Escape to dismiss.</Text>
								<Box>
									<Button appearance="subtle" onClick={handleProgrammaticClose}>
										Close programmatically
									</Button>
								</Box>
							</Stack>
						</PopoverSurface>
					</Popover>
				</Box>
			</Stack>
		</Box>
	);
}

export default function BasicPopoverExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<BasicPopover forceFallbackPositioning={forceFallbackPositioning} />
			)}
		</ForceFallbackToggle>
	);
}
