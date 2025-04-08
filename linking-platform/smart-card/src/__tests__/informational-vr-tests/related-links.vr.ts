import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';

snapshotInformational(RelatedLinksResolvedView, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId('incoming-related-links-list-item-0').first().hover();
	},
	drawsOutsideBounds: true,
	description: 'resolved - hover state',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshotInformational(RelatedLinksResolvedView, {
	prepare: async (page: Page, _component: Locator) => {
		await page.getByTestId('incoming-related-links-list-item-0').first().click();
	},
	drawsOutsideBounds: true,
	description: 'resolved - selected state',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': true,
	},
});
