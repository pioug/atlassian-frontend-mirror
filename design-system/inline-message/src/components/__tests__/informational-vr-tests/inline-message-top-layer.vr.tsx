import { Device, snapshotInformational } from '@af/visual-regression';

import Basic from '../../../../examples/01-basic';
import FallbackPlacements from '../../../../examples/11-fallback-placements';
import Testing from '../../../../examples/99-testing';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(Basic, {
	description: 'basic inline message with top-layer flag',
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByTestId('inline-message--button').click();
	},
});

snapshotInformational(Testing, {
	description: 'testing inline message with top-layer flag',
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByTestId('the-inline-message--button').click();
	},
});

snapshotInformational(FallbackPlacements, {
	description: 'fallback placements with top-layer flag',
	featureFlags: topLayerFlag,
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
