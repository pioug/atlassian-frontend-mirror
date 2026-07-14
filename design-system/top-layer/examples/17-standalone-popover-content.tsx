import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * Standalone `Popover` + `useAnchorPosition` example.
 *
 * This pattern is used by `@atlaskit/tooltip` which has its own trigger
 * lifecycle (hover/focus/timers). Composes:
 *
 * 1. `useAnchorPosition` for CSS anchor positioning
 * 2. `Popover` for top-layer visibility and animation
 * 3. Conditional rendering to keep the DOM lean (element only exists when open)
 */
export default function StandalonePopoverContentExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<StandalonePopover forceFallbackPositioning={forceFallbackPositioning} />
			)}
		</ForceFallbackToggle>
	);
}

function StandalonePopover({ forceFallbackPositioning }: { forceFallbackPositioning: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

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
				<Text>
					This example composes <code>Popover</code> + <code>useAnchorPosition</code>, like{' '}
					<code>@atlaskit/tooltip</code> does internally.
				</Text>
				<Box>
					<Button
						ref={triggerRef}
						appearance="primary"
						onClick={() => setIsOpen((prev) => !prev)}
						aria-expanded={isOpen}
						aria-haspopup="dialog"
					>
						{isOpen ? 'Close' : 'Open'} standalone popover
					</Button>
					{isOpen && (
						<Popover
							ref={popoverRef}
							role="dialog"
							label="Standalone popover"
							onClose={handleClose}
							onOpenChange={({ isOpen: popoverIsOpen, element }) => {
								if (popoverIsOpen) {
									getFirstFocusable({ container: element })?.focus();
								}
							}}
							animate
							isOpen={true}
						>
							<PopoverSurface>
								<Stack space="space.100">
									<Heading size="xsmall">Standalone mode</Heading>
									<Text>
										This popover was created without the Popup compound component. The trigger
										lifecycle is fully controlled by the consumer.
									</Text>
									<Box>
										<Button appearance="subtle" onClick={handleClose}>
											Close
										</Button>
									</Box>
								</Stack>
							</PopoverSurface>
						</Popover>
					)}
				</Box>
			</Stack>
		</Box>
	);
}
