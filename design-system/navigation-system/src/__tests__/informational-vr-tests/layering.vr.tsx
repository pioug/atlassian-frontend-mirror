import { Device, type Hooks, type SnapshotTestOptions } from '@af/visual-regression';
import { snapshotInformational } from '@atlassian/gemini';

import { ScrollableNoPanelVR, ScrollableVR } from '../../../examples/composition';

const mobileOnlyOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
};

/**
 * As the side nav is always collapsed by default on small screens (the `defaultCollapsed` prop is only for large screens),
 * we need to click the side nav toggle button in the top bar to expand the side nav in VR tests for mobile viewports.
 */
snapshotInformational(ScrollableVR, {
	...mobileOnlyOptions,
	description: 'Side nav expanded on mobile',
	prepare: async (page) => {
		await page.getByTestId('side-nav-toggle-button').click();
	},
});

snapshotInformational(ScrollableNoPanelVR, {
	...mobileOnlyOptions,
	description: 'Side nav expanded on mobile without panel',
	prepare: async (page) => {
		await page.getByTestId('side-nav-toggle-button').click();
	},
});
