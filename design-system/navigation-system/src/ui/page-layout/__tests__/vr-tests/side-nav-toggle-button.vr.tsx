import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	SideNavToggleButtonVR,
	SideNavToggleButtonWithShortcutVR,
} from '../../../../../examples/side-nav-toggle-button';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(SideNavToggleButtonVR, {
	description: 'Toggle button - hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Collapse sidebar',
				},
			},
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	variants: lightModeVariant,
});

snapshot(SideNavToggleButtonWithShortcutVR, {
	description: 'Toggle button with shortcut - hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Collapse sidebar',
				},
			},
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-full-height-sidebar': true,
	},
	variants: lightModeVariant,
});
