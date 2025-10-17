import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import TooltipCustom from '../../../examples/component-prop';
import TooltipBasic from '../../../examples/default-tooltip';
import KeyboardShortcutsExample from '../../../examples/keyboard-shortcut';
import KeyboardShortcutGlobalStylesExample from '../../../examples/keyboard-shortcut-global-styles';
import TooltipPosition from '../../../examples/position';
import TooltipTruncateExample from '../../../examples/truncate';

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
		'platform-dst-tooltip-shortcuts': [true, false],
		'platform-component-visual-refresh': true,
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
		'platform-dst-tooltip-shortcuts': [true, false],
		'platform-component-visual-refresh': true,
	},
});

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
		'platform-dst-tooltip-shortcuts': [true, false],
		'platform-component-visual-refresh': true,
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
		'platform-dst-tooltip-shortcuts': true,
		'platform-component-visual-refresh': true,
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
		'platform-dst-tooltip-shortcuts': true,
		'platform-component-visual-refresh': true,
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
		'platform-dst-tooltip-shortcuts': true,
		'platform-component-visual-refresh': true,
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
		'platform-dst-tooltip-shortcuts': true,
		'platform-component-visual-refresh': true,
	},
});
