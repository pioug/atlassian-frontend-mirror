import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { fade, scaleAndFade, slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

const presets = [
	{ label: 'slideAndFade (4px)', preset: slideAndFade() },
	{ label: 'slideAndFade (8px)', preset: slideAndFade({ distance: 8 }) },
	{ label: 'fade', preset: fade() },
	{ label: 'scaleAndFade', preset: scaleAndFade() },
] as const;

/**
 * Animated popover demonstrating all three animation presets.
 *
 * Each preset uses CSS `@starting-style` + `allow-discrete` for
 * progressive-enhancement entry/exit animations.
 *
 * - **slideAndFade**: Directional slide + opacity. Slide direction adapts
 *   to the popover's placement edge.
 * - **fade**: Simple opacity transition (no transform).
 * - **scaleAndFade**: Scale from 0.95 + opacity.
 */
export default function AnimatedPopoverExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.300">
						<Heading size="small">Animation presets</Heading>
						<Inline space="space.200" alignBlock="center">
							{presets.map(({ label, preset }) => (
								<AnimatedPopoverDemo
									key={label}
									label={label}
									preset={preset}
									forceFallbackPositioning={forceFallbackPositioning}
								/>
							))}
						</Inline>
					</Stack>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}

function AnimatedPopoverDemo({
	label,
	preset,
	forceFallbackPositioning,
}: {
	label: string;
	preset: ReturnType<typeof slideAndFade>;
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
		<>
			<Button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				<Lozenge appearance="new">{label}</Lozenge>
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label={`${label} popover`}
				isOpen={isOpen}
				onClose={close}
				animate={preset}
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
