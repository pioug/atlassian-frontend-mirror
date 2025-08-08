import { Device, snapshotInformational } from '@atlassian/gemini';

import TopNavWithLongProductName from '../../../../../examples/top-nav-with-long-name';
import { TopNavWithTempNavAppIconAppLogo } from '../../../../../examples/top-nav-with-temp-nav-app-icon-app-logo';
import { TopNavigationExample } from '../../../../../examples/top-navigation';
import { TopNavigationThemingSingleExample } from '../../../../../examples/top-navigation-theming';

snapshotInformational(TopNavigationExample, {
	description: 'responsive menu items on click',
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
	prepare: async (page) => {
		await page.setViewportSize({ width: 430, height: 930 });

		await page.getByText('Show more').click();
	},
});

snapshotInformational(TopNavigationExample, {
	description: 'responsive menu items',
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
	prepare: async (page) => {
		await page.setViewportSize({ width: 430, height: 930 });
	},
});

const interactionStateSharedOptions: Parameters<typeof snapshotInformational>[1] = {
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'mobile',
			environment: { colorScheme: 'light' },
			device: Device.MOBILE_CHROME,
		},
	],
	selector: {
		// Snapshot only the top nav
		byRole: 'banner',
	},
};

/**
 * Using informational for hovered snapshots too,
 * so we can keep all the tests for this colocated.
 *
 * Can make all these normal VR tests once pressed state variants are added to Gemini.
 */
snapshotInformational(TopNavWithTempNavAppIconAppLogo, {
	...interactionStateSharedOptions,
	description: 'nav logo hover',
	featureFlags: {
		'platform-team25-app-icon-tiles': true,
	},
	prepare: async (page) => {
		await page.getByRole('link', { name: 'Home page' }).hover();
	},
});

snapshotInformational(TopNavWithTempNavAppIconAppLogo, {
	...interactionStateSharedOptions,
	description: 'nav logo pressed',
	featureFlags: {
		'platform-team25-app-icon-tiles': true,
	},
	prepare: async (page) => {
		await page.getByRole('link', { name: 'Home page' }).hover();
		await page.mouse.down();
	},
});

snapshotInformational(TopNavigationThemingSingleExample, {
	...interactionStateSharedOptions,
	description: 'nav logo hover - custom theming',
	featureFlags: {
		'platform-team25-app-icon-tiles': true,
	},
	prepare: async (page) => {
		await page.getByRole('link', { name: 'Home page' }).hover();
	},
});

snapshotInformational(TopNavigationThemingSingleExample, {
	...interactionStateSharedOptions,
	description: 'nav logo pressed - custom theming',
	featureFlags: {
		'platform-team25-app-icon-tiles': true,
	},
	prepare: async (page) => {
		await page.getByRole('link', { name: 'Home page' }).hover();
		await page.mouse.down();
	},
});

snapshotInformational(TopNavWithLongProductName, {
	description: 'long product name tooltip',
	featureFlags: {
		'platform-team25-app-icon-tiles': true,
	},
	prepare: async (page) => {
		// Reduce the viewport size to remove whitespace but include the tooltip
		await page.setViewportSize({ width: 1200, height: 100 });
		await page.getByRole('link', { name: 'Home page' }).hover();
		await page.getByRole('tooltip').waitFor();
	},
	// We need to include the tooltip in this snapshot
	drawsOutsideBounds: true,
});
