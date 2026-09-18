import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Heading from '@atlaskit/heading/heading';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

export default function AnimatedPopoverExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.300">
						<Heading size="small">Animation presets</Heading>
						<Inline space="space.200" alignBlock="center">
							<AnimatedPopoverDemo
								label="system popup motion"
								forceFallbackPositioning={forceFallbackPositioning}
							/>
						</Inline>
					</Stack>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}

const placement = { edge: 'end' } as const;

function AnimatedPopoverDemo({
	label,
	forceFallbackPositioning,
}: {
	label: string;
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
		placement,
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
				<Lozenge appearance="discovery">{label}</Lozenge>
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label={`${label} popover`}
				isOpen={isOpen}
				onClose={close}
				shouldAnimate
				placement={placement}
			>
				<PopoverSurface>
					<Stack space="space.100">
						<Heading size="xsmall">{label}</Heading>
						<Text>This popover uses the {label} animation preset.</Text>
					</Stack>
				</PopoverSurface>
			</Popover>
		</>
	);
}
