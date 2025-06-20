import type { Page } from '@playwright/test';

import {
	Device,
	type Hooks,
	snapshotInformational,
	type SnapshotTestOptions,
} from '@af/visual-regression';

import { CompositionVR } from '../../../../../examples/composition';
import TopNavigationStressExample from '../../../../../examples/top-navigation-stress';

/**
 * There seems to be a bug with the grid layouts in the Chrome snapshots.
 *
 * The columns don't get calculated the same way they do in a real browser,
 * and there were incorrect snapshots.
 *
 * Using Firefox as a workaround because it matches what is actually seen by users.
 */
const chromeBugWorkaroundVariants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Firefox', device: Device.DESKTOP_FIREFOX, environment: { colorScheme: 'light' } },
];

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint xs',
	featureFlags: { platform_design_system_nav4_top_nav_columns: true },
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 480,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint sm',
	featureFlags: { platform_design_system_nav4_top_nav_columns: true },
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 768,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint md',
	featureFlags: { platform_design_system_nav4_top_nav_columns: true },
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1024,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint lg',
	featureFlags: { platform_design_system_nav4_top_nav_columns: true },
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1440,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint xl',
	featureFlags: { platform_design_system_nav4_top_nav_columns: true },
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1768,
			height: 720,
		});
	},
});

/**
 * Introducing column min widths
 */

snapshotInformational(CompositionVR, {
	description: 'breakpoint md - composition',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1024,
			height: 720,
		});
	},
});

snapshotInformational(CompositionVR, {
	description: 'breakpoint lg - composition',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1440,
			height: 720,
		});
	},
});

snapshotInformational(CompositionVR, {
	description: 'breakpoint xl - composition',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1768,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint xs - with min widths',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 480,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint sm - with min widths',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 768,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint md - with min widths',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1024,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint lg - with min widths',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1440,
			height: 720,
		});
	},
});

snapshotInformational(TopNavigationStressExample, {
	description: 'breakpoint xl - with min widths',
	featureFlags: {
		platform_design_system_nav4_top_nav_columns: true,
		platform_design_system_nav4_top_nav_min_widths: true,
	},
	variants: chromeBugWorkaroundVariants,
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1768,
			height: 720,
		});
	},
});
