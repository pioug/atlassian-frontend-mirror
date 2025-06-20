import { Device, snapshotInformational } from '@af/visual-regression';

import {
	CompanyHubMockExample,
	CompanyHubMockSmallDefaultPanelWidthExample,
} from '../../../../../examples/company-hub-mock';

/**
 * With the flag on, the small panel is not forced to be larger on mobile.
 */
snapshotInformational(CompanyHubMockSmallDefaultPanelWidthExample, {
	description: 'small panel default width on mobile',
	featureFlags: {
		platform_design_system_nav4_panel_mobile_width_fix: [true, false],
	},
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	async prepare(page) {
		// The important part is that the viewport width is below `768px`
		// Not using Device.MOBILE_CHROME because it would start shrinking the panel because it's so narrow,
		// so the snapshot result isn't as clear.
		await page.setViewportSize({ width: 700, height: 700 });
	},
});

/**
 * With the flag on, the large panel is shrunk to `400px` (its minimum resizing width)
 * instead of `365px`.
 */
snapshotInformational(CompanyHubMockExample, {
	description: 'large panel default width on mobile',
	featureFlags: {
		platform_design_system_nav4_panel_mobile_width_fix: [true, false],
	},
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	async prepare(page) {
		// The important part is that the viewport width is below `768px`
		// Not using Device.MOBILE_CHROME because it would start shrinking the panel because it's so narrow,
		// so the snapshot result isn't as clear.
		await page.setViewportSize({ width: 700, height: 700 });
	},
});
