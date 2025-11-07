import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	PanelSplitterPositionEnd,
	PanelSplitterPositionStart,
	PanelSplitterWithTooltip,
	PanelSplitterWithTooltipAndShortcut,
} from '../../../../../examples/panel-splitter';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(PanelSplitterPositionStart, {
	description: 'Hovered panel splitter with position: start',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
	variants: lightModeVariant,
});

snapshot(PanelSplitterPositionEnd, {
	description: 'Hovered panel splitter with position: end',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
	variants: lightModeVariant,
});

snapshot(PanelSplitterPositionStart, {
	description: 'Focused panel splitter with position: start',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'slider',
				options: {
					name: 'Resize panel',
				},
			},
		},
	],
	variants: lightModeVariant,
});

snapshot(PanelSplitterPositionEnd, {
	description: 'Focused panel splitter with position: end',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'slider',
				options: {
					name: 'Resize panel',
				},
			},
		},
	],
	variants: lightModeVariant,
});

snapshot(PanelSplitterWithTooltip, {
	description: 'Panel splitter with tooltip content - hovered',
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(PanelSplitterWithTooltipAndShortcut, {
	description: 'Panel splitter with both tooltip content and shortcut - hovered',
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});
