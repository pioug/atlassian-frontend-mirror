import { Device, type Hooks, type SnapshotTestOptions } from '@af/visual-regression';
import { snapshotInformational } from '@atlassian/gemini';

import { ScrollableNoPanelVR, ScrollableVR } from '../../../examples/composition';
import { LayersInMainShouldForceOpenLayers } from '../../../examples/layers-in-main';

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

const desktopOnlyOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
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

		// Wait for the tooltip to be displayed, to reduce flakiness
		await page.getByRole('tooltip').waitFor();
	},
});

snapshotInformational(ScrollableNoPanelVR, {
	...mobileOnlyOptions,
	description: 'Side nav expanded on mobile without panel',
	prepare: async (page) => {
		await page.getByTestId('side-nav-toggle-button').click();

		// Wait for the tooltip to be displayed, to reduce flakiness
		await page.getByRole('tooltip').waitFor();
	},
});

snapshotInformational(LayersInMainShouldForceOpenLayers, {
	...desktopOnlyOptions,
	description: 'layers in main slot',
	featureFlags: {
		platform_dst_nav4_layering_in_main_slot_fixes: [true, false],
		'platform-component-visual-refresh': true,
		platform_design_system_nav4_panel_default_border: true,
	},
});

snapshotInformational(LayersInMainShouldForceOpenLayers, {
	...desktopOnlyOptions,
	description: 'layers in main slot short viewport',
	featureFlags: {
		platform_dst_nav4_layering_in_main_slot_fixes: [true, false],
		'platform-component-visual-refresh': true,
		platform_design_system_nav4_panel_default_border: true,
	},
	prepare: async (page) => {
		await page.setViewportSize({ width: 1280, height: 400 });
	},
});
