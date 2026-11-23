import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { ButtonMenuItemTypes } from '../../../../../examples/button-menu-item.vr.ap';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		device: Device.DESKTOP_CHROME,
		environment: { colorScheme: 'light' },
		name: 'desktop-chrome',
	},
];

snapshot(ButtonMenuItemTypes, {
	description: 'Button menu item types with the feature gate disabled',
	featureFlags: { navx_button_menu_item_types: false },
	variants,
});

snapshot(ButtonMenuItemTypes, {
	description: 'Button menu item types with the feature gate enabled',
	featureFlags: { navx_button_menu_item_types: true },
	variants,
});
