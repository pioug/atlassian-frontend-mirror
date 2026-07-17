import { type Hooks, type SnapshotTestOptions, snapshot } from '@af/visual-regression';

import TooltipPosition from '../../../examples/position';
import TooltipPositionMouseExample from '../../../examples/position-mouse';
import VrPositionMouseAllExample from '../../../examples/vr-position-mouse-all';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(TooltipPosition, {
	description: 'tooltip with dynamic mouse position',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

snapshot(TooltipPositionMouseExample, {
	description: 'tooltip with dynamic mouse X position but target Y position',
	states: [
		{
			selector: {
				byTestId: 'trigger-mouse-x',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

snapshot(TooltipPositionMouseExample, {
	description: 'tooltip with dynamic mouse Y position but target X position',
	states: [
		{
			selector: {
				byTestId: 'trigger-mouse-y',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

snapshot(TooltipPosition, {
	description: 'tooltip with dynamic mouse position (focused)',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'focused',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

snapshot(TooltipPositionMouseExample, {
	description: 'tooltip with dynamic mouse X position but target Y position (focused)',
	states: [
		{
			selector: {
				byTestId: 'trigger-mouse-x',
			},
			state: 'focused',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

snapshot(TooltipPositionMouseExample, {
	description: 'tooltip with dynamic mouse Y position but target X position (focused)',
	states: [
		{
			selector: {
				byTestId: 'trigger-mouse-y',
			},
			state: 'focused',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer-tooltip': [true, false],
	},
});

/**
 * VR tests for `position="mouse"` with every `mousePosition` permutation.
 * These validate positioning logic in the `computeMouseTooltipPosition` function.
 */
snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=right-start',
	states: [{ selector: { byTestId: 'trigger-mouse-right-start' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=right',
	states: [{ selector: { byTestId: 'trigger-mouse-right' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=right-end',
	states: [{ selector: { byTestId: 'trigger-mouse-right-end' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=left-start',
	states: [{ selector: { byTestId: 'trigger-mouse-left-start' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=left',
	states: [{ selector: { byTestId: 'trigger-mouse-left' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=left-end',
	states: [{ selector: { byTestId: 'trigger-mouse-left-end' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=top-start',
	states: [{ selector: { byTestId: 'trigger-mouse-top-start' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=top',
	states: [{ selector: { byTestId: 'trigger-mouse-top' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=top-end',
	states: [{ selector: { byTestId: 'trigger-mouse-top-end' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=bottom-start',
	states: [{ selector: { byTestId: 'trigger-mouse-bottom-start' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=bottom',
	states: [{ selector: { byTestId: 'trigger-mouse-bottom' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});

snapshot(VrPositionMouseAllExample, {
	description: 'tooltip position=mouse mousePosition=bottom-end',
	states: [{ selector: { byTestId: 'trigger-mouse-bottom-end' }, state: 'hovered' }],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: { 'platform-dst-top-layer-tooltip': [true, false] },
});
