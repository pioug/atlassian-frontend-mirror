import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
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

	useAnchorPosition({
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
				animate
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
