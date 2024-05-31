// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { OverflowLayoutRenderer } from './layout.fixture';

import { snapshotInformational } from '@af/visual-regression';

snapshotInformational(OverflowLayoutRenderer, {
	description: 'layout with overflow on left',
	prepare: async (page: Page) => {
		const overflowSection = page.getByText('dummy extensionscroll me').first();
		await overflowSection.click();
		const box = await overflowSection.boundingBox();
		await page.mouse.wheel(box!.width, 0);
	},
});

snapshotInformational(OverflowLayoutRenderer, {
	description: 'layout with partial overflow on both sides',
	prepare: async (page: Page) => {
		await page.getByText('dummy extensionscroll me').first().click();
		// Arbitrary amount to scroll a little so that we have overflow on both sides
		await page.mouse.wheel(50, 0);
	},
});
