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

		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
	},
});

snapshotInformational(ScrollableNoPanelVR, {
	...mobileOnlyOptions,
	description: 'Side nav expanded on mobile without panel',
	prepare: async (page) => {
		await page.getByTestId('side-nav-toggle-button').click();

		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);

		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
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

snapshotInformational(ScrollableVR, {
	...desktopOnlyOptions,
	description: 'Flyout menu item open - large viewport',
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Recent' }).click();
	},
	featureFlags: {
		platform_dst_nav4_flyoutmenuitem_render_to_parent: true,
		platform_design_system_nav4_panel_default_border: true,
	},
});

/**
 * Testing that the flyout menu item popup overlays over the Panel layout area
 */
snapshotInformational(ScrollableVR, {
	...desktopOnlyOptions,
	description: 'Flyout menu item open - medium viewport - overlays over panel',
	prepare: async (page) => {
		// Setting viewport dimensions to ensure flyout menu item overlays over Panel
		await page.setViewportSize({ width: 1030, height: 600 });

		await page.getByRole('button', { name: 'Recent' }).click();
	},
	featureFlags: {
		platform_dst_nav4_flyoutmenuitem_render_to_parent: true,
		platform_design_system_nav4_panel_default_border: true,
	},
});

/**
 * Testing that the flyout menu item popup overlays over the Aside layout area
 */
snapshotInformational(ScrollableNoPanelVR, {
	...desktopOnlyOptions,
	description: 'Flyout menu item open - medium viewport - overlays over aside',
	prepare: async (page) => {
		// Setting viewport dimensions to ensure flyout menu item overlays over Aside
		await page.setViewportSize({ width: 1030, height: 600 });

		await page.getByRole('button', { name: 'Recent' }).click();
	},
	featureFlags: {
		platform_dst_nav4_flyoutmenuitem_render_to_parent: true,
		platform_design_system_nav4_panel_default_border: true,
	},
});

snapshotInformational(ScrollableVR, {
	...mobileOnlyOptions,
	description: 'Flyout menu item open - mobile',
	prepare: async (page) => {
		await page.getByTestId('side-nav-toggle-button').click();

		await page.getByRole('button', { name: 'Recent' }).click();

		// Moving mouse so the button is no longer hovered, to avoid potential flake from tooltips
		await page.mouse.move(0, 0);
		// Explicitly wait for tooltip to disappear to avoid flake
		await page.getByRole('tooltip').waitFor({ state: 'hidden' });
	},
	featureFlags: {
		platform_dst_nav4_flyoutmenuitem_render_to_parent: true,
		platform_design_system_nav4_panel_default_border: true,
	},
});
