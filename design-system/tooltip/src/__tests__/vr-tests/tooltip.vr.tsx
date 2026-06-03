import { type Hooks, type SnapshotTestOptions, snapshot } from '@af/visual-regression';

import TooltipCustom from '../../../examples/component-prop';
import TooltipBasic from '../../../examples/default-tooltip';
import KeyboardShortcutsExample from '../../../examples/keyboard-shortcut';
import KeyboardShortcutGlobalStylesExample from '../../../examples/keyboard-shortcut-global-styles';
import TooltipTruncateExample from '../../../examples/truncate';
import VrPositionAllExample from '../../../examples/vr-position-all';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(TooltipBasic, {
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(TooltipCustom, {
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

// While we intend on removing the `truncate` prop in the future, we still need a VR test for it to prevent regressions.
snapshot(TooltipTruncateExample, {
	description: 'tooltip with truncate',
	states: [
		{
			selector: {
				byRole: 'button',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(KeyboardShortcutsExample, {
	description: 'tooltip with keyboard shortcut - short, single key',
	states: [
		{
			selector: {
				byRole: 'button',
				options: {
					name: 'Short with single key',
				},
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(KeyboardShortcutsExample, {
	description: 'tooltip with keyboard shortcut - short, multiple keys',
	states: [
		{
			selector: {
				byRole: 'button',
				options: {
					name: 'Short with multiple keys',
				},
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(KeyboardShortcutsExample, {
	description: 'tooltip with keyboard shortcut - long content',
	states: [
		{
			selector: {
				byRole: 'button',
				options: {
					name: 'Long content',
				},
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(KeyboardShortcutGlobalStylesExample, {
	description: 'tooltip with keyboard shortcut - protect against global styles',
	states: [
		{
			selector: {
				byRole: 'button',
				options: {
					name: 'Hover over me',
				},
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(VrPositionAllExample, {
	description: 'tooltip position top',
	states: [
		{
			selector: {
				byTestId: 'trigger-top',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(VrPositionAllExample, {
	description: 'tooltip position right',
	states: [
		{
			selector: {
				byTestId: 'trigger-right',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(VrPositionAllExample, {
	description: 'tooltip position bottom',
	states: [
		{
			selector: {
				byTestId: 'trigger-bottom',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});

snapshot(VrPositionAllExample, {
	description: 'tooltip position left',
	states: [
		{
			selector: {
				byTestId: 'trigger-left',
			},
			state: 'hovered',
		},
	],
	drawsOutsideBounds: true,
	variants: lightModeVariant,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});
