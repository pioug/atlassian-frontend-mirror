import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { CompositionVR } from '../../../../../examples/composition';

snapshotInformational(CompositionVR, {
	description: 'above md breakpoint - side nav expanded',
	featureFlags: {
		platform_design_system_nav4_panel_default_border: [false, true],
		platform_design_system_nav4_sidenav_border: [false, true],
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1024,
			height: 768,
		});
	},
});

snapshotInformational(CompositionVR, {
	description: 'above md breakpoint - side nav flyout',
	featureFlags: {
		platform_design_system_nav4_panel_default_border: [false, true],
		platform_design_system_nav4_sidenav_border: [false, true],
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1024,
			height: 768,
		});

		await page.getByRole('button', { name: 'Collapse sidebar' }).click();
		await page.getByRole('search').hover();
		await page.getByRole('button', { name: 'Expand sidebar' }).hover();
		await page.getByLabel('Sidebar').waitFor({ state: 'visible' });
	},
});

snapshotInformational(CompositionVR, {
	description: 'below md breakpoint - side nav expanded',
	featureFlags: {
		platform_design_system_nav4_panel_default_border: [false, true],
		platform_design_system_nav4_sidenav_border: [false, true],
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1023,
			height: 768,
		});

		await page.getByRole('button', { name: 'Expand sidebar' }).click();
	},
});
