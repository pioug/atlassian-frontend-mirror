import { Device, snapshotInformational } from '@af/visual-regression';

import PopupSelectExample from '../../../../examples/18-popup-select';

snapshotInformational(PopupSelectExample, {
	description: 'basic',
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		platform_dst_nav4_layering_in_main_slot_fixes: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'switcher' }).click();
	},
});

snapshotInformational(PopupSelectExample, {
	description: 'in scroll container',
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: {
		platform_dst_nav4_layering_in_main_slot_fixes: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Target3' }).click();
	},
});
