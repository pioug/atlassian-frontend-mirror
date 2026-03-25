import React, { useCallback } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { fade, scaleAndFade, slideAndFade } from '@atlaskit/top-layer/animations';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

const presets = [
	{ label: 'slideAndFade (4px)', preset: slideAndFade() },
	{ label: 'slideAndFade (8px)', preset: slideAndFade({ distance: 8 }) },
	{ label: 'fade', preset: fade() },
	{ label: 'scaleAndFade', preset: scaleAndFade() },
] as const;

/**
 * Animated popup demonstrating all three animation presets.
 *
 * Each preset uses CSS `@starting-style` + `allow-discrete` for
 * progressive-enhancement entry/exit animations.
 *
 * - **slideAndFade**: Directional slide + opacity. Slide direction adapts
 *   to the popup's placement edge.
 * - **fade**: Simple opacity transition (no transform).
 * - **scaleAndFade**: Scale from 0.95 + opacity.
 */
export default function AnimatedPopoverExample() {
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
}) {
	const handleClose = useCallback(() => {}, []);

	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose} forceFallbackPositioning={forceFallbackPositioning}>
			<Popup.Trigger>
				<Button>
					<Lozenge appearance="new">{label}</Lozenge>
				</Button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label={`${label} popup`} animate={preset}>
				<PopupSurface>
					<Stack space="space.100">
						<Heading size="xsmall">{label}</Heading>
						<Text>This popup uses the {label} animation preset.</Text>
					</Stack>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}
