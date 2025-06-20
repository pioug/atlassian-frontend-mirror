import type { Hooks, SnapshotTestOptions } from '@af/visual-regression';
import { snapshotInformational } from '@atlassian/gemini';

import {
	MenuItemsDeeplyNestedSelectedVR,
	MenuItemsDeeplyNestedVR,
} from '../../../examples/menu-items-deeply-nested';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshotInformational(MenuItemsDeeplyNestedVR, {
	description: 'Side nav with deeply nested menu items',
	variants: lightModeVariant,
});

snapshotInformational(MenuItemsDeeplyNestedVR, {
	description: 'Side nav with deeply nested menu items - scrolled to the end',
	variants: lightModeVariant,
	prepare: async (page) => {
		await page.getByTestId('side-nav-content').hover();
		await page.mouse.wheel(500, 0);
	},
});

snapshotInformational(MenuItemsDeeplyNestedSelectedVR, {
	description: 'Side nav with deeply nested menu items - nested menu item selected',
	variants: lightModeVariant,
});
