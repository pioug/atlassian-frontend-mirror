import { snapshot } from '@af/visual-regression';

import {
	SideNavToggleButtonVR,
	SideNavToggleButtonWithShortcutVR,
} from '../../../../../examples/side-nav-toggle-button';

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
		'platform-dst-tooltip-shortcuts': true,
	},
});
