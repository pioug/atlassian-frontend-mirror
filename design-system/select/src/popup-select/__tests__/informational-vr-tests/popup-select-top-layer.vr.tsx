import { Device, snapshotInformational } from '@af/visual-regression';

import PopupSelectExample from '../../../../examples/18-popup-select';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(PopupSelectExample, {
	description: 'basic',
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
	],
	featureFlags: topLayerFlag,
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
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Target3' }).click();
	},
});
