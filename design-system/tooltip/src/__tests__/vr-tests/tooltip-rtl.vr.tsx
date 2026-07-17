import { type Hooks, type SnapshotTestOptions, snapshot } from '@af/visual-regression';

import VrPositionRtlExample from '../../../examples/vr-position-rtl';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

/**
 * In RTL, `position="right"` (inline-end) should resolve to the
 * physical-left of the trigger — i.e. the tooltip flips relative to LTR.
 */
snapshot(VrPositionRtlExample, {
	description: 'tooltip position=right in RTL (renders on physical-left)',
	states: [
		{
			selector: {
				byTestId: 'trigger-rtl-position-right',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer-tooltip': true,
	},
});

/**
 * In RTL, `position="mouse"` + `mousePosition="right"` should land the
 * tooltip on the physical-left of the cursor. Exercises both the synthetic
 * anchor (`useAnchorPositionAtPoint`, writes physical `top`/`left` from
 * `clientX`/`Y`) and the popover library's RTL-aware placement on top.
 */
snapshot(VrPositionRtlExample, {
	description: 'tooltip position=mouse mousePosition=right in RTL (renders on physical-left)',
	states: [
		{
			selector: {
				byTestId: 'trigger-rtl-mouse-right',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer-tooltip': true,
	},
});
