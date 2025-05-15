import { Device, snapshotInformational } from '@af/visual-regression';

import FallbackPlacements from '../../../../examples/11-fallback-placements';

snapshotInformational(FallbackPlacements, {
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
		{
			environment: { colorScheme: 'light' },
			name: 'mobile',
			device: Device.MOBILE_CHROME,
		},
	],
	prepare: async (page) => {
		await page.getByTestId('inline-message--button').click();
	},
});
